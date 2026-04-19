#!/usr/bin/env bash
# Генерирует доверенные для Mac сертификаты (mkcert) для localhost + текущего IPv4 Wi‑Fi.
# После установки CA на iPhone Safari открывает https://IP:5173 без «подключение не защищено».
set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v mkcert >/dev/null 2>&1; then
  echo "Установи mkcert:  brew install mkcert && mkcert -install"
  exit 1
fi

mkdir -p certs

LAN_IP="${LAN_IP:-}"
if [[ -z "$LAN_IP" ]]; then
  LAN_IP=$(ipconfig getifaddr en0 2>/dev/null || true)
fi
if [[ -z "$LAN_IP" ]]; then
  LAN_IP=$(ipconfig getifaddr en1 2>/dev/null || true)
fi
if [[ -z "$LAN_IP" ]]; then
  echo "Не удалось определить IPv4 (en0/en1). Задай вручную: LAN_IP=192.168.x.x $0"
  exit 1
fi

mkcert -cert-file certs/dev.pem -key-file certs/dev-key.pem \
  localhost 127.0.0.1 ::1 "$LAN_IP"

echo ""
echo "Готово: certs/dev.pem + certs/dev-key.pem (в т.ч. для $LAN_IP)"
echo ""
echo "На iPhone один раз установи корневой сертификат mkcert:"
echo "  На Mac: открой $(mkcert -CAROOT), отправь rootCA.pem на iPhone (AirDrop / почта),"
echo "  на телефоне открой файл → Профиль загружен → Установить → Доверие → включи для корневого CA."
echo ""
echo "Потом открой в Safari: https://${LAN_IP}:5173"
