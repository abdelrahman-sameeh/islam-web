import { faArrowLeft, faRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { DAILY_SESSION_DURATIONS } from "../data/dailyPassages";
import { useDailySession } from "../hooks/useDailySession";

const durationLabel = (duration) =>
  duration === 2
    ? "دقيقتان"
    : `${new Intl.NumberFormat("ar-EG").format(duration)} دقائق`;

const DailySessionCard = () => {
  const {
    passage,
    duration,
    isStarted,
    setDuration,
    chooseAnotherSession,
    markStarted,
  } = useDailySession();

  return (
    <section className="daily-session" aria-labelledby="daily-session-title">
      <div className="daily-session__content">
        <p className="daily-session__eyebrow">
          جلسة اليوم · مقطع يناسب وقتك
        </p>
        <h1 id="daily-session-title">{passage.title}</h1>
        <p className="daily-session__description">{passage.description}</p>

        <div className="daily-session__selection">
          <strong>{passage.surah.name}</strong>
          <span>
            من الآية {passage.ayahs.from.toLocaleString("ar-EG")} إلى الآية{" "}
            {passage.ayahs.to.toLocaleString("ar-EG")} · قراءة تقريبية{" "}
            {durationLabel(duration)}
          </span>
        </div>

        <div className="daily-session__duration" aria-label="مدة الجلسة">
          {DAILY_SESSION_DURATIONS.map((item) => (
            <button
              key={item}
              type="button"
              className={item === duration ? "is-selected" : ""}
              aria-pressed={item === duration}
              onClick={() => setDuration(item)}
            >
              {durationLabel(item)}
            </button>
          ))}
        </div>

        <div className="daily-session__actions">
          <Link
            className="primary-action"
            to={`/quran/surah/${passage.surah.id}?from=${passage.ayahs.from}&to=${passage.ayahs.to}&session=1`}
            onClick={markStarted}
          >
            {isStarted ? "كمّل الجلسة" : "ابدأ جلسة اليوم"}
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <button
            className="text-action"
            type="button"
            onClick={chooseAnotherSession}
          >
            <FontAwesomeIcon icon={faRotate} />
            جلسة أخرى
          </button>
        </div>

        <p className="daily-session__privacy">
          اختيارك محفوظ على هذا الجهاز فقط ويتجدد في يوم جديد.
        </p>
      </div>
      <div className="daily-session__art" aria-hidden="true">
        <span className="daily-session__art-ring" />
        <span className="daily-session__art-book" />
      </div>
    </section>
  );
};

export default DailySessionCard;
