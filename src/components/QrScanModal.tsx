import QrScanner from "qr-scanner";
import qrScannerWorkerUrl from "qr-scanner/qr-scanner-worker.min.js?url";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { parseQuestQrToPath } from "../lib/parseQuestQr";
import styles from "./QrScanModal.module.css";

QrScanner.WORKER_PATH = qrScannerWorkerUrl;

type Props = {
  open: boolean;
  /** Поток с камеры: должен быть получен в том же обработчике клика, что и открытие модалки (Safari / iOS). */
  cameraStream: MediaStream | null;
  onClose: () => void;
  onDecoded: (path: string) => void;
};

export function QrScanModal({ open, cameraStream, onClose, onDecoded }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDecoded = useCallback(
    (raw: string) => {
      const path = parseQuestQrToPath(raw);
      if (!path) {
        setError("Это не похоже на код квеста. Нужна ссылка вида шага или вводная страница.");
        return;
      }
      scannerRef.current?.destroy();
      scannerRef.current = null;
      setError(null);
      onDecoded(path);
    },
    [onDecoded],
  );

  useLayoutEffect(() => {
    if (!open || !cameraStream || !videoRef.current) return;

    setError(null);

    const video = videoRef.current;
    video.srcObject = cameraStream;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const scanner = new QrScanner(
      video,
      (result: string | QrScanner.ScanResult) => {
        const raw = typeof result === "string" ? result : result.data;
        handleDecoded(raw);
      },
      {
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        maxScansPerSecond: 8,
        onDecodeError: () => {},
      },
    );

    scannerRef.current = scanner;

    scanner.start().catch(() => {
      setError(
        "Не удалось запустить сканер. Если камера уже разрешена — закрой окно и открой снова.",
      );
    });

    return () => {
      scanner.destroy();
      scannerRef.current = null;
      video.srcObject = null;
    };
  }, [open, cameraStream, handleDecoded]);

  if (!open || !cameraStream) return null;

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby="qr-scan-title">
      <div className={styles.panel}>
        <div className={styles.head}>
          <h2 id="qr-scan-title" className={styles.title}>
            Сканирование
          </h2>
          <p className={styles.sub}>
            Поднеси камеру к маленькому QR квеста на стене. После считывания откроется нужная страница — как при
            обычном переходе по ссылке.
          </p>
        </div>
        <div className={styles.videoWrap}>
          <video ref={videoRef} className={styles.preview} muted playsInline />
        </div>
        {error ? (
          <p className={styles.err} role="alert">
            {error}
          </p>
        ) : null}
        <div className={styles.actions}>
          <button type="button" className="l-btn l-btnGhost" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
