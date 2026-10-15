import {
  getOfflineResource,
  setOfflineResource,
} from "../../../lib/offlineResourceStore";

const AUDIO_CACHE_GROUP = "quran-audio";
const AUDIO_CACHE_LIMIT = 3;

const getAudioCacheKey = (audioUrl) => `quran-audio:${audioUrl}`;

export const getCachedQuranAudio = async (audioUrl) => {
  if (!audioUrl) return null;

  const cachedAudio = await getOfflineResource(getAudioCacheKey(audioUrl));
  return typeof Blob !== "undefined" && cachedAudio instanceof Blob
    ? cachedAudio
    : null;
};

export const cacheQuranAudio = async (audioUrl) => {
  const cachedAudio = await getCachedQuranAudio(audioUrl);
  if (cachedAudio) return true;

  const response = await fetch(audioUrl, { cache: "no-store" });
  if (!response.ok) throw new Error("AUDIO_DOWNLOAD_FAILED");

  const audioBlob = await response.blob();
  if (!audioBlob.size) throw new Error("EMPTY_AUDIO_RESPONSE");

  const isSaved = await setOfflineResource({
    key: getAudioCacheKey(audioUrl),
    group: AUDIO_CACHE_GROUP,
    value: audioBlob,
    limit: AUDIO_CACHE_LIMIT,
  });

  if (!isSaved) throw new Error("AUDIO_STORAGE_FAILED");
  return true;
};
