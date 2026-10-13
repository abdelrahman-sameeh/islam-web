import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import usePrayerTimes from "../../prayer-times/hooks/usePrayerTimes";
import {
  formatPrayerTime,
  getDailyPrayers,
  getNextPrayer,
} from "../../prayer-times/utils/prayerTime";

const HomePrayerTimes = () => {
  const { data, retry, selectedLocation, status } = usePrayerTimes();
  const nextPrayer = data
    ? getNextPrayer(data.prayers, data.timezone)
    : null;

  if (status === "loading") {
    return (
      <section className="home-prayer-card is-loading" aria-busy="true">
        <div>
          <span className="home-prayer-card__eyebrow">مواقيت اليوم</span>
          <strong>جاري تحميل مواقيت الصلاة...</strong>
        </div>
      </section>
    );
  }

  if (status === "error" || status === "empty" || !data || !nextPrayer) {
    return (
      <section className="home-prayer-card home-prayer-card--feedback">
        <div>
          <span className="home-prayer-card__eyebrow">مواقيت اليوم</span>
          <strong>تعذّر عرض المواقيت الآن</strong>
        </div>
        <button className="secondary-button" type="button" onClick={retry}>
          حاول مرة أخرى
        </button>
        <Link className="inline-action" to="/azan">
          اختيار الموقع
        </Link>
      </section>
    );
  }

  const locationName = selectedLocation
    ? `${selectedLocation.city.name}، ${selectedLocation.country.name}`
    : "الموقع المحفوظ";

  return (
    <section className="home-prayer-card" aria-labelledby="home-prayer-title">
      <div className="home-prayer-card__summary">
        <span className="home-prayer-card__eyebrow" id="home-prayer-title">
          مواقيت اليوم
        </span>
        <strong>
          <FontAwesomeIcon icon={faLocationDot} /> {locationName}
        </strong>
        <small>
          {data.weekday} · {data.hijriDay} {data.hijriMonth}
        </small>
      </div>

      <div className="home-prayer-card__times">
        {getDailyPrayers(data.prayers).map((prayer) => (
          <div
            key={prayer.key}
            className={prayer.key === nextPrayer.key ? "is-next" : ""}
          >
            <span>{prayer.name}</span>
            <strong>{formatPrayerTime(prayer.time)}</strong>
            {prayer.key === nextPrayer.key && <small>القادمة</small>}
          </div>
        ))}
      </div>

      <Link className="secondary-button" to="/azan">
        تغيير الموقع والتفاصيل
      </Link>
    </section>
  );
};

export default HomePrayerTimes;
