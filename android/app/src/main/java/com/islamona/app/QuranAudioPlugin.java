package com.islamona.app;

import android.content.ComponentName;
import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;
import androidx.core.content.ContextCompat;
import androidx.media3.common.C;
import androidx.media3.common.MediaItem;
import androidx.media3.common.MediaMetadata;
import androidx.media3.common.PlaybackException;
import androidx.media3.common.Player;
import androidx.media3.session.MediaController;
import androidx.media3.session.SessionToken;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.common.util.concurrent.ListenableFuture;
import java.io.File;
import java.net.URI;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executor;

@CapacitorPlugin(name = "QuranAudio")
public class QuranAudioPlugin extends Plugin {

    private static final String DOWNLOAD_PREFERENCES = "quran_audio_downloads";
    private static final String PLAYER_PREFERENCES = "quran_audio_player";
    private static final String VOLUME_KEY = "volume";

    private ListenableFuture<MediaController> controllerFuture;
    private MediaController controller;
    private Executor mainExecutor;
    private String playbackError;

    @Override
    public void load() {
        mainExecutor = ContextCompat.getMainExecutor(getContext());
        SessionToken sessionToken = new SessionToken(
            getContext(),
            new ComponentName(getContext(), QuranPlaybackService.class)
        );
        controllerFuture = new MediaController.Builder(getContext(), sessionToken).buildAsync();
        controllerFuture.addListener(this::attachController, mainExecutor);
    }

    @PluginMethod
    public void play(PluginCall call) {
        String url = call.getString("url");
        String title = call.getString("title", "القرآن الكريم");
        String artist = call.getString("artist", "دقائق نور");
        if (!isValidHttpsUrl(url)) {
            call.reject("A valid HTTPS audio URL is required");
            return;
        }

        withController(call, mediaController -> {
            playbackError = null;
            File cachedFile = QuranAudioCache.getCachedFile(getContext(), url);
            Uri source = cachedFile == null ? Uri.parse(url) : Uri.fromFile(cachedFile);
            MediaItem currentItem = mediaController.getCurrentMediaItem();

            if (currentItem == null || !url.equals(currentItem.mediaId)) {
                MediaMetadata metadata = new MediaMetadata.Builder()
                    .setTitle(title)
                    .setArtist(artist)
                    .setAlbumTitle("دقائق نور")
                    .build();
                MediaItem mediaItem = new MediaItem.Builder()
                    .setMediaId(url)
                    .setUri(source)
                    .setMediaMetadata(metadata)
                    .build();
                mediaController.setMediaItem(mediaItem);
                mediaController.prepare();
            } else if (mediaController.getPlaybackState() == Player.STATE_ENDED) {
                mediaController.seekTo(0);
                mediaController.prepare();
            }

            mediaController.play();
            if (cachedFile == null) {
                QuranAudioCache.saveInBackground(getContext(), url, () -> mainExecutor.execute(this::notifyState));
            }
            call.resolve(createState(url));
            notifyState();
        });
    }

    @PluginMethod
    public void pause(PluginCall call) {
        withController(call, mediaController -> {
            mediaController.pause();
            call.resolve(createState(null));
            notifyState();
        });
    }

    @PluginMethod
    public void stop(PluginCall call) {
        withController(call, mediaController -> {
            mediaController.stop();
            mediaController.clearMediaItems();
            playbackError = null;
            call.resolve(createState(null));
            notifyState();
        });
    }

    @PluginMethod
    public void seekTo(PluginCall call) {
        Long position = call.getLong("position");
        if (position == null || position < 0) {
            call.reject("A non-negative position is required");
            return;
        }

        withController(call, mediaController -> {
            long duration = getDuration(mediaController);
            mediaController.seekTo(duration > 0 ? Math.min(position, duration) : position);
            call.resolve(createState(null));
            notifyState();
        });
    }

    @PluginMethod
    public void setVolume(PluginCall call) {
        Double volume = call.getDouble("volume");
        if (volume == null || volume < 0 || volume > 1) {
            call.reject("Volume must be between zero and one");
            return;
        }

        withController(call, mediaController -> {
            mediaController.setVolume(volume.floatValue());
            getContext()
                .getSharedPreferences(PLAYER_PREFERENCES, Context.MODE_PRIVATE)
                .edit()
                .putFloat(VOLUME_KEY, volume.floatValue())
                .apply();
            call.resolve(createState(null));
            notifyState();
        });
    }

    @PluginMethod
    public void saveForOffline(PluginCall call) {
        String url = call.getString("url");
        if (!isValidHttpsUrl(url)) {
            call.reject("A valid HTTPS audio URL is required");
            return;
        }

        QuranAudioCache.savePermanently(getContext(), url, isSaved ->
            mainExecutor.execute(() -> {
                if (!isSaved) {
                    call.reject("Could not save recitation");
                    return;
                }

                saveDownloadMetadata(call, url);
                call.resolve(createState(url));
                notifyState();
            })
        );
    }

    @PluginMethod
    public void listDownloads(PluginCall call) {
        SharedPreferences preferences = getContext().getSharedPreferences(
            DOWNLOAD_PREFERENCES,
            Context.MODE_PRIVATE
        );
        List<JSObject> downloads = new ArrayList<>();

        for (Map.Entry<String, ?> entry : preferences.getAll().entrySet()) {
            String url = entry.getKey();
            long size = QuranAudioCache.getSavedSize(getContext(), url);
            if (size <= 0 || !(entry.getValue() instanceof String)) {
                preferences.edit().remove(url).apply();
                continue;
            }

            try {
                JSObject item = new JSObject((String) entry.getValue());
                item.put("size", size);
                downloads.add(item);
            } catch (Exception ignored) {
                preferences.edit().remove(url).apply();
            }
        }

        downloads.sort(Comparator.comparingLong(item -> -item.optLong("savedAt", 0)));
        JSArray items = new JSArray();
        for (JSObject item : downloads) items.put(item);

        JSObject result = new JSObject();
        result.put("items", items);
        call.resolve(result);
    }

    @PluginMethod
    public void removeDownload(PluginCall call) {
        String url = call.getString("url");
        if (!isValidHttpsUrl(url)) {
            call.reject("A valid HTTPS audio URL is required");
            return;
        }

        if (!QuranAudioCache.removeSaved(getContext(), url)) {
            call.reject("Could not remove recitation");
            return;
        }

        getContext()
            .getSharedPreferences(DOWNLOAD_PREFERENCES, Context.MODE_PRIVATE)
            .edit()
            .remove(url)
            .apply();
        JSObject result = new JSObject();
        result.put("removed", true);
        call.resolve(result);
        notifyState();
    }

    @PluginMethod
    public void getState(PluginCall call) {
        String requestedUrl = call.getString("url");
        withController(call, mediaController -> call.resolve(createState(requestedUrl)));
    }

    @Override
    protected void handleOnDestroy() {
        if (controller != null) controller.removeListener(playerListener);
        if (controllerFuture != null) MediaController.releaseFuture(controllerFuture);
        controller = null;
    }

    private void attachController() {
        try {
            controller = controllerFuture.get();
            float savedVolume = getContext()
                .getSharedPreferences(PLAYER_PREFERENCES, Context.MODE_PRIVATE)
                .getFloat(VOLUME_KEY, 1f);
            controller.setVolume(savedVolume);
            controller.addListener(playerListener);
            notifyState();
        } catch (Exception ignored) {
            controller = null;
        }
    }

    private final Player.Listener playerListener = new Player.Listener() {
        @Override
        public void onEvents(Player player, Player.Events events) {
            notifyState();
        }

        @Override
        public void onPlayerError(PlaybackException error) {
            playbackError = "PLAYBACK_FAILED";
            notifyState();
        }
    };

    private void notifyState() {
        if (controller == null) return;
        notifyListeners("playbackStateChanged", createState(null));
    }

    private JSObject createState(String requestedUrl) {
        JSObject state = new JSObject();
        String currentUrl = getCurrentUrl();
        String cacheUrl = requestedUrl == null ? currentUrl : requestedUrl;

        state.put("currentUrl", currentUrl == null ? "" : currentUrl);
        state.put("isPlaying", controller != null && controller.isPlaying());
        state.put("position", controller == null ? 0 : Math.max(0, controller.getCurrentPosition()));
        state.put("duration", controller == null ? 0 : getDuration(controller));
        state.put("playbackState", controller == null ? "idle" : getPlaybackState(controller));
        state.put("cacheStatus", QuranAudioCache.getStatus(getContext(), cacheUrl));
        state.put("volume", controller == null ? 1 : controller.getVolume());
        state.put("error", playbackError == null ? "" : playbackError);
        return state;
    }

    private void saveDownloadMetadata(PluginCall call, String url) {
        JSObject metadata = new JSObject();
        metadata.put("audioUrl", url);
        metadata.put("surahId", call.getString("surahId", "1"));
        metadata.put("surahName", call.getString("title", "القرآن الكريم"));
        metadata.put("reciterId", call.getString("reciterId", ""));
        metadata.put("reciterName", call.getString("artist", "دقائق نور"));
        metadata.put("savedAt", System.currentTimeMillis());
        metadata.put("size", QuranAudioCache.getSavedSize(getContext(), url));

        getContext()
            .getSharedPreferences(DOWNLOAD_PREFERENCES, Context.MODE_PRIVATE)
            .edit()
            .putString(url, metadata.toString())
            .apply();
    }

    private String getCurrentUrl() {
        if (controller == null || controller.getCurrentMediaItem() == null) return null;
        return controller.getCurrentMediaItem().mediaId;
    }

    private long getDuration(MediaController mediaController) {
        long duration = mediaController.getDuration();
        return duration == C.TIME_UNSET ? 0 : Math.max(0, duration);
    }

    private String getPlaybackState(MediaController mediaController) {
        return switch (mediaController.getPlaybackState()) {
            case Player.STATE_IDLE -> "idle";
            case Player.STATE_BUFFERING -> "buffering";
            case Player.STATE_READY -> "ready";
            case Player.STATE_ENDED -> "ended";
            default -> "idle";
        };
    }

    private boolean isValidHttpsUrl(String value) {
        if (value == null || value.isBlank()) return false;
        try {
            return "https".equalsIgnoreCase(URI.create(value).getScheme());
        } catch (IllegalArgumentException error) {
            return false;
        }
    }

    private void withController(PluginCall call, ControllerAction action) {
        if (controllerFuture == null) {
            call.reject("Audio controller is unavailable");
            return;
        }

        controllerFuture.addListener(() -> {
            try {
                MediaController mediaController = controllerFuture.get();
                action.run(mediaController);
            } catch (Exception error) {
                call.reject("Could not connect to the audio service", error);
            }
        }, mainExecutor);
    }

    private interface ControllerAction {
        void run(MediaController mediaController);
    }
}
