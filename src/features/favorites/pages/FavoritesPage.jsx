import {
  faBookOpen,
  faBookQuran,
  faHeadphones,
  faQuoteRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FeedbackState from "../../../components/feedback/FeedbackState";
import PageHeader from "../../../components/layout/PageHeader";
import useFavorites from "../hooks/useFavorites";

const FAVORITE_TYPES = [
  { id: "all", label: "الكل" },
  { id: "surah", label: "السور" },
  { id: "reciter", label: "القرّاء" },
  { id: "hadith", label: "الأحاديث" },
  { id: "tafsir", label: "التفسير" },
];

const TYPE_DETAILS = {
  surah: { label: "سورة", icon: faBookQuran, action: "فتح السورة" },
  reciter: { label: "قارئ ورواية", icon: faHeadphones, action: "اختيار القارئ" },
  hadith: { label: "حديث", icon: faQuoteRight, action: "عرض الحديث" },
  tafsir: { label: "تفسير", icon: faBookOpen, action: "فتح التفسير" },
};

const FavoritesPage = () => {
  const [activeType, setActiveType] = useState("all");
  const { items, isLoading, toggleFavorite } = useFavorites();
  const visibleItems = useMemo(
    () =>
      activeType === "all"
        ? items
        : items.filter(({ type }) => type === activeType),
    [activeType, items]
  );
  const countByType = (type) =>
    type === "all"
      ? items.length
      : items.filter((item) => item.type === type).length;

  return (
    <main className="page content-page">
      <div className="app-container">
        <PageHeader
          eyebrow="محفوظ على جهازك"
          title="المحفوظات"
          description="كل السور والقرّاء والأحاديث والتفاسير التي اخترتها في مكان واحد."
        />

        <nav className="favorites-tabs" aria-label="تصنيفات المحفوظات">
          {FAVORITE_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              className={activeType === type.id ? "is-selected" : ""}
              aria-pressed={activeType === type.id}
              onClick={() => setActiveType(type.id)}
            >
              {type.label}
              <span>{countByType(type.id).toLocaleString("ar-EG")}</span>
            </button>
          ))}
        </nav>

        {isLoading && <FeedbackState title="جاري فتح المحفوظات..." />}

        {!isLoading && visibleItems.length === 0 && (
          <FeedbackState
            type="empty"
            title={items.length ? "لا توجد عناصر في هذا القسم" : "محفوظاتك فارغة"}
            message="استخدم زر الحفظ بجوار السورة أو القارئ أو الحديث أو التفسير."
          />
        )}

        {!isLoading && visibleItems.length > 0 && (
          <section className="favorites-grid" aria-live="polite">
            {visibleItems.map((item) => {
              const details = TYPE_DETAILS[item.type];

              return (
                <article className="favorite-card" key={item.key}>
                  <span className="favorite-card__icon" aria-hidden="true">
                    <FontAwesomeIcon icon={details.icon} />
                  </span>
                  <div className="favorite-card__content">
                    <small>{details.label}</small>
                    <h2>{item.title}</h2>
                    {item.subtitle && <p>{item.subtitle}</p>}
                    <div className="favorite-card__actions">
                      <Link className="inline-action" to={item.href}>
                        {details.action} ←
                      </Link>
                      <button
                        type="button"
                        className="remove-favorite"
                        onClick={() => toggleFavorite(item)}
                      >
                        إزالة من المحفوظات
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        <aside className="local-storage-note">
          <strong>المحفوظات خاصة بهذا الجهاز</strong>
          <span>
            لا تتم مزامنتها بين الأجهزة، وقد تختفي عند مسح بيانات المتصفح أو
            التطبيق أو حذف التطبيق.
          </span>
        </aside>
      </div>
    </main>
  );
};

export default FavoritesPage;
