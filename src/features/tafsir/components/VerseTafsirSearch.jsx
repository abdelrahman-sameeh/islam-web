import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import surahList from "../../quran/data/surahs";
import useVerseSearch from "../hooks/useVerseSearch";

const VerseTafsirSearch = ({ surahId, ayahNumber }) => {
  const {
    draftQuery,
    result,
    status,
    validationError,
    changeDraftQuery,
    search,
    selectResult,
    retry,
  } = useVerseSearch({ surahId, ayahNumber });

  const handleSubmit = (event) => {
    event.preventDefault();
    search();
  };

  return (
    <section className="verse-search-panel" aria-label="البحث بنص الآية">
      <form className="verse-search-form" role="search" onSubmit={handleSubmit}>
        <label className="search-field">
          <FontAwesomeIcon icon={faSearch} aria-hidden="true" />
          <span className="visually-hidden">اكتب جزءًا من نص الآية</span>
          <input
            value={draftQuery}
            onChange={(event) => changeDraftQuery(event.target.value)}
            placeholder="اكتب جزءًا من الآية بالتشكيل أو من غيره"
            aria-describedby={
              validationError ? "verse-search-error" : undefined
            }
          />
        </label>
        <button
          type="submit"
          className="primary-button"
          disabled={status === "loading"}
        >
          {status === "loading" ? "جاري البحث..." : "ابحث عن التفسير"}
        </button>
      </form>

      {validationError && (
        <p className="search-error" id="verse-search-error" role="alert">
          {validationError}
        </p>
      )}

      {status === "error" && (
        <div className="verse-search-message">
          <span>تعذّر البحث في الآيات الآن.</span>
          <button type="button" className="inline-action" onClick={retry}>
            إعادة المحاولة
          </button>
        </div>
      )}

      {status === "empty" && (
        <p className="verse-search-message">
          لا توجد آيات مطابقة. جرّب كلمات أخرى.
        </p>
      )}

      {status === "success" && result && (
        <div className="verse-search-results">
          <div className="verse-search-results__heading">
            <strong>{result.totalItems.toLocaleString("ar-EG")} نتيجة</strong>
            <small>نعرض أول ٢٠ نتيجة · AlQuran Cloud</small>
          </div>
          <div className="verse-search-results__list">
            {result.items.map((item) => {
              const surahName = surahList.find(
                ({ id }) => id === item.surahId
              )?.label;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectResult(item)}
                >
                  <span>
                    {surahName} · الآية {item.ayahNumber.toLocaleString("ar-EG")}
                  </span>
                  <p className="quran-font" translate="no">
                    {item.text}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default VerseTafsirSearch;
