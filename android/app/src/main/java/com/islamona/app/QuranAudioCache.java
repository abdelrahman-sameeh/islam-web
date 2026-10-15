package com.islamona.app;

import android.content.Context;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import javax.net.ssl.HttpsURLConnection;

final class QuranAudioCache {

    private static final String LEGACY_CACHE_DIRECTORY = "quran-audio";
    private static final String SAVED_DIRECTORY = "quran-audio-saved";
    private static final int CONNECT_TIMEOUT_MS = 15_000;
    private static final int READ_TIMEOUT_MS = 30_000;
    private static final ExecutorService DOWNLOAD_EXECUTOR = Executors.newSingleThreadExecutor();
    private static final Set<String> FAILED_DOWNLOADS = ConcurrentHashMap.newKeySet();

    private QuranAudioCache() {}

    static File getCachedFile(Context context, String url) {
        if (url == null || url.isBlank()) return null;

        File savedFile = getSavedFile(context, url);
        return savedFile.isFile() && savedFile.length() > 0 ? savedFile : null;
    }

    static String getStatus(Context context, String url) {
        if (url == null || url.isBlank()) return "remote";
        File savedFile = getSavedFile(context, url);
        if (savedFile.isFile() && savedFile.length() > 0) return "saved";
        return FAILED_DOWNLOADS.contains(url) ? "error" : "remote";
    }

    static void clearLegacyCache(Context context) {
        File directory = new File(context.getNoBackupFilesDir(), LEGACY_CACHE_DIRECTORY);
        File[] files = directory.listFiles();
        if (files != null) {
            for (File file : files) file.delete();
        }
        directory.delete();
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
                ensureDirectory(getSavedDirectory(appContext));
                download(url, getSavedDirectory(appContext));
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

    private static void download(String urlValue, File directory) throws Exception {
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
                throw new IllegalStateException("Could not finish audio download");
            }
            destination.setLastModified(System.currentTimeMillis());
        } finally {
            connection.disconnect();
            if (partial.exists()) partial.delete();
        }
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
