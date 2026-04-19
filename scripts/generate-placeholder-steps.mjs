import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "../src/content/steps");
fs.mkdirSync(dir, { recursive: true });

const gifts = new Set([7, 14, 21]);

for (let n = 1; n <= 21; n++) {
  const pad = String(n).padStart(2, "0");
  let doc;
  if (gifts.has(n)) {
    doc = {
      kind: "gift",
      title: `Подарок · шаг ${n}`,
      gift: {
        hintPoetic:
          "Там, где утро чувствуется чуть ближе к чуду, чем к суете…",
        hintConcrete:
          "Загляни на подоконник у дивана — там маленькая коробочка с ленточкой.",
        placePhoto: null,
      },
    };
  } else {
    doc = {
      kind: "moment",
      title: `Коротко о тебе · шаг ${n}`,
      bodyMd:
        n % 3 === 1
          ? "Ты умеешь делать обычные минуты **чуть светлее**. Спасибо за это миру — и мне."
          : n % 3 === 2
            ? "Помню твой смех — он как будто ломает скучное время на маленькие искры."
            : "Рядом с тобой хочется быть чуть добрее. Это редкий дар.",
    };
  }
  fs.writeFileSync(path.join(dir, `${pad}.json`), JSON.stringify(doc, null, 2), "utf8");
}

const finale = {
  kind: "finale",
  finale: true,
  credits: [
    "Спасибо, что прошла этот маршрут.",
    "Ты — самая красивая часть этих двадцати двух точек.",
    "Если бы можно было упаковать утро в подарок — я бы выбрал это снова.",
  ],
  codaMd:
    "И кстати… есть ещё одна «точка», которую не закрывает экран — только руки.",
  physicalHint:
    "Загляни в коробку на столе у входа — там финальный сюрприз, который хочется передать не через ссылку.",
};

fs.writeFileSync(path.join(dir, "22.json"), JSON.stringify(finale, null, 2), "utf8");
console.log("written steps 01–22");
