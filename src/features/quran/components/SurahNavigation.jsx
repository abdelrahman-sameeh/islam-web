import {
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SurahNavigation = ({ previousSurah, nextSurah, onSelect }) => (
  <nav className="surah-navigation" aria-label="التنقل بين السور">
    <button
      type="button"
      disabled={!previousSurah}
      onClick={() => previousSurah && onSelect(previousSurah)}
      aria-label={
        previousSurah
          ? `السورة السابقة: ${previousSurah.label}`
          : "لا توجد سورة سابقة"
      }
    >
      <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
      <span>{previousSurah?.label ?? "السورة السابقة"}</span>
    </button>
    <button
      type="button"
      disabled={!nextSurah}
      onClick={() => nextSurah && onSelect(nextSurah)}
      aria-label={
        nextSurah
          ? `السورة التالية: ${nextSurah.label}`
          : "لا توجد سورة تالية"
      }
    >
      <span>{nextSurah?.label ?? "السورة التالية"}</span>
      <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
    </button>
  </nav>
);

export default SurahNavigation;
