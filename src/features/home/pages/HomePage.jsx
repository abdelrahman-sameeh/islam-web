import {
  faBookOpen,
  faBookQuran,
  faClock,
  faQuoteRight,
  faSeedling,
} from "@fortawesome/free-solid-svg-icons";
import DailySessionCard from "../components/DailySessionCard";
import FeatureCard from "../components/FeatureCard";
import HomeInspiration from "../components/HomeInspiration";
import HomePrayerTimes from "../components/HomePrayerTimes";

const FEATURES = [
  {
    title: "القرآن الكريم",
    description: "قراءة هادئة وتلاوات من قرّاء متعددين.",
    icon: faBookQuran,
    to: "/quran",
  },
  {
    title: "التفسير الميسر",
    description: "الآية ومعناها في مساحة واضحة ومريحة.",
    icon: faBookOpen,
    to: "/tafseer",
  },
  {
    title: "الأذكار",
    description: "أذكار يومية مرتبة حسب الوقت والمناسبة.",
    icon: faSeedling,
    to: "/azkar",
  },
  {
    title: "الأحاديث النبوية",
    description: "اقرأ الحديث ثم ارجع إلى مصدره وشرحه.",
    icon: faQuoteRight,
    to: "/hadees",
  },
  {
    title: "مواقيت الصلاة",
    description: "مواقيت اليوم والتاريخ الهجري لمدينتك.",
    icon: faClock,
    to: "/azan",
  },
];

const HomePage = () => (
  <main className="home-page page">
    <div className="app-container">
      <DailySessionCard />

      <HomePrayerTimes />

      <HomeInspiration />

      <section className="home-values" aria-label="مبادئ التجربة">
        <div>
          <strong>بدون حساب</strong>
          <span>ابدأ فورًا</span>
        </div>
        <div>
          <strong>محفوظ محليًا</strong>
          <span>خصوصيتك أولًا</span>
        </div>
        <div>
          <strong>محتوى موثّق</strong>
          <span>المصدر ظاهر دائمًا</span>
        </div>
      </section>

      <section className="home-features" aria-labelledby="features-title">
        <div className="section-heading">
          <div>
            <p>استكشف إسلامنا</p>
            <h2 id="features-title">كل ما تحتاجه في مكان هادئ</h2>
          </div>
          <p>اختر القسم المناسب لك، وارجع في أي وقت من نفس المكان.</p>
        </div>
        <div className="feature-grid">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.to} {...feature} />
          ))}
        </div>
      </section>
    </div>
  </main>
);

export default HomePage;
