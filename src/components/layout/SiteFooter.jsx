import { Link } from "react-router-dom";
import { APP_NAME, APP_TAGLINE } from "../../app/appMetadata";

const SiteFooter = () => {
  return (
    <footer className="site-footer">
      <div className="app-container site-footer__inner">
        <div className="site-footer__brand">
          <Link to="/">{APP_NAME}</Link>
          <p>{APP_TAGLINE}</p>
        </div>
        <div className="site-footer__links">
          <strong>المحتوى</strong>
          <nav aria-label="روابط المحتوى">
            <Link to="/quran">القرآن</Link>
            <Link to="/tafseer">التفسير</Link>
            <Link to="/hadees">الحديث</Link>
            <Link to="/azkar">الأذكار</Link>
          </nav>
        </div>
        <div className="site-footer__links">
          <strong>يومك</strong>
          <nav aria-label="روابط يومك">
            <Link to="/session">جلسة اليوم</Link>
            <Link to="/azan">مواقيت الصلاة</Link>
            <Link to="/favorites">المفضلة</Link>
          </nav>
        </div>
        <div className="site-footer__privacy">
          <strong>خصوصيتك محفوظة</strong>
          <p>اختياراتك ومفضّلتك محفوظة على هذا الجهاز فقط، بدون إنشاء حساب.</p>
        </div>
      </div>
      <div className="app-container site-footer__bottom">
        <span>المصادر موضّحة داخل كل قسم.</span>
        <span>{APP_NAME} · تجربة عربية هادئة للعبادة والفهم</span>
      </div>
    </footer>
  );
};

export default SiteFooter;
