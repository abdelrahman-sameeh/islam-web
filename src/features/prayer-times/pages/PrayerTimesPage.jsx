import { faClock, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import FeedbackState from "../../../components/feedback/FeedbackState";
import PageHeader from "../../../components/layout/PageHeader";
import SourceBadge from "../../../components/ui/SourceBadge";
import { getPrayerTimes } from "../api/prayerTimesApi";
import { EGYPTIAN_CITIES } from "../data/cities";

const CITY_STORAGE_KEY = "islamona.prayer-city.v1";
const PRAYER_KEYS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

const getInitialCity = () => {
  try {
    const storedCity = window.localStorage.getItem(CITY_STORAGE_KEY);
    return EGYPTIAN_CITIES.some(({ id }) => id === storedCity)
      ? storedCity
      : "Cairo";
  } catch {
    return "Cairo";
  }
};

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
  const [city, setCity] = useState(getInitialCity);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");

    getPrayerTimes(city, controller.signal)
      .then((result) => {
        setData(result);
        setStatus(result.prayers.length ? "success" : "empty");
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("error");
      });

    try {
      window.localStorage.setItem(CITY_STORAGE_KEY, city);
    } catch {
      // The selected city still works for the current visit.
    }

    return () => controller.abort();
  }, [city, requestVersion]);

  const selectedCity = EGYPTIAN_CITIES.find(({ id }) => id === city);
  const nextPrayer = useMemo(
    () => (data ? getNextPrayer(data.prayers, data.timezone) : null),
    [data]
  );

  return (
    <main className="page content-page">
      <div className="app-container">
        <PageHeader
          eyebrow="يومك حول الصلاة"
          title="مواقيت الصلاة"
          description="مواقيت اليوم حسب المدينة وطريقة الحساب الظاهرة أدناه."
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
          <>
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

            <section className="location-bar">
              <div>
                <span>
                  <FontAwesomeIcon icon={faLocationDot} /> الموقع
                </span>
                <strong>{selectedCity?.name}، مصر</strong>
              </div>
              <label>
                <span>تغيير المدينة</span>
                <select value={city} onChange={(event) => setCity(event.target.value)}>
                  {EGYPTIAN_CITIES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            </section>

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
