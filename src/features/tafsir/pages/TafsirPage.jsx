import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FeedbackState from "../../../components/feedback/FeedbackState";
import PageHeader from "../../../components/layout/PageHeader";
import SearchableSelect from "../../../components/ui/SearchableSelect";
import SourceBadge from "../../../components/ui/SourceBadge";
import FavoriteButton from "../../favorites/components/FavoriteButton";
import useFavorites from "../../favorites/hooks/useFavorites";
import { getSurahAyahs } from "../../quran/api/quranApi";
import surahList from "../../quran/data/surahs";
import VerseTafsirSearch from "../components/VerseTafsirSearch";

const TafsirPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ayahs, setAyahs] = useState([]);
  const [status, setStatus] = useState("loading");
  const [requestVersion, setRequestVersion] = useState(0);
  const { isFavorite, toggleFavorite } = useFavorites();
  const requestedSurahId = searchParams.get("surah") ?? "1";
  const surahId = surahList.some(({ id }) => id === requestedSurahId)
    ? requestedSurahId
    : "1";
  const requestedAyah = Number(searchParams.get("ayah") ?? 1);

  useEffect(() => {
    const controller = new AbortController();
    setAyahs([]);
    setStatus("loading");

    getSurahAyahs(surahId, controller.signal)
      .then((result) => {
        setAyahs(result);
        setStatus(result.length ? "success" : "empty");
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("error");
      });

    return () => controller.abort();
  }, [requestVersion, surahId]);

  const selectedAyah =
    ayahs.find(({ number }) => number === requestedAyah) ?? ayahs[0];
  const surahName = surahList.find(({ id }) => id === String(surahId))?.label;

  const handleSurahChange = (surah) => {
    setSearchParams({ surah: surah.id, ayah: "1" });
  };

  const handleAyahChange = (ayah) => {
    setSearchParams({ surah: surahId, ayah: String(ayah.number) });
  };

  return (
    <main className="page content-page">
      <div className="app-container">
        <PageHeader
          eyebrow="المعنى والسياق"
          title="تفسير القرآن"
          description="الآية ومعناها كما وردا في التفسير الميسر، من غير اختصار أو إعادة صياغة."
        />

        <VerseTafsirSearch
          surahId={surahId}
          ayahNumber={selectedAyah?.number ?? 1}
        />

        <div className="tafsir-layout">
          <aside className="filter-panel">
            <h2>اختيار الآية</h2>
            <div className="filter-panel__field">
              <span>السورة</span>
              <SearchableSelect
                options={surahList}
                value={surahId}
                onChange={handleSurahChange}
                searchPlaceholder="ابحث باسم السورة"
                emptyMessage="لا توجد سورة بهذا الاسم."
                listLabel="قائمة السور"
              />
            </div>
            <div className="filter-panel__field">
              <span>الآية</span>
              <SearchableSelect
                options={ayahs}
                value={selectedAyah?.number ?? 1}
                onChange={handleAyahChange}
                disabled={!ayahs.length}
                getOptionValue={(ayah) => ayah.number}
                getOptionLabel={(ayah) =>
                  `الآية ${ayah.number.toLocaleString("ar-EG")} · ${ayah.text}`
                }
                getSelectedLabel={(ayah) =>
                  `الآية ${ayah.number.toLocaleString("ar-EG")}`
                }
                getSearchText={(ayah) =>
                  `${ayah.number} ${ayah.number.toLocaleString("ar-EG")} ${ayah.text}`
                }
                searchPlaceholder="ابحث برقم الآية أو كلمات منها"
                emptyMessage="لا توجد آية مطابقة للبحث."
                listLabel="آيات السورة"
              />
            </div>
            <div className="source-panel">
              <span>مصدر التفسير</span>
              <strong>التفسير الميسر</strong>
              <small>QuranEnc</small>
            </div>
          </aside>

          <section className="tafsir-content">
            {status === "loading" && (
              <FeedbackState title="جاري تحميل التفسير..." />
            )}
            {status === "error" && (
              <FeedbackState
                type="error"
                title="تعذّر تحميل التفسير"
                message="تأكد من اتصالك ثم أعد المحاولة."
                onRetry={() => setRequestVersion((value) => value + 1)}
              />
            )}
            {status === "empty" && (
              <FeedbackState type="empty" title="لا يوجد تفسير متاح" />
            )}
            {status === "success" && selectedAyah && (
              <>
                <article className="verse-panel">
                  <span>
                    {surahName} · الآية {selectedAyah.number.toLocaleString("ar-EG")}
                  </span>
                  <p className="quran-font" translate="no">
                    {selectedAyah.text}
                  </p>
                </article>
                <article className="explanation-panel">
                  <div className="explanation-panel__heading">
                    <h2>التفسير</h2>
                    <FavoriteButton
                      label="حفظ التفسير"
                      isFavorite={isFavorite(
                        "tafsir",
                        `${surahId}:${selectedAyah.number}`
                      )}
                      onToggle={() =>
                        toggleFavorite({
                          type: "tafsir",
                          entityId: `${surahId}:${selectedAyah.number}`,
                          title: `${surahName} · الآية ${selectedAyah.number.toLocaleString("ar-EG")}`,
                          subtitle: "التفسير الميسر · QuranEnc",
                          href: `/tafseer?surah=${surahId}&ayah=${selectedAyah.number}`,
                        })
                      }
                    />
                  </div>
                  <p>{selectedAyah.tafsir}</p>
                  <div className="source-note">
                    النص معروض كما ورد من المصدر دون تعديل أو اختصار.
                  </div>
                  <SourceBadge>QuranEnc · التفسير الميسر</SourceBadge>
                </article>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default TafsirPage;
