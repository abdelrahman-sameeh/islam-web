import { faBookOpen, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import FeedbackState from "../../../components/feedback/FeedbackState";
import PageHeader from "../../../components/layout/PageHeader";
import SourceBadge from "../../../components/ui/SourceBadge";
import {
  getHadithCategories,
  getHadithDetails,
  getHadithPage,
} from "../api/hadithApi";

const HadithPage = () => {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("5");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("loading");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [requestVersion, setRequestVersion] = useState(0);
  const [details, setDetails] = useState({});
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    getHadithCategories(controller.signal)
      .then(setCategories)
      .catch(() => setCategories([]));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");

    getHadithPage({ categoryId, page, signal: controller.signal })
      .then((data) => {
        setResult(data);
        setStatus(data.items.length ? "success" : "empty");
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("error");
      });

    return () => controller.abort();
  }, [categoryId, page, requestVersion]);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) return result?.items ?? [];
    return (result?.items ?? []).filter(({ title }) =>
      title.includes(normalizedQuery)
    );
  }, [query, result]);

  const handleCategoryChange = (nextCategoryId) => {
    setCategoryId(nextCategoryId);
    setPage(1);
    setExpandedId(null);
  };

  const handleToggleDetails = async (hadithId) => {
    if (expandedId === hadithId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(hadithId);
    if (details[hadithId]) return;
    setDetails((current) => ({
      ...current,
      [hadithId]: { status: "loading" },
    }));

    try {
      const hadith = await getHadithDetails(hadithId);
      setDetails((current) => ({
        ...current,
        [hadithId]: { status: "success", hadith },
      }));
    } catch {
      setDetails((current) => ({
        ...current,
        [hadithId]: { status: "error" },
      }));
    }
  };

  return (
    <main className="page content-page">
      <div className="app-container">
        <PageHeader
          eyebrow="نص وشرح ومصدر"
          title="الأحاديث النبوية"
          description="أحاديث موثّقة مع الدرجة والشرح والفوائد والمراجع."
        />

        <section className="hadith-filters" aria-label="فلترة الأحاديث">
          <label className="search-field">
            <FontAwesomeIcon icon={faSearch} aria-hidden="true" />
            <span className="visually-hidden">ابحث في النتائج الحالية</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ابحث في عناوين الصفحة الحالية"
            />
          </label>
          <div className="filter-chips" aria-label="تصنيف الحديث">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={category.id === categoryId ? "is-selected" : ""}
                aria-pressed={category.id === categoryId}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.title}
              </button>
            ))}
          </div>
        </section>

        <div className="results-heading">
          <h2>نتائج مختارة</h2>
          {result && (
            <span>{result.totalItems.toLocaleString("ar-EG")} حديثًا</span>
          )}
        </div>

        {status === "loading" && <FeedbackState title="جاري تحميل الأحاديث..." />}
        {status === "error" && (
          <FeedbackState
            type="error"
            title="تعذّر تحميل الأحاديث"
            message="لم نتمكن من الوصول للمصدر الآن."
            onRetry={() => setRequestVersion((value) => value + 1)}
          />
        )}
        {(status === "empty" || (status === "success" && !visibleItems.length)) && (
          <FeedbackState
            type="empty"
            title="لا توجد نتائج"
            message="جرّب كلمة أخرى أو اختر تصنيفًا مختلفًا."
          />
        )}

        {status === "success" && visibleItems.length > 0 && (
          <div className="hadith-list">
            {visibleItems.map((item) => {
              const detailState = details[item.id];
              const isExpanded = expandedId === item.id;

              return (
                <article className="hadith-card" key={item.id}>
                  <div className="hadith-card__icon" aria-hidden="true">
                    <FontAwesomeIcon icon={faBookOpen} />
                  </div>
                  <div className="hadith-card__body">
                    <h3>{item.title}</h3>
                    <button
                      type="button"
                      className="inline-action"
                      aria-expanded={isExpanded}
                      onClick={() => handleToggleDetails(item.id)}
                    >
                      {isExpanded ? "إخفاء التفاصيل" : "عرض النص والشرح والفوائد"}
                    </button>

                    {isExpanded && detailState?.status === "loading" && (
                      <p className="muted-copy">جاري تحميل التفاصيل...</p>
                    )}
                    {isExpanded && detailState?.status === "error" && (
                      <p className="error-copy">تعذّر تحميل تفاصيل هذا الحديث.</p>
                    )}
                    {isExpanded && detailState?.status === "success" && (
                      <div className="hadith-details">
                        <p className="hadith-details__text">{detailState.hadith.text}</p>
                        <div className="hadith-meta">
                          {detailState.hadith.grade && (
                            <span>{detailState.hadith.grade}</span>
                          )}
                          {detailState.hadith.attribution && (
                            <small>{detailState.hadith.attribution}</small>
                          )}
                        </div>
                        {detailState.hadith.explanation && (
                          <section>
                            <h4>الشرح</h4>
                            <p>{detailState.hadith.explanation}</p>
                          </section>
                        )}
                        {detailState.hadith.benefits.length > 0 && (
                          <section>
                            <h4>من فوائد الحديث</h4>
                            <ul>
                              {detailState.hadith.benefits.map((benefit) => (
                                <li key={benefit}>{benefit}</li>
                              ))}
                            </ul>
                          </section>
                        )}
                        <SourceBadge>HadeethEnc.com</SourceBadge>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {result && result.lastPage > 1 && (
          <nav className="simple-pagination" aria-label="صفحات الأحاديث">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((value) => value - 1)}
            >
              السابق
            </button>
            <span>
              صفحة {page.toLocaleString("ar-EG")} من{" "}
              {result.lastPage.toLocaleString("ar-EG")}
            </span>
            <button
              type="button"
              disabled={page >= result.lastPage}
              onClick={() => setPage((value) => value + 1)}
            >
              التالي
            </button>
          </nav>
        )}
        <div className="page-source">
          <SourceBadge>HadeethEnc.com</SourceBadge>
        </div>
      </div>
    </main>
  );
};

export default HadithPage;
