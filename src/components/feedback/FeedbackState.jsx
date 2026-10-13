const FeedbackState = ({ type = "loading", title, message, onRetry }) => (
  <div
    className={`feedback-state feedback-state--${type}`}
    role={type === "error" ? "alert" : "status"}
    aria-live="polite"
  >
    {type === "loading" && <span className="feedback-state__pulse" />}
    <strong>{title}</strong>
    {message && <p>{message}</p>}
    {type === "error" && onRetry && (
      <button className="secondary-button" type="button" onClick={onRetry}>
        حاول مرة أخرى
      </button>
    )}
  </div>
);

export default FeedbackState;
