import { useCallback, useEffect, useState } from "react";
import { getStoredValue, setStoredValue } from "../../../lib/deviceStorage";
import { getPrayerTimes } from "../api/prayerTimesApi";
import {
  DEFAULT_LOCATION_ID,
  LEGACY_PRAYER_CITY_STORAGE_KEY,
  PRAYER_LOCATION_STORAGE_KEY,
  getLegacyEgyptLocation,
  getPrayerLocation,
} from "../data/prayerLocations";

const usePrayerTimes = () => {
  const [locationId, setLocationId] = useState(null);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    let isActive = true;

    Promise.all([
      getStoredValue(PRAYER_LOCATION_STORAGE_KEY),
      getStoredValue(LEGACY_PRAYER_CITY_STORAGE_KEY),
    ]).then(([storedLocationId, legacyCity]) => {
      if (!isActive) return;

      const nextLocationId = getPrayerLocation(storedLocationId)
        ? storedLocationId
        : getLegacyEgyptLocation(legacyCity) ?? DEFAULT_LOCATION_ID;
      setLocationId(nextLocationId);
    });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const location = getPrayerLocation(locationId);
    if (!location) return undefined;

    const controller = new AbortController();
    setStatus("loading");

    getPrayerTimes(location, controller.signal)
      .then((result) => {
        setData(result);
        setStatus(result.prayers.length ? "success" : "empty");
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("error");
      });

    void setStoredValue(PRAYER_LOCATION_STORAGE_KEY, locationId);

    return () => controller.abort();
  }, [locationId, requestVersion]);

  const retry = useCallback(() => {
    setRequestVersion((value) => value + 1);
  }, []);

  return {
    data,
    locationId,
    retry,
    selectedLocation: getPrayerLocation(locationId),
    setLocationId,
    status,
  };
};

export default usePrayerTimes;
