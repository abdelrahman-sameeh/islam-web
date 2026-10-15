import { faBookOpen, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FeedbackState from "../../../components/feedback/FeedbackState";
import PageHeader from "../../../components/layout/PageHeader";
import SourceBadge from "../../../components/ui/SourceBadge";
import useDebouncedValue from "../../../hooks/useDebouncedValue";
import FavoriteButton from "../../favorites/components/FavoriteButton";
import useFavorites from "../../favorites/hooks/useFavorites";
import { getStoredJson, setStoredJson } from "../../../lib/deviceStorage";
import {
  getHadithCategories,
  getHadithDetails,
  getHadithPage,
  searchHadiths,
} from "../api/hadithApi";

const RESULTS_PER_PAGE = 12;
const SEARCH_DELAY = 500;
const HADITH_PREFERENCES_KEY = "islamona.hadith-view.v1";

const getSafePage = (value) => {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
};

const HadithPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q")?.trim() ?? "";
  const requestedHadithId = searchParams.get("hadith") ?? "";
  const directHadithId = /^\d+$/.test(requestedHadithId)
    ? requestedHadithId
    : "";
  const categoryId = searchParams.get("category") ?? "5";
  const page = getSafePage(searchParams.get("page"));
  const [draftQuery, setDraftQuery] = useState(searchQuery);
  const [queryError, setQueryError] = useState("");
  const [categories, setCategories] = useState([]);
  const [browseResult, setBrowseResult] = useState(null);
  const [searchItems, setSearchItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [requestVersion, setRequestVersion] = useState(0);
  const [isPreferencesReady, setIsPreferencesReady] = useState(false);
  const [details, setDetails] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [directHadith, setDirectHadith] = useState(null);
  const debouncedQuery = useDebouncedValue(draftQuery, SEARCH_DELAY);
  const isDraftDirty = useRef(false);
  const shouldPreserveDraft = useRef(false);
  const hasInitialView = useRef(
    ["q", "hadith", "category", "page"].some((key) =>
      searchParams.has(key)
    )
  );
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    const restoreExpandedHadith = (hadithId) => {
      if (!/^\d+$/.test(hadithId ?? "")) return;

      setExpandedId(hadithId);
      setDetails((current) => ({
        ...current,
        [hadithId]: { status: "loading" },
      }));
      getHadithDetails(hadithId, controller.signal)
        .then((hadith) => {
          if (!isActive) return;
          setDetails((current) => ({
            ...current,
            [hadithId]: { status: "success", hadith },
          }));
        })
        .catch(() => {
          if (!isActive || controller.signal.aborted) return;
          setDetails((current) => ({
            ...current,
            [hadithId]: { status: "error" },
          }));
        });
    };

    const restorePreferences = async () => {
      const stored = await getStoredJson(HADITH_PREFERENCES_KEY);
      if (!isActive) return;

      if (!hasInitialView.current && stored) {
        if (stored.mode === "direct" && /^\d+$/.test(stored.hadithId ?? "")) {
          setSearchParams({ hadith: stored.hadithId }, { replace: true });
        } else if (
          stored.mode === "search" &&
          typeof stored.query === "string" &&
          stored.query.trim().length >= 2
        ) {
          setSearchParams(
            { q: stored.query.trim(), page: String(getSafePage(stored.page)) },
            { replace: true }
          );
        } else if (
          stored.mode === "browse" &&
          /^\d+$/.test(stored.categoryId ?? "")
        ) {
          setSearchParams(
            {
              category: stored.categoryId,
              page: String(getSafePage(stored.page)),
            },
            { replace: true }
          );
        }

        if (stored.mode === "browse" || stored.mode === "search") {
          restoreExpandedHadith(stored.expandedHadithId);
        }
      }

      setIsPreferencesReady(true);
    };

    void restorePreferences();
    return () => {
      isActive = false;
      controller.abort();
    };
  }, [setSearchParams]);

  useEffect(() => {
    if (shouldPreserveDraft.current) {
      shouldPreserveDraft.current = false;
      return;
    }

    if (!isDraftDirty.current) setDraftQuery(searchQuery);
  }, [directHadithId, searchQuery]);

  useEffect(() => {
    if (!isDraftDirty.current) return;

    const phrase = debouncedQuery.trim();
    if (phrase && phrase.length < 2) {
      if (searchQuery || directHadithId) {
        shouldPreserveDraft.current = true;
        setSearchParams(
          { category: categoryId, page: "1" },
          { replace: true }
        );
      }
      return;
    }

    isDraftDirty.current = false;
    setQueryError("");
    setExpandedId(null);
    setSearchParams(
      phrase
        ? { q: phrase, page: "1" }
        : { category: categoryId, page: "1" },
      { replace: true }
    );
  }, [categoryId, debouncedQuery, directHadithId, searchQuery, setSearchParams]);

  useEffect(() => {
    const controller = new AbortController();
    getHadithCategories(controller.signal)
      .then(setCategories)
      .catch(() => setCategories([]));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!isPreferencesReady || searchQuery || directHadithId) return undefined;

    const controller = new AbortController();
    setStatus("loading");

    getHadithPage({ categoryId, page, signal: controller.signal })
      .then((data) => {
        setBrowseResult(data);
        setStatus(data.items.length ? "success" : "empty");
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("error");
      });

    return () => controller.abort();
  }, [categoryId, directHadithId, isPreferencesReady, page, requestVersion, searchQuery]);

  useEffect(() => {
    if (!isPreferencesReady || !searchQuery || directHadithId) return undefined;

    const controller = new AbortController();
    setStatus("loading");

    searchHadiths(searchQuery, controller.signal)
      .then((items) => {
        setSearchItems(items);
        setStatus(items.length ? "success" : "empty");
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("error");
      });

    return () => controller.abort();
  }, [directHadithId, isPreferencesReady, requestVersion, searchQuery]);

  useEffect(() => {
    if (!isPreferencesReady) return undefined;

    if (!directHadithId) {
      setDirectHadith(null);
      return undefined;
    }

    const controller = new AbortController();
    setStatus("loading");

    getHadithDetails(directHadithId, controller.signal)
      .then((hadith) => {
        setDirectHadith(hadith);
        setDetails((current) => ({
          ...current,
          [hadith.id]: { status: "success", hadith },
        }));
        setExpandedId(hadith.id);
        setStatus("success");
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("error");
      });

    return () => controller.abort();
  }, [directHadithId, isPreferencesReady, requestVersion]);

  const isDirectMode = Boolean(directHadithId);
  const isSearchMode = Boolean(searchQuery) && !isDirectMode;
  const totalItems = isDirectMode
    ? directHadith
      ? 1
      : 0
    : isSearchMode
    ? searchItems.length
    : browseResult?.totalItems ?? 0;
  const lastPage = isDirectMode
    ? 1
    : isSearchMode
    ? Math.max(1, Math.ceil(searchItems.length / RESULTS_PER_PAGE))
    : browseResult?.lastPage ?? 1;
  const displayedPage = Math.min(page, lastPage);
  const visibleItems = isDirectMode
    ? directHadith
      ? [
          {
            id: directHadith.id,
            title: directHadith.title,
            preview: directHadith.text,
          },
        ]
      : []
    : isSearchMode
    ? searchItems.slice(
        (displayedPage - 1) * RESULTS_PER_PAGE,
        displayedPage * RESULTS_PER_PAGE
      )
    : browseResult?.items ?? [];

  useEffect(() => {
    if (!isPreferencesReady) return;

    const storedView = isDirectMode
      ? { mode: "direct", hadithId: directHadithId }
      : isSearchMode
      ? {
          mode: "search",
          query: searchQuery,
          page,
          expandedHadithId: expandedId ?? undefined,
        }
      : {
          mode: "browse",
          categoryId,
          page,
          expandedHadithId: expandedId ?? undefined,
        };

    void setStoredJson(HADITH_PREFERENCES_KEY, storedView);
  }, [
    categoryId,
    directHadithId,
    expandedId,
    isDirectMode,
    isPreferencesReady,
    isSearchMode,
    page,
    searchQuery,
  ]);

  const setPage = (nextPage) => {
    setSearchParams(
      isSearchMode
        ? { q: searchQuery, page: String(nextPage) }
        : { category: categoryId, page: String(nextPage) }
    );
    setExpandedId(null);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const phrase = draftQuery.trim();

    if (phrase.length < 2) {
      setQueryError("اكتب حرفين على الأقل أو عبارة من الحديث.");
      return;
    }

    setQueryError("");
    isDraftDirty.current = false;
    setExpandedId(null);
    setSearchParams({ q: phrase, page: "1" });
  };

  const handleClearSearch = () => {
    isDraftDirty.current = false;
    setDraftQuery("");
    setQueryError("");
    setExpandedId(null);
    setSearchParams({ category: categoryId, page: "1" });
  };

  const handleCategoryChange = (nextCategoryId) => {
    isDraftDirty.current = false;
    setDraftQuery("");
    setQueryError("");
    setExpandedId(null);
    setSearchParams({ category: nextCategoryId, page: "1" });
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
          description="ابحث في جميع أحاديث الموسوعة، أو تصفّحها حسب الموضوع."
        />

        <section className="hadith-filters" aria-label="بحث وتصنيف الأحاديث">
          <form className="hadith-search" role="search" onSubmit={handleSearch}>
            <label className="search-field">
              <FontAwesomeIcon icon={faSearch} aria-hidden="true" />
              <span className="visually-hidden">ابحث في جميع الأحاديث</span>
              <input
                value={draftQuery}
                onChange={(event) => {
                  isDraftDirty.current = true;
                  setDraftQuery(event.target.value);
                  setQueryError("");
                }}
                placeholder="ابحث بكلمة من نص الحديث أو عنوانه"
                aria-describedby={queryError ? "hadith-search-error" : undefined}
              />
            </label>
            <button className="primary-button" type="submit">
              بحث عام
            </button>
            {isSearchMode && (
              <button
                className="secondary-button"
                type="button"
                onClick={handleClearSearch}
              >
                مسح البحث
              </button>
            )}
          </form>
          <p className="search-hint">
            تظهر النتائج تلقائيًا بعد التوقف عن الكتابة، أو اضغط Enter للبحث فورًا.
          </p>
          {queryError && (
            <p className="search-error" id="hadith-search-error" role="alert">
              {queryError}
            </p>
          )}
          <div className="filter-chips" aria-label="تصنيف الحديث">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={
                  !isSearchMode && category.id === categoryId
                    ? "is-selected"
                    : ""
                }
                aria-pressed={!isSearchMode && category.id === categoryId}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.title}
              </button>
            ))}
          </div>
        </section>

        <div className="results-heading">
          <h2>
            {isDirectMode
              ? "الحديث المحفوظ"
              : isSearchMode
              ? `نتائج البحث عن «${searchQuery}»`
              : "نتائج مختارة"}
          </h2>
          {status === "success" && (
            <span>{totalItems.toLocaleString("ar-EG")} حديثًا</span>
          )}
        </div>

        {status === "loading" && (
          <FeedbackState
            title={isSearchMode ? "جاري البحث في الموسوعة..." : "جاري تحميل الأحاديث..."}
          />
        )}
        {status === "error" && (
          <FeedbackState
            type="error"
            title={isSearchMode ? "تعذّر تنفيذ البحث" : "تعذّر تحميل الأحاديث"}
            message="تعذّر الاتصال ولم نجد نسخة محفوظة لهذا المحتوى على الجهاز."
            onRetry={() => setRequestVersion((value) => value + 1)}
          />
        )}
        {status === "empty" && (
          <FeedbackState
            type="empty"
            title="لا توجد نتائج"
            message={
              isSearchMode
                ? "جرّب كلمة أو عبارة أخرى من متن الحديث."
                : "اختر تصنيفًا مختلفًا."
            }
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
                    <div className="hadith-card__heading">
                      <h3>{item.title}</h3>
                      <FavoriteButton
                        label="حفظ الحديث"
                        isFavorite={isFavorite("hadith", item.id)}
                        onToggle={() =>
                          toggleFavorite({
                            type: "hadith",
                            entityId: item.id,
                            title: item.title,
                            subtitle: "حديث وشرح وفوائد · HadeethEnc",
                            href: `/hadees?hadith=${item.id}`,
                          })
                        }
                      />
                    </div>
                    {item.preview && (
                      <p className="hadith-card__preview">{item.preview}</p>
                    )}
                    <button
                      type="button"
                      className="inline-action"
                      aria-expanded={isExpanded}
                      onClick={() => handleToggleDetails(item.id)}
                    >
                      {isExpanded ? "إخفاء التفاصيل" : "عرض الشرح والفوائد"}
                    </button>

                    {isExpanded && detailState?.status === "loading" && (
                      <p className="muted-copy">جاري تحميل التفاصيل...</p>
                    )}
                    {isExpanded && detailState?.status === "error" && (
                      <p className="error-copy">تعذّر تحميل تفاصيل هذا الحديث.</p>
                    )}
                    {isExpanded && detailState?.status === "success" && (
                      <div className="hadith-details">
                        <p className="hadith-details__text">
                          {detailState.hadith.text}
                        </p>
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

        {status === "success" && lastPage > 1 && (
          <nav className="simple-pagination" aria-label="صفحات الأحاديث">
            <button
              type="button"
              disabled={displayedPage <= 1}
              onClick={() => setPage(displayedPage - 1)}
            >
              السابق
            </button>
            <span>
              صفحة {displayedPage.toLocaleString("ar-EG")} من{" "}
              {lastPage.toLocaleString("ar-EG")}
            </span>
            <button
              type="button"
              disabled={displayedPage >= lastPage}
              onClick={() => setPage(displayedPage + 1)}
            >
              التالي
            </button>
          </nav>
        )}
        <div className="page-source">
          <SourceBadge>HadeethEnc.com · بحث في العنوان والمتن</SourceBadge>
        </div>
      </div>
    </main>
  );
};

export default HadithPage;
