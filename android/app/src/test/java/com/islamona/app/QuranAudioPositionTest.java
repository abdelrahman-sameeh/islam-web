package com.islamona.app;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

import org.junit.Test;

public class QuranAudioPositionTest {

    @Test
    public void acceptsIntegerSentByJavascriptBridge() {
        assertEquals(Long.valueOf(10_000), QuranAudioPosition.fromBridgeValue(10_000));
    }

    @Test
    public void acceptsOtherNumericBridgeRepresentations() {
        assertEquals(Long.valueOf(10_000), QuranAudioPosition.fromBridgeValue(10_000L));
        assertEquals(Long.valueOf(10_001), QuranAudioPosition.fromBridgeValue(10_000.6));
    }

    @Test
    public void rejectsInvalidPositions() {
        assertNull(QuranAudioPosition.fromBridgeValue(null));
        assertNull(QuranAudioPosition.fromBridgeValue("10000"));
        assertNull(QuranAudioPosition.fromBridgeValue(-1));
        assertNull(QuranAudioPosition.fromBridgeValue(Double.NaN));
        assertNull(QuranAudioPosition.fromBridgeValue(Double.POSITIVE_INFINITY));
    }
}
