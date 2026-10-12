import { faArrowLeft, faRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { DAILY_SESSION_DURATIONS } from "../data/dailySessions";
import { useDailySession } from "../hooks/useDailySession";

const durationLabel = (duration) =>
  duration === 2
    ? "دقيقتان"
    : `${new Intl.NumberFormat("ar-EG").format(duration)} دقائق`;

const DailySessionCard = () => {
  const {
    session,
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
          {session.label} · اختيار اليوم
        </p>
        <h1 id="daily-session-title">{session.title}</h1>
        <p className="daily-session__description">{session.description}</p>

        <blockquote className="daily-session__verse" translate="no">
          <p>{session.verse.text}</p>
          <cite>{session.verse.reference}</cite>
        </blockquote>

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
            to={`/quran/surah/${session.verse.surahId}`}
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
