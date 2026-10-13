import { faHeadphones, faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import FeedbackState from "../../../components/feedback/FeedbackState";
import PageHeader from "../../../components/layout/PageHeader";
import SearchableSelect from "../../../components/ui/SearchableSelect";
import SourceBadge from "../../../components/ui/SourceBadge";
import FavoriteButton from "../../favorites/components/FavoriteButton";
import useFavorites from "../../favorites/hooks/useFavorites";
import surahList from "../data/surahs";
import { getSurahAyahs } from "../api/quranApi";
import {
  DEFAULT_RECITER,
  getReciters,
  getSurahAudioUrl,
} from "../api/recitationsApi";
import ReciterSelect from "../components/ReciterSelect";
import {
  BISMILLAH,
  shouldShowStandaloneBismillah,
} from "../utils/bismillah";

const getSafeSurahId = (value) => {
  const number = Number(value);
  return Number.isInteger(number) && number >= 1 && number <= 114
    ? String(number)
    : "1";
};

const getReaderPath = (surahId, reciterId) => {
  const path = `/quran/surah/${surahId}`;
  return reciterId && reciterId !== DEFAULT_RECITER.id
    ? `${path}?reciter=${encodeURIComponent(reciterId)}`
    : path;
};

const QuranReaderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const surahId = getSafeSurahId(id);
  const requestedReciterId = searchParams.get("reciter");
  const [ayahs, setAyahs] = useState([]);
  const [status, setStatus] = useState("loading");
  const [requestVersion, setRequestVersion] = useState(0);
  const [reciters, setReciters] = useState([]);
  const [selectedReciter, setSelectedReciter] = useState(DEFAULT_RECITER);
  const { isFavorite, toggleFavorite } = useFavorites();

  const passageStart = Number(searchParams.get("from"));
  const passageEnd = Number(searchParams.get("to"));
  const hasPassageRange =
    searchParams.get("session") === "1" &&
    Number.isInteger(passageStart) &&
    Number.isInteger(passageEnd) &&
    passageStart > 0 &&
    passageEnd >= passageStart;

  useEffect(() => {
    const controller = new AbortController();
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
  }, [surahId, requestVersion]);

  useEffect(() => {
    const controller = new AbortController();

    getReciters(controller.signal)
      .then(setReciters)
      .catch(() => setReciters([]));

    return () => controller.abort();
  }, []);

  const visibleAyahs = useMemo(
    () =>
      hasPassageRange
        ? ayahs.filter(
            ({ number }) => number >= passageStart && number <= passageEnd
          )
        : ayahs,
    [ayahs, hasPassageRange, passageEnd, passageStart]
  );
  const surahName = surahList.find(({ id: itemId }) => itemId === surahId)?.label;
  const availableSurahs = selectedReciter.availableSurahs
    ? surahList.filter(({ id: itemId }) =>
        selectedReciter.availableSurahs.includes(itemId)
      )
    : surahList;
  const reciterOptions = useMemo(
    () => [
      DEFAULT_RECITER,
      ...reciters.filter(
        ({ id: reciterId }) => reciterId !== DEFAULT_RECITER.id
      ),
    ],
    [reciters]
  );

  useEffect(() => {
    if (!requestedReciterId) {
      setSelectedReciter(DEFAULT_RECITER);
      return;
    }

    const requestedReciter = reciterOptions.find(
      ({ id: reciterId }) => reciterId === requestedReciterId
    );
    if (!requestedReciter) return;

    if (
      requestedReciter.availableSurahs &&
      !requestedReciter.availableSurahs.includes(surahId)
    ) {
      navigate(
        getReaderPath(
          requestedReciter.availableSurahs[0] ?? "1",
          requestedReciter.id
        ),
        { replace: true }
      );
      return;
    }

    setSelectedReciter((currentReciter) =>
      currentReciter.id === requestedReciter.id
        ? currentReciter
        : requestedReciter
    );
  }, [navigate, reciterOptions, requestedReciterId, surahId]);

  const handleReciterChange = (reciter) => {
    setSelectedReciter(reciter);
    const nextSurahId =
      reciter.availableSurahs && !reciter.availableSurahs.includes(surahId)
        ? reciter.availableSurahs[0] ?? "1"
        : surahId;

    navigate(getReaderPath(nextSurahId, reciter.id));
  };

  return (
    <main className="page content-page">
      <div className="app-container">
        <PageHeader
          eyebrow="قراءة واستماع"
          title="القرآن الكريم"
          description="مساحة قراءة هادئة مع تلاوات متعددة ونص واضح."
        />

        <section className="reader-toolbar" aria-label="إعدادات القراءة">
          <div className="reader-toolbar__field">
            <span>السورة</span>
            <SearchableSelect
              options={availableSurahs}
              value={surahId}
              onChange={(surah) =>
                navigate(getReaderPath(surah.id, selectedReciter.id))
              }
              searchPlaceholder="ابحث باسم السورة"
              emptyMessage="لا توجد سورة بهذا الاسم."
              listLabel="قائمة السور"
            />
            <FavoriteButton
              label="حفظ السورة"
              isFavorite={isFavorite("surah", surahId)}
              onToggle={() =>
                toggleFavorite({
                  type: "surah",
                  entityId: surahId,
                  title: surahName,
                  subtitle: `السورة رقم ${Number(surahId).toLocaleString("ar-EG")}`,
                  href: `/quran/surah/${surahId}`,
                })
              }
            />
          </div>
          <div className="reader-toolbar__field">
            <span>القارئ والرواية</span>
            <ReciterSelect
              options={reciterOptions}
              selectedReciter={selectedReciter}
              onSelect={handleReciterChange}
            />
            <FavoriteButton
              label="حفظ القارئ"
              isFavorite={isFavorite("reciter", selectedReciter.id)}
              onToggle={() =>
                toggleFavorite({
                  type: "reciter",
                  entityId: selectedReciter.id,
                  title: selectedReciter.name,
                  subtitle: "قارئ ورواية في مشغل القرآن",
                  href: getReaderPath(surahId, selectedReciter.id),
                })
              }
            />
          </div>
          <span className="reader-toolbar__icon" aria-hidden="true">
            <FontAwesomeIcon icon={faSliders} />
          </span>
        </section>

        {hasPassageRange && (
          <div className="session-passage-note">
            جلسة مركّزة · الآيات {passageStart.toLocaleString("ar-EG")}–
            {passageEnd.toLocaleString("ar-EG")}
          </div>
        )}

        {status === "loading" && (
          <FeedbackState title="جاري تجهيز السورة..." message="نحمّل النص من مصدره." />
        )}
        {status === "error" && (
          <FeedbackState
            type="error"
            title="تعذّر تحميل السورة"
            message="تأكد من اتصالك بالإنترنت ثم حاول مرة أخرى."
            onRetry={() => setRequestVersion((value) => value + 1)}
          />
        )}
        {status === "empty" && (
          <FeedbackState type="empty" title="لا توجد آيات للعرض" />
        )}

        {status === "success" && (
          <section className="reading-card" aria-labelledby="surah-title">
            <header className="reading-card__header">
              <div>
                <p>سورة رقم {Number(surahId).toLocaleString("ar-EG")}</p>
                <h2 id="surah-title">{surahName}</h2>
              </div>
              <SourceBadge>QuranEnc · التفسير الميسر</SourceBadge>
            </header>
            {shouldShowStandaloneBismillah(
              surahId,
              hasPassageRange && passageStart > 1
            ) && (
              <p className="quran-bismillah" translate="no">
                {BISMILLAH}
              </p>
            )}
            <div className="quran-text" translate="no">
              {visibleAyahs.map((ayah) => (
                <span key={ayah.id}>
                  {ayah.text}
                  <b aria-label={`الآية ${ayah.number}`}>
                    {ayah.number.toLocaleString("ar-EG")}
                  </b>
                </span>
              ))}
            </div>
          </section>
        )}

        {!hasPassageRange && (
          <div className="audio-player">
            <span aria-hidden="true">
              <FontAwesomeIcon icon={faHeadphones} />
            </span>
            <div>
              <strong>{surahName}</strong>
              <small>{selectedReciter.name}</small>
            </div>
            <audio
              key={`${selectedReciter.server}-${surahId}`}
              controls
              src={getSurahAudioUrl(selectedReciter.server, surahId)}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default QuranReaderPage;
