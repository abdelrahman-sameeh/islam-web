import SearchableSelect from "../../../components/ui/SearchableSelect";

const arabicCollator = new Intl.Collator("ar", {
  sensitivity: "base",
  ignorePunctuation: true,
});

const ReciterSelect = ({
  options,
  selectedReciter,
  onSelect,
  disabled = false,
}) => (
  <SearchableSelect
    options={options}
    value={selectedReciter.id}
    onChange={onSelect}
    disabled={disabled}
    getOptionLabel={(reciter) => reciter.name}
    searchPlaceholder="ابحث باسم القارئ"
    emptyMessage="لا يوجد قارئ بهذا الاسم."
    listLabel="قائمة القراء"
    sortOptions={(first, second) =>
      arabicCollator.compare(first.name, second.name)
    }
  />
);

export default ReciterSelect;
