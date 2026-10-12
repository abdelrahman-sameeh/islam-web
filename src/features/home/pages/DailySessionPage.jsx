import { faArrowRight, faRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import FeedbackState from "../../../components/feedback/FeedbackState";
import PageHeader from "../../../components/layout/PageHeader";
import SourceBadge from "../../../components/ui/SourceBadge";
import { useDailySession } from "../hooks/useDailySession";
import { useSessionContent } from "../hooks/useSessionContent";

const durationLabel = (duration) =>
  duration === 2
    ? "دقيقتان"
    : `${duration.toLocaleString("ar-EG")} دقائق`;

const DailySessionPage = () => {
  const {
    passage,
    duration,
    status,
    error,
    chooseAnotherSession,
    retry,
  } = useDailySession();
  const { ayahState, hadithState, retryAyahs, retryHadith } =
    useSessionContent(passage);

  return (
    <main className="page content-page session-page">
      <div className="app-container">
        <PageHeader
          eyebrow={`جلسة هادئة · ${durationLabel(duration)}`}
          title="جلسة اليوم"
          description="ابدأ بالقرآن، ثم حديث عشوائي موثّق، واختم بالتفسير الميسر للآيات."
          action={
            <Link className="secondary-button" to="/">
              <FontAwesomeIcon icon={faArrowRight} />
              الرئيسية
            </Link>
          }
        />

        {!passage && (status === "idle" || status === "loading") && (
          <FeedbackState
            title="نجهّز جلستك..."
            message="نختار سورة ومقطعًا يناسب وقتك."
          />
        )}
        {!passage && status === "error" && (
          <FeedbackState
            type="error"
            title="تعذّر تجهيز الجلسة"
            message={error}
            onRetry={retry}
          />
        )}

        {passage && (
          <>
            <section className="session-summary">
              <span>المقطع المختار عشوائيًا</span>
              <h2>{passage.surahName}</h2>
              <p>
                من الآية {passage.fromAyah.toLocaleString("ar-EG")} إلى الآية{" "}
                {passage.toAyah.toLocaleString("ar-EG")} · نحو{" "}
                {durationLabel(duration)}
              </p>
            </section>

            <div className="session-steps">
              <section className="session-step">
                <header>
                  <span className="session-step__number">١</span>
                  <div>
                    <p>ابدأ هنا</p>
                    <h2>القرآن الكريم</h2>
                  </div>
                  <SourceBadge>QuranEnc</SourceBadge>
                </header>
                {ayahState.status === "loading" && (
                  <FeedbackState title="جاري تحميل الآيات..." />
                )}
                {ayahState.status === "error" && (
                  <FeedbackState
                    type="error"
                    title="تعذّر تحميل الآيات"
                    onRetry={retryAyahs}
                  />
                )}
                {ayahState.status === "empty" && (
                  <FeedbackState type="empty" title="لم نجد آيات هذا المقطع" />
                )}
                {ayahState.status === "success" && (
                  <div className="session-quran quran-font" translate="no">
                    {ayahState.data.map((ayah) => (
                      <span key={ayah.id}>
                        {ayah.text}
                        <b>{ayah.number.toLocaleString("ar-EG")}</b>
                      </span>
                    ))}
                  </div>
                )}
              </section>

              <section className="session-step">
                <header>
                  <span className="session-step__number">٢</span>
                  <div>
                    <p>وقفة قصيرة</p>
                    <h2>حديث عشوائي</h2>
                  </div>
                  <SourceBadge>HadeethEnc.com</SourceBadge>
                </header>
                {hadithState.status === "loading" && (
                  <FeedbackState title="نختار حديثًا موثّقًا..." />
                )}
                {hadithState.status === "error" && (
                  <FeedbackState
                    type="error"
                    title="تعذّر تحميل الحديث"
                    onRetry={retryHadith}
                  />
                )}
                {hadithState.status === "success" && (
                  <article className="session-hadith">
                    <h3>{hadithState.data.title}</h3>
                    <p>{hadithState.data.text}</p>
                    <div>
                      {hadithState.data.grade && (
                        <span>{hadithState.data.grade}</span>
                      )}
                      <small>{hadithState.data.attribution}</small>
                    </div>
                  </article>
                )}
              </section>

              <section className="session-step">
                <header>
                  <span className="session-step__number">٣</span>
                  <div>
                    <p>افهم ما قرأت</p>
                    <h2>التفسير الميسر</h2>
                  </div>
                  <SourceBadge>QuranEnc · التفسير الميسر</SourceBadge>
                </header>
                {ayahState.status === "loading" && (
                  <FeedbackState title="جاري تحميل التفسير..." />
                )}
                {ayahState.status === "error" && (
                  <FeedbackState
                    type="error"
                    title="تعذّر تحميل التفسير"
                    onRetry={retryAyahs}
                  />
                )}
                {ayahState.status === "success" && (
                  <div className="session-tafsir">
                    {ayahState.data.map((ayah, index) => (
                      <details key={ayah.id} open={index === 0}>
                        <summary>
                          تفسير الآية {ayah.number.toLocaleString("ar-EG")}
                        </summary>
                        <p>{ayah.tafsir}</p>
                      </details>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <div className="session-end-actions">
              <button
                type="button"
                className="primary-button"
                onClick={chooseAnotherSession}
              >
                <FontAwesomeIcon icon={faRotate} />
                جلسة عشوائية أخرى
              </button>
              <Link className="secondary-button" to="/">
                إنهاء الجلسة
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default DailySessionPage;
