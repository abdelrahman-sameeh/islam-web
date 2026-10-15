package com.islamona.app;

import android.content.Context;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import javax.net.ssl.HttpsURLConnection;

final class QuranAudioCache {

    private static final int CACHE_LIMIT = 3;
    private static final String RECENT_DIRECTORY = "quran-audio";
    private static final String SAVED_DIRECTORY = "quran-audio-saved";
    private static final int CONNECT_TIMEOUT_MS = 15_000;
    private static final int READ_TIMEOUT_MS = 30_000;
    private static final ExecutorService DOWNLOAD_EXECUTOR = Executors.newSingleThreadExecutor();
    private static final Set<String> ACTIVE_DOWNLOADS = ConcurrentHashMap.newKeySet();
    private static final Set<String> FAILED_DOWNLOADS = ConcurrentHashMap.newKeySet();

    private QuranAudioCache() {}

    static File getCachedFile(Context context, String url) {
        if (url == null || url.isBlank()) return null;

        File savedFile = getSavedFile(context, url);
        if (savedFile.isFile() && savedFile.length() > 0) return savedFile;

        File file = new File(getRecentDirectory(context), getFileName(url));
        if (!file.isFile() || file.length() == 0) return null;

        // The file timestamp is the cache's simple least-recently-used marker.
        file.setLastModified(System.currentTimeMillis());
        return file;
    }

    static String getStatus(Context context, String url) {
        if (url == null || url.isBlank()) return "remote";
        File savedFile = getSavedFile(context, url);
        if (savedFile.isFile() && savedFile.length() > 0) return "saved";
        if (getCachedFile(context, url) != null) return "cached";
        if (ACTIVE_DOWNLOADS.contains(url)) return "saving";
        return FAILED_DOWNLOADS.contains(url) ? "error" : "remote";
    }

    static void saveInBackground(Context context, String url, Runnable onFinished) {
        if (getCachedFile(context, url) != null || !ACTIVE_DOWNLOADS.add(url)) return;
        FAILED_DOWNLOADS.remove(url);

        Context appContext = context.getApplicationContext();
        DOWNLOAD_EXECUTOR.execute(() -> {
            try {
                download(appContext, url, getRecentDirectory(appContext));
                trim(appContext);
            } catch (Exception ignored) {
                FAILED_DOWNLOADS.add(url);
                // Playback can continue from the remote source if caching fails.
            } finally {
                ACTIVE_DOWNLOADS.remove(url);
                if (onFinished != null) onFinished.run();
            }
        });
    }

    static void savePermanently(Context context, String url, SaveCallback callback) {
        File savedFile = getSavedFile(context, url);
        if (savedFile.isFile() && savedFile.length() > 0) {
            callback.onFinished(true);
            return;
        }

        Context appContext = context.getApplicationContext();
        DOWNLOAD_EXECUTOR.execute(() -> {
            boolean isSaved = false;
            try {
                File recentFile = new File(getRecentDirectory(appContext), getFileName(url));
                ensureDirectory(getSavedDirectory(appContext));
                if (recentFile.isFile() && recentFile.length() > 0) {
                    moveFile(recentFile, getSavedFile(appContext, url));
                } else {
                    download(appContext, url, getSavedDirectory(appContext));
                }
                FAILED_DOWNLOADS.remove(url);
                isSaved = true;
            } catch (Exception ignored) {
                FAILED_DOWNLOADS.add(url);
            }
            callback.onFinished(isSaved);
        });
    }

    static boolean removeSaved(Context context, String url) {
        File file = getSavedFile(context, url);
        return !file.exists() || file.delete();
    }

    static long getSavedSize(Context context, String url) {
        File file = getSavedFile(context, url);
        return file.isFile() ? file.length() : 0;
    }

    private static void download(Context context, String urlValue, File directory) throws Exception {
        URL url = new URL(urlValue);
        if (!"https".equalsIgnoreCase(url.getProtocol())) {
            throw new IllegalArgumentException("Only HTTPS audio sources are allowed");
        }

        ensureDirectory(directory);

        File destination = new File(directory, getFileName(urlValue));
        File partial = new File(directory, destination.getName() + ".part");
        HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
        connection.setConnectTimeout(CONNECT_TIMEOUT_MS);
        connection.setReadTimeout(READ_TIMEOUT_MS);
        connection.setInstanceFollowRedirects(true);
        connection.setRequestProperty("User-Agent", "DaqaeqNoor-Android");

        try {
            int responseCode = connection.getResponseCode();
            if (responseCode < 200 || responseCode >= 300) {
                throw new IllegalStateException("Audio request failed: " + responseCode);
            }

            try (
                BufferedInputStream input = new BufferedInputStream(connection.getInputStream());
                BufferedOutputStream output = new BufferedOutputStream(new FileOutputStream(partial))
            ) {
                byte[] buffer = new byte[16 * 1024];
                int bytesRead;
                while ((bytesRead = input.read(buffer)) != -1) {
                    output.write(buffer, 0, bytesRead);
                }
            }

            if (partial.length() == 0 || !partial.renameTo(destination)) {
                throw new IllegalStateException("Could not finish audio cache file");
            }
            destination.setLastModified(System.currentTimeMillis());
        } finally {
            connection.disconnect();
            if (partial.exists()) partial.delete();
        }
    }

    private static void trim(Context context) {
        File[] files = getRecentDirectory(context).listFiles(
            file -> file.isFile() && !file.getName().endsWith(".part")
        );
        if (files == null || files.length <= CACHE_LIMIT) return;

        Arrays.sort(files, Comparator.comparingLong(File::lastModified).reversed());
        for (int index = CACHE_LIMIT; index < files.length; index += 1) {
            files[index].delete();
        }
    }

    private static File getRecentDirectory(Context context) {
        return new File(context.getNoBackupFilesDir(), RECENT_DIRECTORY);
    }

    private static File getSavedDirectory(Context context) {
        return new File(context.getNoBackupFilesDir(), SAVED_DIRECTORY);
    }

    private static File getSavedFile(Context context, String url) {
        return new File(getSavedDirectory(context), getFileName(url));
    }

    private static void ensureDirectory(File directory) {
        if (!directory.exists() && !directory.mkdirs()) {
            throw new IllegalStateException("Could not create audio directory");
        }
    }

    private static void moveFile(File source, File destination) throws Exception {
        if (source.renameTo(destination)) return;

        try (
            BufferedInputStream input = new BufferedInputStream(new FileInputStream(source));
            BufferedOutputStream output = new BufferedOutputStream(new FileOutputStream(destination))
        ) {
            byte[] buffer = new byte[16 * 1024];
            int bytesRead;
            while ((bytesRead = input.read(buffer)) != -1) {
                output.write(buffer, 0, bytesRead);
            }
        }

        if (destination.length() == 0 || !source.delete()) {
            destination.delete();
            throw new IllegalStateException("Could not move cached audio");
        }
    }

    private static String getFileName(String url) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(url.getBytes(StandardCharsets.UTF_8));
            StringBuilder value = new StringBuilder();
            for (byte item : hash) value.append(String.format("%02x", item));
            return value + ".mp3";
        } catch (Exception error) {
            throw new IllegalStateException("Could not create audio cache key", error);
        }
    }

    interface SaveCallback {
        void onFinished(boolean isSaved);
    }
}
