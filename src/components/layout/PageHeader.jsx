const PageHeader = ({ eyebrow, title, description, action }) => (
  <header className="page-header">
    <div>
      {eyebrow && <p>{eyebrow}</p>}
      <h1>{title}</h1>
      <span>{description}</span>
    </div>
    {action && <div className="page-header__action">{action}</div>}
  </header>
);

export default PageHeader;
