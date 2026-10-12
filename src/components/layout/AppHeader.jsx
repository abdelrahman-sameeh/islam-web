import {
  faBars,
  faBookOpen,
  faBookQuran,
  faClock,
  faMoon,
  faQuoteRight,
  faSeedling,
  faSun,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { getStoredValue, setStoredValue } from "../../lib/browserStorage";

const THEME_STORAGE_KEY = "islamona.theme.v1";

const NAV_ITEMS = [
  { label: "القرآن", to: "/quran", icon: faBookQuran },
  { label: "التفسير", to: "/tafseer", icon: faBookOpen },
  { label: "الأذكار", to: "/azkar", icon: faSeedling },
  { label: "الحديث", to: "/hadees", icon: faQuoteRight },
  { label: "مواقيت الصلاة", to: "/azan", icon: faClock },
];

const getInitialTheme = () => {
  try {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
    return window.localStorage.getItem("mode") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

const AppHeader = () => {
  const [theme, setTheme] = useState(getInitialTheme);
  const [isThemeReady, setIsThemeReady] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    let isActive = true;

    Promise.all([
      getStoredValue(THEME_STORAGE_KEY),
      getStoredValue("mode"),
    ]).then(([savedTheme, legacyTheme]) => {
      if (!isActive) return;

      if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
      } else if (legacyTheme === "dark") {
        setTheme("dark");
      }

      setIsThemeReady(true);
    });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-theme", theme === "dark");
    document.body.classList.remove("light-theme");

    if (isThemeReady) void setStoredValue(THEME_STORAGE_KEY, theme);
  }, [isThemeReady, theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  };

  return (
    <header className="app-navbar">
      <div className="app-container app-navbar__inner">
        <Link to="/" className="brand" onClick={() => setIsMenuOpen(false)}>
          <span className="brand__mark" aria-hidden="true">
            <FontAwesomeIcon icon={faBookQuran} />
          </span>
          <span>إسلامنا</span>
        </Link>

        <nav
          id="primary-navigation"
          className={`primary-navigation ${isMenuOpen ? "is-open" : ""}`}
          aria-label="التنقل الرئيسي"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "is-active" : "")}
              onClick={() => setIsMenuOpen(false)}
            >
              <FontAwesomeIcon icon={item.icon} aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="app-navbar__actions">
          <button
            type="button"
            className="icon-button"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "فعّل الوضع الداكن" : "فعّل الوضع الفاتح"}
          >
            <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
          </button>
          <button
            type="button"
            className="icon-button menu-button"
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
            aria-label={isMenuOpen ? "أغلق القائمة" : "افتح القائمة"}
          >
            <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
