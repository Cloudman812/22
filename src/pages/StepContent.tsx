import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import type { StepDoc } from "../content/types";
import styles from "./StepContent.module.css";

const giftIcon = (
  <svg
    viewBox="0 0 24 24"
    width={16}
    height={16}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden
  >
    <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
    <path d="M4 8h16a2 2 0 0 1 2 2v2H2v-2a2 2 0 0 1 2-2z" />
    <path d="M12 8V4a2 2 0 1 1 4 0v4" />
    <path d="M12 8V6a2 2 0 1 0-4 0v2" />
  </svg>
);

type Mode = "active" | "replay";

type Props = {
  stepNumber: number;
  doc: StepDoc;
  mode: Mode;
  onComplete: () => void;
};

export function StepContent({ stepNumber, doc, mode, onComplete }: Props) {
  if (doc.kind === "finale") {
    return (
      <FinaleView doc={doc} mode={mode} onComplete={onComplete} />
    );
  }
  if (doc.kind === "gift") {
    return (
      <GiftView
        stepNumber={stepNumber}
        doc={doc}
        mode={mode}
        onComplete={onComplete}
      />
    );
  }
  return (
    <MomentView
      stepNumber={stepNumber}
      doc={doc}
      mode={mode}
      onComplete={onComplete}
    />
  );
}

function MomentView({
  stepNumber,
  doc,
  mode,
  onComplete,
}: {
  stepNumber: number;
  doc: Extract<StepDoc, { kind: "moment" }>;
  mode: Mode;
  onComplete: () => void;
}) {
  const m0 = doc.media?.[0];

  return (
    <article className={`l-glass ${styles.card}`}>
      {m0?.type === "video" ? (
        <video
          className={styles.video}
          controls
          playsInline
          poster={m0.poster}
          src={m0.src}
          aria-label={m0.alt ?? ""}
        />
      ) : m0?.type === "image" ? (
        <div
          className={styles.visual}
          style={{
            backgroundImage: `url(${m0.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          role="img"
          aria-label={m0.alt ?? ""}
        />
      ) : (
        <div className={styles.visualPlaceholder} aria-hidden />
      )}
      <div className={styles.body}>
        <div className={styles.rowPill}>
          <span className="l-pill">Шаг {String(stepNumber).padStart(2, "0")}</span>
          {mode === "replay" ? <span className={styles.replay}>Повтор</span> : null}
        </div>
        <h2 className={styles.momentTitle}>{doc.title}</h2>
        <div className="l-bodyMd">
          <ReactMarkdown>{doc.bodyMd}</ReactMarkdown>
        </div>
        {renderCta(mode, onComplete)}
      </div>
    </article>
  );
}

function GiftView({
  stepNumber,
  doc,
  mode,
  onComplete,
}: {
  stepNumber: number;
  doc: Extract<StepDoc, { kind: "gift" }>;
  mode: Mode;
  onComplete: () => void;
}) {
  const [revealed, setRevealed] = useState(() => mode === "replay");

  return (
    <article className={`l-glass ${styles.cardFlat}`}>
      <div className={styles.body}>
        <div className={styles.rowPill}>
          <span className={`${styles.giftBadge}`}>
            {giftIcon}
            Подарок · шаг {String(stepNumber).padStart(2, "0")}
          </span>
          {mode === "replay" ? <span className={styles.replay}>Повтор</span> : null}
        </div>
        {doc.title ? <h2 className={styles.momentTitle}>{doc.title}</h2> : null}
        {doc.bodyMd ? (
          <div className={`l-bodyMd ${styles.mb}`}>
            <ReactMarkdown>{doc.bodyMd}</ReactMarkdown>
          </div>
        ) : null}
        <p className={styles.poetic}>{doc.gift.hintPoetic}</p>
        {!revealed ? (
          <button
            type="button"
            className="l-btn l-btnGhost"
            onClick={() => setRevealed(true)}
          >
            Нужна точность?
          </button>
        ) : (
          <div className={styles.revealBlock}>
            <p className={styles.concrete}>{doc.gift.hintConcrete}</p>
            {doc.gift.placePhoto ? (
              <img
                className={styles.placePhoto}
                src={doc.gift.placePhoto}
                alt=""
              />
            ) : null}
          </div>
        )}
        {revealed ? renderCta(mode, onComplete) : null}
      </div>
    </article>
  );
}

function FinaleView({
  doc,
  mode,
  onComplete,
}: {
  doc: Extract<StepDoc, { kind: "finale" }>;
  mode: Mode;
  onComplete: () => void;
}) {
  const [slide, setSlide] = useState(0);
  const totalSlides = doc.credits.length;

  if (slide < totalSlides) {
    return (
      <article className={`l-glass ${styles.finale}`}>
        <p className={styles.finaleEyebrow}>Финал</p>
        <p className={styles.creditLine}>{doc.credits[slide]}</p>
        <button
          type="button"
          className="l-btn l-btnPrimary"
          onClick={() => setSlide((s) => s + 1)}
        >
          Дальше
        </button>
      </article>
    );
  }

  return (
    <article className={`l-glass ${styles.finale}`}>
      <div className={styles.divider} aria-hidden />
      <div className={`l-bodyMd ${styles.centerMd}`}>
        <ReactMarkdown>{doc.codaMd}</ReactMarkdown>
      </div>
      {doc.finaleMedia ? (
        <img
          className={styles.finaleImg}
          src={doc.finaleMedia.src}
          alt={doc.finaleMedia.alt ?? ""}
        />
      ) : null}
      <p className={styles.physical}>{doc.physicalHint}</p>
      {renderCta(mode, onComplete)}
      {mode === "replay" ? (
        <p className={styles.replayNote}>Маршрут уже завершён — можно просто читать.</p>
      ) : null}
      <div className={styles.backLink}>
        <Link to="/intro">К началу</Link>
      </div>
    </article>
  );
}

function renderCta(mode: Mode, onComplete: () => void) {
  if (mode === "replay") {
    return (
      <p className={styles.replayNote} style={{ marginTop: "1rem" }}>
        Этот шаг уже отмечен в цепочке.
      </p>
    );
  }
  return (
    <div className={`l-btnRow ${styles.cta}`}>
      <button type="button" className="l-btn l-btnPrimary" onClick={onComplete}>
        Дальше
      </button>
    </div>
  );
}
