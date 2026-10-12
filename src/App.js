import { Route, Routes } from "react-router-dom";
import HomePage from "./features/home/pages/HomePage";
import QuranPage from "./pages/QuranPage";
import AzkarPage from "./pages/AzkarPage";
import TafseerPage from "./pages/TafseerPage";
import HadeesPage from "./pages/HadeesPage";
import AzanPage from "./pages/AzanPage";
import AppHeader from "./components/layout/AppHeader";
import SiteFooter from "./components/layout/SiteFooter";

function App() {
  return (
    <div className="App">
      <AppHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quran" >
          <Route index element={<QuranPage />} />
          <Route path="surah/:id" element={<QuranPage />} />
        </Route>

        <Route path="/azkar" element={<AzkarPage />} />
        <Route path="/hadees" element={<HadeesPage />} />
        <Route path="/tafseer" element={<TafseerPage />} />
        <Route path="/azan" element={<AzanPage />} />
      </Routes>
      <SiteFooter />
    </div>
  );
}

export default App;
