# Блок для общего Caddy на VPS:
#   /opt/supabase-src/docker/volumes/proxy/caddy/Caddyfile
# Применение (из /opt/supabase-src/docker):
#   docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile
aics-93.ru {
    encode zstd gzip

    reverse_proxy aics93-web:3000 {
        header_up X-Real-IP {remote_host}
    }

    # Иммутабельные ассеты Next.js — год в кэше браузера
    @next_static path /_next/static/*
    header @next_static Cache-Control "public, max-age=31536000, immutable"

    header -server
}
