import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FavoriteButton = ({ isFavorite, onToggle, label }) => (
  <button
    type="button"
    className={`favorite-button ${isFavorite ? "is-favorite" : ""}`}
    aria-pressed={isFavorite}
    onClick={onToggle}
  >
    <FontAwesomeIcon icon={faBookmark} aria-hidden="true" />
    <span>{isFavorite ? "محفوظ" : label}</span>
  </button>
);

export default FavoriteButton;
