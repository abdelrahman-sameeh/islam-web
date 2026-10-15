import QuranAudio, {
  isAndroidNativeRuntime,
} from "../native/quranAudioPlugin";
import {
  listSavedQuranAudio,
  removeSavedQuranAudio,
} from "./quranAudioCache";

export const listDownloadedQuranAudio = async () => {
  if (!isAndroidNativeRuntime()) return listSavedQuranAudio();

  const result = await QuranAudio.listDownloads();
  return Array.isArray(result?.items) ? result.items : [];
};

export const removeDownloadedQuranAudio = async (audioUrl) => {
  if (!isAndroidNativeRuntime()) return removeSavedQuranAudio(audioUrl);

  const result = await QuranAudio.removeDownload({ url: audioUrl });
  return result?.removed === true;
};
