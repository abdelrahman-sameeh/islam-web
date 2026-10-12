import { faArrowLeft, faRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { DAILY_SESSION_DURATIONS } from "../data/sessionConfig";
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
    status,
    error,
    setDuration,
    chooseAnotherSession,
    retry,
    markStarted,
  } = useDailySession();

  const isLoading = status === "idle" || status === "loading";

  return (
    <section className="daily-session" aria-labelledby="daily-session-title">
      <div className="daily-session__content">
        <p className="daily-session__eyebrow">
          جلسة اليوم · اختيار عشوائي يناسب وقتك
        </p>
        <h1 id="daily-session-title">ورد مختلف في كل جلسة</h1>
        <p className="daily-session__description">
          اختر وقتك، وسنختار سورة عشوائية ثم نحدد منها آيات متصلة تناسب مدة
          القراءة.
        </p>

        <div
          className="daily-session__selection"
          aria-live="polite"
          aria-busy={isLoading}
        >
          {passage ? (
            <>
              <strong>{passage.surahName}</strong>
              <span>
                من الآية {passage.fromAyah.toLocaleString("ar-EG")} إلى الآية{" "}
                {passage.toAyah.toLocaleString("ar-EG")} · قراءة تقريبية{" "}
                {durationLabel(duration)}
              </span>
            </>
          ) : (
            <div className="daily-session__feedback" role="status">
              <strong>{isLoading ? "بنختار لك مقطعًا..." : "تعذّر الاختيار"}</strong>
              <span>
                {isLoading
                  ? "لحظات ونحسب عدد الآيات الأنسب للوقت الذي اخترته."
                  : error}
              </span>
            </div>
          )}
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
          {passage ? (
            <>
              <Link
                className="primary-action"
                to={`/quran/surah/${passage.surahId}?from=${passage.fromAyah}&to=${passage.toAyah}&session=1`}
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
                جلسة أخرى عشوائية
              </button>
            </>
          ) : (
            <button
              className="primary-action"
              type="button"
              disabled={isLoading}
              onClick={retry}
            >
              {isLoading ? "جاري الاختيار..." : "حاول مرة أخرى"}
              <FontAwesomeIcon icon={faRotate} />
            </button>
          )}
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
