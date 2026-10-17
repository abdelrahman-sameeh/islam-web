package com.islamona.app;

final class QuranAudioPosition {

    private QuranAudioPosition() {}

    static Long fromBridgeValue(Object value) {
        if (!(value instanceof Number number)) return null;

        double position = number.doubleValue();
        if (!Double.isFinite(position) || position < 0 || position > Long.MAX_VALUE) {
            return null;
        }

        return Math.round(position);
    }
}
