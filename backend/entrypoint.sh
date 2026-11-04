#!/bin/sh
set -e

echo "⏳ Aguardando o Postgres aceitar conexões..."
# Como o compose já tem healthcheck, o depends_on: healthy já garante isso.
# Mas o sleep é uma rede de segurança extra.
sleep 2

echo "🔄 Aplicando migrations..."
python manage.py migrate --noinput

echo "📦 Coletando arquivos estáticos..."
python manage.py collectstatic --noinput

echo "🌱 Populando banco com seed (idempotente)..."
python manage.py seed_articles || true

echo "🚀 Iniciando Gunicorn..."
exec gunicorn core.wsgi:application \
    --config gunicorn.conf.py \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --access-logfile - \
    --error-logfile -