import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QuranPage from "./pages/QuranPage";
import AzkarPage from "./pages/AzkarPage";
import TafseerPage from "./pages/TafseerPage";
import HadeesPage from "./pages/HadeesPage";
import AzanPage from "./pages/AzanPage";
import Navbar from "./components/utility/Navbar";
import Footer from "./components/utility/Footer";

function App() {
  return (
    <div className="App">

      {/* start header */}
      <Navbar />

      {/* start content */}
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

      {/* start footer */}
      <Footer />
    </div>
  );
}

export default App;
