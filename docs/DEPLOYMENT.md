# Деплой (основной сценарий)

Проект рассчитан на **статическую раздачу по HTTPS** — так Safari на iPhone даёт доступ к камере для сканера QR.

## GitHub Pages

Репозиторий: **`Cloudman812/22`** → сайт: **`https://cloudman812.github.io/22/`**

1. В репозитории GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Пуш в ветку **`main`** запускает workflow **Deploy to GitHub Pages** (`.github/workflows/deploy-pages.yml`): сборка `npm run build`, публикация папки `dist`.
3. Через 1–2 минуты приложение доступно по URL выше. Для тестов на iPhone используй **именно этот https-адрес** (камера работает).

Пути в приложении учитывают подпапку репозитория (`base: /22/` в Vite).

## Видео на вводном экране

Файл **`public/media/intro/hero.mov`** (имя фиксировано) не хранится в git из‑за размера. Скопируй свой ролик локально:

```bash
cp future-content/IMG_1080.MOV public/media/intro/hero.mov
```

Затем коммить только если размер позволяет политике GitHub; иначе держи видео только локально и для продакшена загружай отдельным коммитом или через релиз-артефакт.

## Локальная разработка

- **`npm run dev`** — `https://localhost:5173/22/…` (HTTPS через встроенный плагин или mkcert в `certs/`).
- Опционально **`npm run preview`** после `npm run build` — проверка прод-сборки.

## Дополнительно

Краткий сценарий превью без облака (раздача `dist` в LAN): см. [`SERVER_LOCAL_MAC.md`](./SERVER_LOCAL_MAC.md) — **не** основной путь, только при необходимости.
