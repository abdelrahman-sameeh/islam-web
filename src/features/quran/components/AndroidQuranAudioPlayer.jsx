import {
  faCheck,
  faDownload,
  faHeadphones,
  faPause,
  faPlay,
  faVolumeHigh,
  faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAndroidQuranAudio from "../hooks/useAndroidQuranAudio";

const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(Math.max(0, milliseconds) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toLocaleString("ar-EG", {
    minimumIntegerDigits: 2,
  })}:${seconds.toLocaleString("ar-EG", { minimumIntegerDigits: 2 })}`;
};

const getStatusMessage = ({ cacheStatus, playbackState, displayError }) => {
  if (displayError) return displayError;
  if (playbackState === "buffering") return "جاري تجهيز التلاوة...";
  if (cacheStatus === "saved") {
    return "محفوظة في مكتبتك حتى تحذفها بنفسك.";
  }
  if (cacheStatus === "cached") {
    return "محفوظة على الجهاز، وتستمر عند قفل الشاشة.";
  }
  if (cacheStatus === "saving") {
    return "تستمر عند قفل الشاشة، وجارٍ حفظها للاستخدام دون إنترنت.";
  }
  if (cacheStatus === "error") {
    return "يستمر التشغيل، لكن تعذّر حفظ التلاوة على الجهاز.";
  }
  return "تستمر عند قفل الشاشة، وستُحفظ تلقائيًا عند تشغيلها.";
};

const AndroidQuranAudioPlayer = ({
  audioUrl,
  surahId,
  surahName,
  reciterId,
  reciterName,
}) => {
  const player = useAndroidQuranAudio({
    audioUrl,
    title: surahName,
    artist: reciterName,
    surahId,
    reciterId,
  });
  const position = player.isCurrentAudio ? player.position : 0;
  const duration = player.isCurrentAudio ? player.duration : 0;
  const isPlaying = player.isCurrentAudio && player.isPlaying;
  const statusMessage = getStatusMessage(player);

  return (
    <div className="audio-player audio-player--native">
      <span aria-hidden="true">
        <FontAwesomeIcon icon={faHeadphones} />
      </span>
      <div className="audio-player__details">
        <strong>{surahName}</strong>
        <small>{reciterName}</small>
        <small className="audio-player__offline" role="status">
          {statusMessage}
        </small>
      </div>
      <div className="native-audio-controls">
        <button
          type="button"
          className="native-audio-controls__toggle"
          aria-label={isPlaying ? "إيقاف التلاوة مؤقتًا" : "تشغيل التلاوة"}
          onClick={player.togglePlayback}
        >
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </button>
        <input
          type="range"
          dir="ltr"
          min="0"
          max={Math.max(duration, 1)}
          step="1000"
          value={Math.min(position, Math.max(duration, 1))}
          disabled={!duration}
          aria-label="موضع التلاوة"
          onChange={(event) => player.seekTo(Number(event.target.value))}
        />
        <span className="native-audio-controls__time" dir="ltr">
          {formatTime(position)} / {formatTime(duration)}
        </span>
        <label className="native-audio-controls__volume">
          <FontAwesomeIcon
            icon={player.volume === 0 ? faVolumeXmark : faVolumeHigh}
            aria-hidden="true"
          />
          <span className="visually-hidden">مستوى الصوت</span>
          <input
            type="range"
            dir="ltr"
            min="0"
            max="1"
            step="0.05"
            value={player.volume}
            aria-label="مستوى الصوت"
            onChange={(event) => player.setVolume(Number(event.target.value))}
          />
        </label>
        <button
          type="button"
          className="native-audio-controls__save"
          disabled={player.isSaving || player.cacheStatus === "saved"}
          onClick={player.saveForOffline}
        >
          <FontAwesomeIcon
            icon={player.cacheStatus === "saved" ? faCheck : faDownload}
            aria-hidden="true"
          />
          {player.cacheStatus === "saved"
            ? "محفوظة"
            : player.isSaving
            ? "جاري الحفظ..."
            : "حفظ على الجهاز"}
        </button>
      </div>
    </div>
  );
};

export default AndroidQuranAudioPlayer;
