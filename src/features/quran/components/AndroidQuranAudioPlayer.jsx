import {
  faCheck,
  faDownload,
  faHeadphones,
  faPause,
  faPlay,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useAndroidQuranAudio from "../hooks/useAndroidQuranAudio";

const SEEK_STEP = 10_000;

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
  return "بث مباشر؛ اضغط «حفظ على الجهاز» لتعمل دون إنترنت.";
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
  const [pendingPosition, setPendingPosition] = useState(null);
  const pendingPositionRef = useRef(null);
  const displayedPosition = pendingPosition ?? position;

  useEffect(() => {
    pendingPositionRef.current = null;
    setPendingPosition(null);
  }, [audioUrl]);

  const handleSeekPreview = (event) => {
    const nextPosition = Number(event.target.value);
    pendingPositionRef.current = nextPosition;
    setPendingPosition(nextPosition);
  };

  const handleSeekCommit = () => {
    const nextPosition = pendingPositionRef.current;
    if (nextPosition === null) return;

    pendingPositionRef.current = null;
    setPendingPosition(null);
    void player.seekTo(nextPosition);
  };

  const handleSeekBy = (offset) => {
    const nextPosition = Math.min(
      Math.max(position + offset, 0),
      Math.max(duration, 0)
    );
    void player.seekTo(nextPosition);
  };

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
        <div className="native-audio-controls__transport" dir="ltr">
          <button
            type="button"
            className="native-audio-controls__skip"
            disabled={!duration}
            aria-label="الرجوع عشر ثوانٍ"
            onClick={() => handleSeekBy(-SEEK_STEP)}
          >
            −١٠ ث
          </button>
          <button
            type="button"
            className="native-audio-controls__toggle"
            aria-label={isPlaying ? "إيقاف التلاوة مؤقتًا" : "تشغيل التلاوة"}
            onClick={player.togglePlayback}
          >
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </button>
          <button
            type="button"
            className="native-audio-controls__skip"
            disabled={!duration}
            aria-label="التقديم عشر ثوانٍ"
            onClick={() => handleSeekBy(SEEK_STEP)}
          >
            +١٠ ث
          </button>
        </div>
        <div className="native-audio-controls__progress">
          <input
            type="range"
            dir="ltr"
            min="0"
            max={Math.max(duration, 1)}
            step="1000"
            value={Math.min(displayedPosition, Math.max(duration, 1))}
            disabled={!duration}
            aria-label="موضع التلاوة"
            onChange={handleSeekPreview}
            onPointerUp={handleSeekCommit}
            onPointerCancel={handleSeekCommit}
            onKeyUp={handleSeekCommit}
            onBlur={handleSeekCommit}
          />
          <span className="native-audio-controls__time" dir="ltr">
            {formatTime(displayedPosition)} / {formatTime(duration)}
          </span>
        </div>
        <div className="native-audio-controls__actions">
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
          <Link className="native-audio-controls__save" to="/quran/downloads">
            <FontAwesomeIcon icon={faFolderOpen} aria-hidden="true" />
            التلاوات المحفوظة
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AndroidQuranAudioPlayer;
