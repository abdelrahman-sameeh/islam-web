import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import FeedbackState from "../../../components/feedback/FeedbackState";
import PageHeader from "../../../components/layout/PageHeader";
import SourceBadge from "../../../components/ui/SourceBadge";
import { getStoredJson, setStoredJson } from "../../../lib/browserStorage";
import { getAdhkar } from "../api/adhkarApi";

const ADHKAR_PREFERENCES_KEY = "islamona.adhkar-view.v1";

const getTargetCount = (item) => {
  const count = Number(item.count);
  return Number.isFinite(count) && count > 0 ? count : 1;
};

const getSafeCounts = (counts) => {
  if (!counts || Array.isArray(counts) || typeof counts !== "object") return {};

  return Object.fromEntries(
    Object.entries(counts).filter(
      ([, value]) => Number.isInteger(value) && value >= 0
    )
  );
};

const AdhkarPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [counts, setCounts] = useState({});
  const [status, setStatus] = useState("loading");
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");

    Promise.all([
      getStoredJson(ADHKAR_PREFERENCES_KEY),
      getAdhkar(controller.signal),
    ])
      .then(([stored, result]) => {
        const storedTitle = result.some(
          ({ title }) => title === stored?.selectedTitle
        )
          ? stored.selectedTitle
          : null;

        setCategories(result);
        setSelectedTitle(
          storedTitle ??
            result.find(({ title }) => title.includes("الصباح"))?.title ??
            result[0]?.title ??
            ""
        );
        setCounts(getSafeCounts(stored?.counts));
        setStatus(result.length ? "success" : "empty");
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("error");
      });

    return () => controller.abort();
  }, [requestVersion]);

  const selectedCategory = useMemo(
    () => categories.find(({ title }) => title === selectedTitle),
    [categories, selectedTitle]
  );

  const handleCount = (index, target) => {
    const key = `${selectedTitle}-${index}`;
    setCounts((current) => {
      const nextCounts = {
        ...current,
        [key]: Math.max(0, (current[key] ?? target) - 1),
      };
      void setStoredJson(ADHKAR_PREFERENCES_KEY, {
        selectedTitle,
        counts: nextCounts,
      });
      return nextCounts;
    });
  };

  const handleCategoryChange = (title) => {
    setSelectedTitle(title);
    void setStoredJson(ADHKAR_PREFERENCES_KEY, {
      selectedTitle: title,
      counts,
    });
  };

  const handleResetCounts = () => {
    setCounts({});
    void setStoredJson(ADHKAR_PREFERENCES_KEY, {
      selectedTitle,
      counts: {},
    });
  };

  return (
    <main className="page content-page">
      <div className="app-container">
        <PageHeader
          eyebrow="رفيق يومي بسيط"
          title="الأذكار"
          description="اختر التصنيف، واقرأ على مهل، واستخدم العدّاد من غير تشتيت."
          action={
            <button
              type="button"
              className="secondary-button"
              onClick={handleResetCounts}
            >
              <FontAwesomeIcon icon={faRotate} />
              إعادة العدّادات
            </button>
          }
        />

        {status === "loading" && <FeedbackState title="جاري تحميل الأذكار..." />}
        {status === "error" && (
          <FeedbackState
            type="error"
            title="تعذّر تحميل الأذكار"
            message="تعذّر الاتصال ولم نجد نسخة محفوظة من الأذكار على الجهاز."
            onRetry={() => setRequestVersion((value) => value + 1)}
          />
        )}
        {status === "empty" && (
          <FeedbackState type="empty" title="لا توجد أذكار متاحة" />
        )}

        {status === "success" && (
          <>
            <section className="category-strip" aria-label="تصنيفات الأذكار">
              <span>التصنيف</span>
              <div className="filter-chips">
                {categories.map((category) => (
                  <button
                    type="button"
                    key={category.title}
                    className={category.title === selectedTitle ? "is-selected" : ""}
                    aria-pressed={category.title === selectedTitle}
                    onClick={() => handleCategoryChange(category.title)}
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            </section>

            <div className="results-heading">
              <h2>{selectedTitle}</h2>
              <span>
                {selectedCategory?.items.length.toLocaleString("ar-EG")} ذكرًا
              </span>
            </div>

            <div className="dhikr-list">
              {selectedCategory?.items.map((item, index) => {
                const target = getTargetCount(item);
                const key = `${selectedTitle}-${index}`;
                const remaining = counts[key] ?? target;

                return (
                  <article className="dhikr-card" key={key}>
                    <span className="dhikr-card__number">
                      {(index + 1).toLocaleString("ar-EG")}
                    </span>
                    <p>{item.content}</p>
                    {item.description && <small>{item.description}</small>}
                    {item.reference && (
                      <small className="dhikr-card__reference">
                        المرجع: {item.reference}
                      </small>
                    )}
                    <div className="dhikr-card__footer">
                      <SourceBadge>azkar-api · النسخة المثبتة بالمشروع</SourceBadge>
                      <button
                        type="button"
                        className={remaining === 0 ? "is-complete" : ""}
                        disabled={remaining === 0}
                        onClick={() => handleCount(index, target)}
                      >
                        {remaining === 0
                          ? "تم الذكر"
                          : `تبقّى ${remaining.toLocaleString("ar-EG")}`}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default AdhkarPage;
