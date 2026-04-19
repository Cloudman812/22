import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import intro from "../content/intro.json";
import type { IntroContent } from "../content/types";
import { QrScanModal } from "../components/QrScanModal";
import { requestCameraStream } from "../lib/requestCameraStream";
import { useQuest } from "../state/QuestContext";
import styles from "./IntroPage.module.css";

const content = intro as IntroContent;

/** Фоновое видео: `public/media/intro/hero.mov` (в репозитории — сжатая копия под GitHub). */
const INTRO_HERO_VIDEO = `${import.meta.env.BASE_URL}media/intro/hero.mov`;

function PlayIcon() {
  return (
    <svg
      className={styles.playIcon}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M9 6.5v11l9-5.5-9-5.5z" />
    </svg>
  );
}

export function IntroPage() {
  const navigate = useNavigate();
  const { completeIntro, markIntroVideoSeen } = useQuest();
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const [showPlayOverlay, setShowPlayOverlay] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [playbackEnded, setPlaybackEnded] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerStream, setScannerStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const releaseCamera = useCallback(() => {
    cameraStreamRef.current?.getTracks().forEach((t) => t.stop());
    cameraStreamRef.current = null;
    setScannerStream(null);
  }, []);

  useEffect(() => {
    return () => {
      cameraStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handlePlay = useCallback(() => {
    setShowPlayOverlay(false);
    setShowControls(true);
  }, []);

  const handlePause = useCallback(() => {
    if (playbackEnded) return;
    setShowPlayOverlay(true);
  }, [playbackEnded]);

  const handlePlayClick = useCallback(() => {
    void videoRef.current?.play();
  }, []);

  const handleVideoEnded = useCallback(() => {
    markIntroVideoSeen();
    setPlaybackEnded(true);
    setShowPlayOverlay(false);
  }, [markIntroVideoSeen]);

  const openScanner = useCallback(async () => {
    completeIntro();
    setCameraError(null);

    const result = await requestCameraStream();
    if (!result.ok) {
      setCameraError(result.message);
      return;
    }

    cameraStreamRef.current = result.stream;
    setScannerStream(result.stream);
    setScannerOpen(true);
  }, [completeIntro]);

  const handleQrDecoded = useCallback(
    (path: string) => {
      setScannerOpen(false);
      releaseCamera();
      navigate(path);
    },
    [navigate, releaseCamera],
  );

  const closeScanner = useCallback(() => {
    setScannerOpen(false);
    releaseCamera();
  }, [releaseCamera]);

  const showPlayOverlayUi = showPlayOverlay && !playbackEnded;

  return (
    <>
      <article
        className="l-glass"
        style={{ padding: "1.55rem 1.45rem 1.5rem", marginBottom: "1.1rem" }}
      >
        <p className="l-eyebrow">{content.eyebrow}</p>
        <h1 className="l-displayTitle">{content.title}</h1>
        <div className="l-bodyMd">
          <ReactMarkdown>{content.leadMd}</ReactMarkdown>
        </div>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0 0 1.25rem",
          }}
        >
          {content.bullets.map((line) => (
            <li
              key={line}
              style={{
                position: "relative",
                paddingLeft: "1.15rem",
                fontSize: "0.86rem",
                lineHeight: 1.5,
                color: "rgba(28, 29, 38, 0.72)",
                marginBottom: "0.5rem",
              }}
            >
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  left: 0,
                  top: "0.48em",
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(145deg, var(--lum-accent), #9b8cff)",
                  boxShadow: "0 0 0 4px rgba(91, 75, 219, 0.12)",
                }}
              />
              {line}
            </li>
          ))}
        </ul>
        {content.footnoteMd ? (
          <div className="l-footnote">
            <ReactMarkdown>{content.footnoteMd}</ReactMarkdown>
          </div>
        ) : null}
      </article>

      <div className={styles.heroStage}>
        <div className={styles.celebration} aria-hidden>
          <span className={styles.spark} style={{ left: "8%", animationDelay: "0s" }} />
          <span className={styles.spark} style={{ left: "22%", animationDelay: "1.1s" }} />
          <span className={styles.spark} style={{ left: "38%", animationDelay: "2.3s" }} />
          <span className={styles.spark} style={{ left: "55%", animationDelay: "0.6s" }} />
          <span className={styles.spark} style={{ left: "72%", animationDelay: "1.8s" }} />
          <span className={styles.spark} style={{ left: "88%", animationDelay: "3s" }} />
          <span className={`${styles.lantern} ${styles.lanternA}`} />
          <span className={`${styles.lantern} ${styles.lanternB}`} />
          <span className={`${styles.lantern} ${styles.lanternC}`} />
          <span className={`${styles.lantern} ${styles.lanternD}`} />
          <span className={`${styles.balloon} ${styles.balloonA}`} />
          <span className={`${styles.balloon} ${styles.balloonB}`} />
          <span className={`${styles.balloon} ${styles.balloonC}`} />
        </div>

        <div className={styles.heroColumn}>
          <div className={styles.hero}>
            <div className={styles.videoSlot}>
              <video
                ref={videoRef}
                className={styles.video}
                src={INTRO_HERO_VIDEO}
                controls={showControls}
                playsInline
                preload="metadata"
                aria-label="Видео к вводному экрану"
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleVideoEnded}
              />
              {showPlayOverlayUi ? (
                <div className={styles.playOverlay}>
                  <button
                    type="button"
                    className={`l-btn l-btnPrimary ${styles.playBtn}`}
                    onClick={handlePlayClick}
                    aria-label="Воспроизвести видео"
                  >
                    <PlayIcon />
                    Смотреть
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {playbackEnded ? (
        <div className={styles.postVideoCta}>
          <button type="button" className="l-btn l-btnPrimary" onClick={() => void openScanner()}>
            {content.primaryCta}
          </button>
          {cameraError ? (
            <p className={styles.cameraError} role="alert">
              {cameraError}
            </p>
          ) : null}
        </div>
      ) : null}

      <QrScanModal
        open={scannerOpen}
        cameraStream={scannerStream}
        onClose={closeScanner}
        onDecoded={handleQrDecoded}
      />
    </>
  );
}
