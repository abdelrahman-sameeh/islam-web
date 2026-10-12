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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark-theme", theme === "dark");
    document.body.classList.remove("light-theme");
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // The theme still works for the current visit when storage is unavailable.
    }
  }, [theme]);

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
