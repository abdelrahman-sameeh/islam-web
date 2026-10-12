import { faClock, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";
import FeedbackState from "../../../components/feedback/FeedbackState";
import PageHeader from "../../../components/layout/PageHeader";
import SearchableSelect from "../../../components/ui/SearchableSelect";
import SourceBadge from "../../../components/ui/SourceBadge";
import {
  PRAYER_COUNTRIES,
  getLocationId,
} from "../data/prayerLocations";
import usePrayerTimes from "../hooks/usePrayerTimes";
import {
  formatPrayerTime,
  formatRemaining,
  getNextPrayer,
} from "../utils/prayerTime";

const PrayerTimesPage = () => {
  const {
    data,
    retry,
    selectedLocation,
    setLocationId,
    status,
  } = usePrayerTimes();
  const selectedCountry = selectedLocation?.country ?? PRAYER_COUNTRIES[0];
  const selectedCity = selectedLocation?.city ?? selectedCountry.cities[0];
  const nextPrayer = useMemo(
    () => (data ? getNextPrayer(data.prayers, data.timezone) : null),
    [data]
  );

  const handleCountryChange = (country) => {
    setLocationId(getLocationId(country.id, country.cities[0].id));
  };

  const handleCityChange = (city) => {
    setLocationId(getLocationId(selectedCountry.id, city.id));
  };

  return (
    <main className="page content-page">
      <div className="app-container">
        <PageHeader
          eyebrow="يومك حول الصلاة"
          title="مواقيت الصلاة"
          description="مواقيت اليوم حسب الدولة والمحافظة أو المدينة وطريقة الحساب الظاهرة أدناه."
        />

        {status === "loading" && <FeedbackState title="جاري حساب المواقيت..." />}
        {status === "error" && (
          <FeedbackState
            type="error"
            title="تعذّر تحميل المواقيت"
            message="اختر المدينة أو حاول مرة أخرى بعد قليل."
            onRetry={retry}
          />
        )}
        {status === "empty" && (
          <FeedbackState type="empty" title="لا توجد مواقيت متاحة" />
        )}

        {status === "success" && data && nextPrayer && (
          <section className="next-prayer-card">
            <div>
              <p>{nextPrayer.isTomorrow ? "أول صلاة غدًا" : "الصلاة القادمة"}</p>
              <h2>
                {nextPrayer.name} · {formatPrayerTime(nextPrayer.time)}
              </h2>
              <span>{formatRemaining(nextPrayer.remaining)}</span>
            </div>
            <span className="next-prayer-card__clock" aria-hidden="true">
              <FontAwesomeIcon icon={faClock} />
            </span>
          </section>
        )}

        {selectedLocation && (
          <section className="location-bar">
            <div className="location-bar__summary">
              <span>
                <FontAwesomeIcon icon={faLocationDot} /> الموقع
              </span>
              <strong>
                {selectedCity.name}، {selectedCountry.name}
              </strong>
            </div>
            <div className="location-bar__selectors">
              <div className="location-bar__field">
                <span>الدولة</span>
                <SearchableSelect
                  options={PRAYER_COUNTRIES}
                  value={selectedCountry.id}
                  onChange={handleCountryChange}
                  getOptionLabel={(country) => country.name}
                  searchPlaceholder="ابحث باسم الدولة"
                  emptyMessage="لا توجد دولة بهذا الاسم."
                  listLabel="قائمة الدول"
                />
              </div>
              <div className="location-bar__field">
                <span>{selectedCountry.id === "EG" ? "المحافظة" : "المدينة"}</span>
                <SearchableSelect
                  options={selectedCountry.cities}
                  value={selectedCity.id}
                  onChange={handleCityChange}
                  getOptionLabel={(city) => city.name}
                  searchPlaceholder={
                    selectedCountry.id === "EG"
                      ? "ابحث باسم المحافظة"
                      : "ابحث باسم المدينة"
                  }
                  emptyMessage="لا يوجد موقع بهذا الاسم."
                  listLabel="قائمة المدن والمحافظات"
                />
              </div>
            </div>
          </section>
        )}

        {status === "success" && data && nextPrayer && (
          <>
            <div className="prayer-layout">
              <section className="prayer-table-card">
                <div className="results-heading">
                  <h2>مواقيت اليوم</h2>
                  <span>{data.gregorianDate}</span>
                </div>
                <div className="prayer-list">
                  {data.prayers.map((prayer) => (
                    <div
                      key={prayer.key}
                      className={prayer.key === nextPrayer.key ? "is-next" : ""}
                    >
                      <span>
                        {prayer.name}
                        {prayer.key === nextPrayer.key && " · القادمة"}
                      </span>
                      <strong>{formatPrayerTime(prayer.time)}</strong>
                    </div>
                  ))}
                </div>
              </section>

              <aside className="date-card">
                <span>التاريخ الهجري</span>
                <strong>
                  {data.hijriDay} {data.hijriMonth} {data.hijriYear}
                </strong>
                <small>{data.weekday}</small>
                <hr />
                <span>طريقة الحساب</span>
                <p>{data.calculationMethod}</p>
                <SourceBadge>AlAdhan API</SourceBadge>
              </aside>
            </div>

            <p className="calculation-note">
              قد تختلف المواقيت دقائق قليلة عن المسجد المحلي؛ راجع الجهة الرسمية
              في مدينتك عند الحاجة.
            </p>
          </>
        )}
      </div>
    </main>
  );
};

export default PrayerTimesPage;
