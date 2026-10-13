import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const FeatureCard = ({ description, icon, title, to }) => (
  <article className="feature-card">
    <span className="feature-card__icon" aria-hidden="true">
      <FontAwesomeIcon icon={icon} />
    </span>
    <h3>{title}</h3>
    <p>{description}</p>
    <Link to={to} aria-label={`افتح ${title}`}>
      افتح القسم
      <span aria-hidden="true">←</span>
    </Link>
  </article>
);

export default FeatureCard;
