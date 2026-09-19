#!/usr/bin/env bash
# Деплой сайта AICS-93 на свой VPS: git pull → сборка образа → перезапуск.
# Запускать на сервере: cd /opt/aics93/app && bash deploy/deploy.sh
set -euo pipefail

cd "$(dirname "$0")/.."
APP_DIR="$(pwd)"
COMPOSE="docker compose -f deploy/docker-compose.yml"

echo "==> Обновляю код ($APP_DIR)"
git fetch --prune origin
git reset --hard origin/main

if [ ! -f deploy/app.env ]; then
  echo "!! Нет deploy/app.env — скопируйте app.env.example и заполните секреты" >&2
  exit 1
fi

echo "==> Собираю образ"
$COMPOSE build

echo "==> Перезапускаю контейнер"
$COMPOSE up -d

echo "==> Жду готовности (до 90 с)"
for i in $(seq 1 30); do
  if docker exec aics93-web node -e "fetch('http://127.0.0.1:3000/robots.txt').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" 2>/dev/null; then
    echo "==> Готово: контейнер отвечает"
    docker image prune -f >/dev/null 2>&1 || true
    exit 0
  fi
  sleep 3
done

echo "!! Контейнер не ответил за 90 с — смотрите: docker logs aics93-web --tail 50" >&2
exit 1
