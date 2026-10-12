import {
  faCheck,
  faChevronDown,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useId, useMemo, useRef, useState } from "react";

const normalizeSearchText = (value) =>
  String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .toLowerCase()
    .trim();

const getDefaultValue = (option) => option.id;
const getDefaultLabel = (option) => option.label;

const SearchableSelect = ({
  options,
  value,
  onChange,
  getOptionValue = getDefaultValue,
  getOptionLabel = getDefaultLabel,
  getSelectedLabel = getOptionLabel,
  getSearchText = getOptionLabel,
  searchPlaceholder = "ابحث",
  emptyMessage = "لا توجد نتائج مطابقة.",
  listLabel = "الخيارات المتاحة",
  sortOptions,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef(null);
  const searchInputRef = useRef(null);
  const listId = useId();

  const preparedOptions = useMemo(
    () => (sortOptions ? [...options].sort(sortOptions) : options),
    [options, sortOptions]
  );
  const selectedOption = preparedOptions.find(
    (option) => String(getOptionValue(option)) === String(value)
  );
  const filteredOptions = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) return preparedOptions;

    return preparedOptions.filter((option) =>
      normalizeSearchText(getSearchText(option)).includes(normalizedQuery)
    );
  }, [getSearchText, preparedOptions, query]);

  useEffect(() => {
    if (!isOpen) return undefined;

    searchInputRef.current?.focus();

    const closeOnOutsidePress = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setIsOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePress);
  }, [isOpen]);

  useEffect(() => {
    if (disabled) setIsOpen(false);
  }, [disabled]);

  const closeList = () => {
    setIsOpen(false);
    setQuery("");
  };

  const selectOption = (option) => {
    onChange(option);
    closeList();
  };

  return (
    <div
      className="searchable-select"
      ref={wrapperRef}
      onKeyDown={(event) => {
        if (event.key === "Escape") closeList();
      }}
    >
      <button
        type="button"
        className="searchable-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        disabled={disabled}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <span>
          {selectedOption ? getSelectedLabel(selectedOption) : "اختر من القائمة"}
        </span>
        <FontAwesomeIcon icon={faChevronDown} aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="searchable-select__popover">
          <div className="searchable-select__search">
            <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="search"
              value={query}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div
            id={listId}
            className="searchable-select__list"
            role="listbox"
            aria-label={listLabel}
          >
            {filteredOptions.map((option) => {
              const optionValue = getOptionValue(option);
              const isSelected = String(optionValue) === String(value);

              return (
                <button
                  key={optionValue}
                  type="button"
                  className={isSelected ? "is-selected" : ""}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => selectOption(option)}
                >
                  <span>{getOptionLabel(option)}</span>
                  {isSelected && (
                    <FontAwesomeIcon icon={faCheck} aria-hidden="true" />
                  )}
                </button>
              );
            })}

            {!filteredOptions.length && (
              <p className="searchable-select__empty">{emptyMessage}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
