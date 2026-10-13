import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SourceBadge from "../../../components/ui/SourceBadge";
import { getAdhkar } from "../../adhkar/api/adhkarApi";
import { getSurahAyahs } from "../../quran/api/quranApi";
import surahList from "../../quran/data/surahs";

const getRandomItem = (items) =>
  items[Math.floor(Math.random() * items.length)];

const loadRandomContent = async (signal) => {
  const surah = getRandomItem(surahList);
  const [ayahs, categories] = await Promise.all([
    getSurahAyahs(surah.id, signal),
    getAdhkar(signal),
  ]);
  const adhkar = categories.flatMap((category) =>
    category.items
      .filter(({ content }) => content)
      .map((item) => ({ ...item, category: category.title }))
  );

  return {
    ayah: getRandomItem(ayahs),
    dhikr: getRandomItem(adhkar),
    surah,
  };
};

const HomeInspiration = () => {
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState("loading");
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");

    loadRandomContent(controller.signal)
      .then((result) => {
        setContent(result);
        setStatus(result.ayah && result.dhikr ? "success" : "empty");
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("error");
      });

    return () => controller.abort();
  }, [requestVersion]);

  if (status === "loading") {
    return (
      <section className="home-inspiration is-loading" aria-busy="true">
        <p>نختار لك آية وذكرًا لهذه الزيارة...</p>
      </section>
    );
  }

  if (status !== "success" || !content) {
    return (
      <section className="home-inspiration home-inspiration--feedback">
        <p>تعذّر تحميل الآية والذكر الآن.</p>
        <button
          className="secondary-button"
          type="button"
          onClick={() => setRequestVersion((value) => value + 1)}
        >
          حاول مرة أخرى
        </button>
      </section>
    );
  }

  const { ayah, dhikr, surah } = content;

  return (
    <section className="home-inspiration" aria-label="آية وذكر عشوائيان">
      <article className="home-inspiration__ayah">
        <div className="home-inspiration__heading">
          <span>آية لك في هذه الزيارة</span>
          <SourceBadge>QuranEnc</SourceBadge>
        </div>
        <p className="quran-font" translate="no">
          {ayah.text}
        </p>
        <Link to={`/quran/surah/${surah.id}`}>
          {surah.label} · الآية {ayah.number.toLocaleString("ar-EG")}
        </Link>
      </article>

      <article className="home-inspiration__dhikr">
        <div className="home-inspiration__heading">
          <span>ذكر أو دعاء</span>
          <SourceBadge>الأذكار</SourceBadge>
        </div>
        <p>{dhikr.content}</p>
        <Link to="/azkar">{dhikr.category}</Link>
      </article>
    </section>
  );
};

export default HomeInspiration;
