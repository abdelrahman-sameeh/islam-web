import { Route, Routes } from "react-router-dom";
import HomePage from "./features/home/pages/HomePage";
import DailySessionPage from "./features/home/pages/DailySessionPage";
import QuranReaderPage from "./features/quran/pages/QuranReaderPage";
import TafsirPage from "./features/tafsir/pages/TafsirPage";
import AdhkarPage from "./features/adhkar/pages/AdhkarPage";
import HadithPage from "./features/hadith/pages/HadithPage";
import PrayerTimesPage from "./features/prayer-times/pages/PrayerTimesPage";
import FavoritesPage from "./features/favorites/pages/FavoritesPage";
import AppHeader from "./components/layout/AppHeader";
import SiteFooter from "./components/layout/SiteFooter";
import ScrollToTop from "./components/navigation/ScrollToTop";

function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <AppHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/session" element={<DailySessionPage />} />
        <Route path="/quran" >
          <Route index element={<QuranReaderPage />} />
          <Route path="surah/:id" element={<QuranReaderPage />} />
        </Route>

        <Route path="/azkar" element={<AdhkarPage />} />
        <Route path="/hadees" element={<HadithPage />} />
        <Route path="/tafseer" element={<TafsirPage />} />
        <Route path="/azan" element={<PrayerTimesPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Routes>
      <SiteFooter />
    </div>
  );
}

export default App;
