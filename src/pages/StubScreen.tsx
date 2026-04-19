import ReactMarkdown from "react-markdown";
import styles from "./StubScreen.module.css";

type Props = {
  tag: string;
  title: string;
  bodyMd: string;
};

export function StubScreen({ tag, title, bodyMd }: Props) {
  return (
    <article className={`l-glass ${styles.stub}`}>
      <span className={styles.tag}>{tag}</span>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.body}>
        <ReactMarkdown>{bodyMd}</ReactMarkdown>
      </div>
      <p className={styles.hint}>
        Прогресс вверху помнит маршрут — можно помечать найденные коды стикером,
        если так спокойнее.
      </p>
    </article>
  );
}
