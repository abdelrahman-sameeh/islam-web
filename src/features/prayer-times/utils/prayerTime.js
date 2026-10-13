const DAILY_PRAYER_KEYS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const formatPrayerTime = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return new Intl.DateTimeFormat("ar-EG", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const getCurrentMinutes = (timezone) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const hours = Number(parts.find(({ type }) => type === "hour")?.value ?? 0);
  const minutes = Number(
    parts.find(({ type }) => type === "minute")?.value ?? 0
  );
  return hours * 60 + minutes;
};

export const getDailyPrayers = (prayers) =>
  prayers.filter(({ key }) => DAILY_PRAYER_KEYS.includes(key));

export const getNextPrayer = (prayers, timezone) => {
  const currentMinutes = getCurrentMinutes(timezone);
  const requiredPrayers = getDailyPrayers(prayers);
  const todayPrayer = requiredPrayers.find(
    ({ time }) => timeToMinutes(time) > currentMinutes
  );
  const prayer = todayPrayer ?? requiredPrayers[0];

  if (!prayer) return null;

  let remaining = timeToMinutes(prayer.time) - currentMinutes;
  if (remaining <= 0) remaining += 24 * 60;

  return {
    ...prayer,
    isTomorrow: !todayPrayer,
    remaining,
  };
};

export const formatRemaining = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `متبقي ${rest.toLocaleString("ar-EG")} دقيقة`;
  if (!rest) return `متبقي ${hours.toLocaleString("ar-EG")} ساعة`;
  return `متبقي ${hours.toLocaleString("ar-EG")} ساعة و${rest.toLocaleString("ar-EG")} دقيقة`;
};
