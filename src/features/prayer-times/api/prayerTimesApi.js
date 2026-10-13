import axios from "axios";

const PRAYER_TIMES_URL = "https://api.aladhan.com/v1/timingsByCity";

const PRAYERS = [
  ["Fajr", "الفجر"],
  ["Sunrise", "الشروق"],
  ["Dhuhr", "الظهر"],
  ["Asr", "العصر"],
  ["Maghrib", "المغرب"],
  ["Isha", "العشاء"],
];

const formatApiDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}-${month}-${date.getFullYear()}`;
};

export const getPrayerTimes = async (location, signal) => {
  if (!location?.country || !location?.city) {
    throw new Error("INVALID_PRAYER_LOCATION");
  }

  const response = await axios.get(
    `${PRAYER_TIMES_URL}/${formatApiDate(new Date())}`,
    {
      params: {
        city: location.city.apiName,
        country: location.country.id,
        method: location.country.method,
      },
      signal,
    }
  );
  const data = response.data?.data;

  if (!data?.timings || !data?.date) {
    throw new Error("INVALID_PRAYER_TIMES");
  }

  return {
    prayers: PRAYERS.map(([key, name]) => ({
      key,
      name,
      time: String(data.timings[key]).split(" ")[0],
    })),
    hijriDay: data.date.hijri?.day,
    hijriMonth: data.date.hijri?.month?.ar,
    hijriYear: data.date.hijri?.year,
    gregorianDate: data.date.gregorian?.date,
    weekday: data.date.hijri?.weekday?.ar,
    calculationMethod: data.meta?.method?.name,
    timezone: data.meta?.timezone ?? "Africa/Cairo",
  };
};
