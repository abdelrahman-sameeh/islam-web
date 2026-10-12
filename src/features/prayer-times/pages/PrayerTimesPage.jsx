import { faClock, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import FeedbackState from "../../../components/feedback/FeedbackState";
import PageHeader from "../../../components/layout/PageHeader";
import SearchableSelect from "../../../components/ui/SearchableSelect";
import SourceBadge from "../../../components/ui/SourceBadge";
import { getStoredValue, setStoredValue } from "../../../lib/deviceStorage";
import { getPrayerTimes } from "../api/prayerTimesApi";
import {
  DEFAULT_LOCATION_ID,
  PRAYER_COUNTRIES,
  getLegacyEgyptLocation,
  getLocationId,
  getPrayerLocation,
} from "../data/prayerLocations";

const LOCATION_STORAGE_KEY = "islamona.prayer-location.v2";
const LEGACY_CITY_STORAGE_KEY = "islamona.prayer-city.v1";
const PRAYER_KEYS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const formatPrayerTime = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return new Intl.DateTimeFormat("ar-EG", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const getCurrentMinutes = (timezone) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const hours = Number(parts.find(({ type }) => type === "hour")?.value ?? 0);
  const minutes = Number(
    parts.find(({ type }) => type === "minute")?.value ?? 0
  );
  return hours * 60 + minutes;
};

const getNextPrayer = (prayers, timezone) => {
  const currentMinutes = getCurrentMinutes(timezone);
  const requiredPrayers = prayers.filter(({ key }) => PRAYER_KEYS.includes(key));
  const todayPrayer = requiredPrayers.find(
    ({ time }) => timeToMinutes(time) > currentMinutes
  );
  const prayer = todayPrayer ?? requiredPrayers[0];

  if (!prayer) return null;

  let remaining = timeToMinutes(prayer.time) - currentMinutes;
  if (remaining <= 0) remaining += 24 * 60;

  return {
    ...prayer,
    isTomorrow: !todayPrayer,
    remaining,
  };
};

const formatRemaining = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `متبقي ${rest.toLocaleString("ar-EG")} دقيقة`;
  if (!rest) return `متبقي ${hours.toLocaleString("ar-EG")} ساعة`;
  return `متبقي ${hours.toLocaleString("ar-EG")} ساعة و${rest.toLocaleString("ar-EG")} دقيقة`;
};

const PrayerTimesPage = () => {
  const [locationId, setLocationId] = useState(null);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    let isActive = true;

    Promise.all([
      getStoredValue(LOCATION_STORAGE_KEY),
      getStoredValue(LEGACY_CITY_STORAGE_KEY),
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

    void setStoredValue(LOCATION_STORAGE_KEY, locationId);

    return () => controller.abort();
  }, [locationId, requestVersion]);

  const selectedLocation = getPrayerLocation(locationId);
  const selectedCountry = selectedLocation?.country ?? PRAYER_COUNTRIES[0];
  const selectedCity = selectedLocation?.city ?? selectedCountry.cities[0];
  const nextPrayer = useMemo(
    () => (data ? getNextPrayer(data.prayers, data.timezone) : null),
    [data]
  );

  const handleCountryChange = (country) => {
    setStatus("loading");
    setLocationId(getLocationId(country.id, country.cities[0].id));
  };

  const handleCityChange = (city) => {
    setStatus("loading");
    setLocationId(getLocationId(selectedCountry.id, city.id));
  };

  return (
    <main className="page content-page">
      <div className="app-container">
        <PageHeader
          eyebrow="يومك حول الصلاة"
          title="مواقيت الصلاة"
          description="مواقيت اليوم حسب الدولة والمحافظة أو المدينة وطريقة الحساب الظاهرة أدناه."
        />

        {status === "loading" && <FeedbackState title="جاري حساب المواقيت..." />}
        {status === "error" && (
          <FeedbackState
            type="error"
            title="تعذّر تحميل المواقيت"
            message="اختر المدينة أو حاول مرة أخرى بعد قليل."
            onRetry={() => setRequestVersion((value) => value + 1)}
          />
        )}
        {status === "empty" && (
          <FeedbackState type="empty" title="لا توجد مواقيت متاحة" />
        )}

        {status === "success" && data && nextPrayer && (
          <section className="next-prayer-card">
            <div>
              <p>{nextPrayer.isTomorrow ? "أول صلاة غدًا" : "الصلاة القادمة"}</p>
              <h2>
                {nextPrayer.name} · {formatPrayerTime(nextPrayer.time)}
              </h2>
              <span>{formatRemaining(nextPrayer.remaining)}</span>
            </div>
            <span className="next-prayer-card__clock" aria-hidden="true">
              <FontAwesomeIcon icon={faClock} />
            </span>
          </section>
        )}

        {selectedLocation && (
          <section className="location-bar">
            <div className="location-bar__summary">
              <span>
                <FontAwesomeIcon icon={faLocationDot} /> الموقع
              </span>
              <strong>
                {selectedCity.name}، {selectedCountry.name}
              </strong>
            </div>
            <div className="location-bar__selectors">
              <div className="location-bar__field">
                <span>الدولة</span>
                <SearchableSelect
                  options={PRAYER_COUNTRIES}
                  value={selectedCountry.id}
                  onChange={handleCountryChange}
                  getOptionLabel={(country) => country.name}
                  searchPlaceholder="ابحث باسم الدولة"
                  emptyMessage="لا توجد دولة بهذا الاسم."
                  listLabel="قائمة الدول"
                />
              </div>
              <div className="location-bar__field">
                <span>{selectedCountry.id === "EG" ? "المحافظة" : "المدينة"}</span>
                <SearchableSelect
                  options={selectedCountry.cities}
                  value={selectedCity.id}
                  onChange={handleCityChange}
                  getOptionLabel={(city) => city.name}
                  searchPlaceholder={
                    selectedCountry.id === "EG"
                      ? "ابحث باسم المحافظة"
                      : "ابحث باسم المدينة"
                  }
                  emptyMessage="لا يوجد موقع بهذا الاسم."
                  listLabel="قائمة المدن والمحافظات"
                />
              </div>
            </div>
          </section>
        )}

        {status === "success" && data && nextPrayer && (
          <>
            <div className="prayer-layout">
              <section className="prayer-table-card">
                <div className="results-heading">
                  <h2>مواقيت اليوم</h2>
                  <span>{data.gregorianDate}</span>
                </div>
                <div className="prayer-list">
                  {data.prayers.map((prayer) => (
                    <div
                      key={prayer.key}
                      className={prayer.key === nextPrayer.key ? "is-next" : ""}
                    >
                      <span>
                        {prayer.name}
                        {prayer.key === nextPrayer.key && " · القادمة"}
                      </span>
                      <strong>{formatPrayerTime(prayer.time)}</strong>
                    </div>
                  ))}
                </div>
              </section>

              <aside className="date-card">
                <span>التاريخ الهجري</span>
                <strong>
                  {data.hijriDay} {data.hijriMonth} {data.hijriYear}
                </strong>
                <small>{data.weekday}</small>
                <hr />
                <span>طريقة الحساب</span>
                <p>{data.calculationMethod}</p>
                <SourceBadge>AlAdhan API</SourceBadge>
              </aside>
            </div>

            <p className="calculation-note">
              قد تختلف المواقيت دقائق قليلة عن المسجد المحلي؛ راجع الجهة الرسمية
              في مدينتك عند الحاجة.
            </p>
          </>
        )}
      </div>
    </main>
  );
};

export default PrayerTimesPage;
