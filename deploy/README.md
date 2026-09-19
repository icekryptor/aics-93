# Сайт AICS-93 на своём VPS (Timeweb)

Прод живёт на `aics-93.ru` — контейнер `aics93-web` за общим Caddy того же
сервера, где работают Supabase, ERP/learn Химички и NoBS. Схема повторяет
соседний `nobs-tech.ru`, чтобы не плодить сущностей.

```
aics-93.ru → supabase-caddy (80/443, TLS сам)
               └→ aics93-web:3000 (Next.js standalone)
```

- Сервер: `root@201.34.149.163`, код — `/opt/aics93/app` (клон этого репо).
- Секреты: `/opt/aics93/app/deploy/app.env` (образец — `app.env.example`,
  в гит не коммитится): два TG-бота, `PANEL_PASSWORD`, опционально
  `GITHUB_TOKEN` для пуша конфига мозга со стенда `/panel/hero`.
- Общий Caddyfile: `/opt/supabase-src/docker/volumes/proxy/caddy/Caddyfile`,
  наш блок — копия `deploy/caddy-block.aics-93.ru`.

## Деплой

```bash
ssh root@201.34.149.163
cd /opt/aics93/app && bash deploy/deploy.sh
```

Скрипт делает `git reset --hard origin/main`, пересобирает образ, поднимает
контейнер и ждёт ответа `/robots.txt` (до 90 с). Локальные правки на сервере
затираются — источник истины только `main`.

## Грабли

- **`caddy reload` на этом сервере не работает.** В блоке Supabase Studio
  пароль `basic_auth` хешируется командой запуска контейнера, а при ручном
  reload подставляется сырое значение из env — конфиг не проходит валидацию.
  Применять конфиг только через `docker compose restart caddy` из
  `/opt/supabase-src/docker` (простой ~8 с на все сайты сервера).
- Перед правкой общего Caddyfile делать бэкап: `cp -a Caddyfile Caddyfile.bak-$(date +%F-%H%M)`.
- `www.aics-93.ru` из блока убран — записи в DNS нет, ACME копил отказы.
  Появится CNAME `www` → вернуть хост в блок.
- Сертификат Let's Encrypt выпустится автоматически, как только `aics-93.ru`
  начнёт резолвиться на этот сервер (домен зарегистрирован 19.09.2026).
