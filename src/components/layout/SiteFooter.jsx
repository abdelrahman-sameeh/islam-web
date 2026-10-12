import { Link } from "react-router-dom";

const SiteFooter = () => {
  return (
    <footer className="site-footer">
      <div className="app-container site-footer__inner">
        <div>
          <strong>إسلامنا</strong>
          <p>عبادة وفهم، على قد وقتك.</p>
        </div>
        <nav aria-label="روابط التذييل">
          <Link to="/quran">القرآن</Link>
          <Link to="/azkar">الأذكار</Link>
          <Link to="/azan">مواقيت الصلاة</Link>
        </nav>
        <p className="site-footer__note">
          نعرض المحتوى الديني مع مصدره، واختياراتك محفوظة على جهازك فقط.
        </p>
      </div>
    </footer>
  );
};

export default SiteFooter;
