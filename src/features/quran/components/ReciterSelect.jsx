import {
  faCheck,
  faChevronDown,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useId, useMemo, useRef, useState } from "react";

const arabicCollator = new Intl.Collator("ar", {
  sensitivity: "base",
  ignorePunctuation: true,
});

const normalizeArabicText = (value) =>
  value
    .normalize("NFKD")
    .replace(/[\u064b-\u065f\u0670]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .toLowerCase()
    .trim();

const ReciterSelect = ({ options, selectedReciter, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef(null);
  const searchInputRef = useRef(null);
  const listId = useId();

  const sortedOptions = useMemo(
    () => [...options].sort((first, second) => arabicCollator.compare(first.name, second.name)),
    [options]
  );
  const filteredOptions = useMemo(() => {
    const normalizedQuery = normalizeArabicText(query);
    if (!normalizedQuery) return sortedOptions;

    return sortedOptions.filter(({ name }) =>
      normalizeArabicText(name).includes(normalizedQuery)
    );
  }, [query, sortedOptions]);

  useEffect(() => {
    if (!isOpen) return undefined;

    searchInputRef.current?.focus();

    const closeOnOutsidePress = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setIsOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePress);
  }, [isOpen]);

  const closeList = () => {
    setIsOpen(false);
    setQuery("");
  };

  const selectReciter = (reciter) => {
    onSelect(reciter);
    closeList();
  };

  return (
    <div
      className="reciter-picker"
      ref={wrapperRef}
      onKeyDown={(event) => {
        if (event.key === "Escape") closeList();
      }}
    >
      <button
        type="button"
        className="reciter-picker__trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <span>{selectedReciter.name}</span>
        <FontAwesomeIcon icon={faChevronDown} aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="reciter-picker__popover">
          <div className="reciter-picker__search">
            <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="search"
              value={query}
              placeholder="ابحث باسم القارئ"
              aria-label="ابحث باسم القارئ"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div id={listId} className="reciter-picker__list" role="listbox">
            {filteredOptions.map((reciter) => {
              const isSelected = reciter.id === selectedReciter.id;

              return (
                <button
                  key={reciter.id}
                  type="button"
                  className={isSelected ? "is-selected" : ""}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => selectReciter(reciter)}
                >
                  <span>{reciter.name}</span>
                  {isSelected && (
                    <FontAwesomeIcon icon={faCheck} aria-hidden="true" />
                  )}
                </button>
              );
            })}

            {!filteredOptions.length && (
              <p className="reciter-picker__empty">لا يوجد قارئ بهذا الاسم.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReciterSelect;
