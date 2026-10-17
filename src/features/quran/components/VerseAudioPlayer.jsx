import {
  faBackwardStep,
  faForwardStep,
  faHeadphones,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useRef, useState } from "react";
import SourceBadge from "../../../components/ui/SourceBadge";
import { VERSE_AUDIO_SOURCE } from "../api/verseAudioApi";
import useVerseAudioTracks from "../hooks/useVerseAudioTracks";

const VerseAudioPlayer = ({
  surahId,
  fromAyah,
  toAyah = fromAyah,
  title = "استمع للآيات",
}) => {
  const audioRef = useRef(null);
  const shouldContinueRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackError, setPlaybackError] = useState("");
  const { status, tracks, retry } = useVerseAudioTracks({
    surahId,
    fromAyah,
    toAyah,
  });
  const trackSignature = useMemo(
    () => tracks.map(({ id }) => id).join(","),
    [tracks]
  );
  const currentTrack = tracks[currentIndex];

  useEffect(() => {
    shouldContinueRef.current = false;
    setCurrentIndex(0);
    setPlaybackError("");
  }, [trackSignature]);

  useEffect(() => {
    if (!shouldContinueRef.current || !currentTrack) return;

    shouldContinueRef.current = false;
    audioRef.current?.play().catch(() => {
      setPlaybackError("اضغط تشغيل لمتابعة التلاوة من هذه الآية.");
    });
  }, [currentIndex, currentTrack]);

  const changeTrack = (nextIndex) => {
    const audio = audioRef.current;
    shouldContinueRef.current = Boolean(audio && !audio.paused && !audio.ended);
    setPlaybackError("");
    setCurrentIndex(nextIndex);
  };

  const handleEnded = () => {
    if (currentIndex >= tracks.length - 1) {
      shouldContinueRef.current = false;
      return;
    }

    shouldContinueRef.current = true;
    setCurrentIndex((index) => index + 1);
  };

  return (
    <section className="verse-audio-player" aria-label={title}>
      <div className="verse-audio-player__heading">
        <div>
          <FontAwesomeIcon icon={faHeadphones} aria-hidden="true" />
          <strong>{title}</strong>
        </div>
        <SourceBadge>{VERSE_AUDIO_SOURCE.label}</SourceBadge>
      </div>

      {status === "loading" && (
        <p className="verse-audio-player__message" role="status">
          جاري تجهيز تلاوة الآيات...
        </p>
      )}

      {status === "error" && (
        <div className="verse-audio-player__message" role="alert">
          <span>تعذّر تحميل تلاوة الآيات.</span>
          <button type="button" className="inline-action" onClick={retry}>
            إعادة المحاولة
          </button>
        </div>
      )}

      {status === "empty" && (
        <p className="verse-audio-player__message">
          لا توجد تلاوة متاحة لهذا المقطع.
        </p>
      )}

      {status === "success" && currentTrack && (
        <>
          <div className="verse-audio-player__now-playing" aria-live="polite">
            <span>
              الآية {currentTrack.ayahNumber.toLocaleString("ar-EG")}
            </span>
            {tracks.length > 1 && (
              <small>
                {`${(currentIndex + 1).toLocaleString("ar-EG")} من ${tracks.length.toLocaleString("ar-EG")}`}
              </small>
            )}
          </div>
          <div className="verse-audio-player__controls">
            <button
              type="button"
              disabled={currentIndex === 0}
              aria-label="الآية السابقة"
              onClick={() => changeTrack(currentIndex - 1)}
            >
              <FontAwesomeIcon icon={faBackwardStep} aria-hidden="true" />
            </button>
            <audio
              ref={audioRef}
              key={currentTrack.id}
              controls
              preload="metadata"
              src={currentTrack.audioUrl}
              onEnded={handleEnded}
              onPlaying={() => setPlaybackError("")}
              onError={() =>
                setPlaybackError(
                  "تعذّر تشغيل هذه الآية. تحقق من الاتصال ثم حاول مرة أخرى."
                )
              }
            />
            <button
              type="button"
              disabled={currentIndex === tracks.length - 1}
              aria-label="الآية التالية"
              onClick={() => changeTrack(currentIndex + 1)}
            >
              <FontAwesomeIcon icon={faForwardStep} aria-hidden="true" />
            </button>
          </div>
          {playbackError && (
            <p className="verse-audio-player__error" role="alert">
              {playbackError}
            </p>
          )}
        </>
      )}
    </section>
  );
};

export default VerseAudioPlayer;
