#!/usr/bin/env bash
# Test rapide : compile, démarre l'app sur une base jetable et vérifie que chaque page répond 200.
#   bash scripts/smoke.sh
set -euo pipefail
cd "$(dirname "$0")/.."
PORT=3199
DB="$(mktemp -d)/smoke.db"
npm run build --silent >/dev/null
TZ=Europe/Paris PORT=$PORT ORIGIN=http://localhost:$PORT DATABASE_PATH="$DB" APP_PASSWORD= \
	node --disable-warning=ExperimentalWarning build/index.js >/tmp/ccna-smoke.log 2>&1 &
PID=$!
trap 'kill $PID 2>/dev/null' EXIT
for i in $(seq 1 30); do curl -sf -o /dev/null "http://localhost:$PORT/login" && break; sleep 0.5; done
FAIL=0
for p in / /planning /calendrier /videos /flashcards /flashcards/reviser /flashcards/cartes /qcm /subnetting /themes /stats /login; do
	code=$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$PORT$p")
	printf '%s %s\n' "$code" "$p"
	[ "$code" = 200 ] || FAIL=1
done
J='content-type: application/json'
O="origin: http://localhost:$PORT"
curl -sf -X POST "http://localhost:$PORT/api/review" -H "$J" -H "$O" -d '{"cardId":1,"rating":3,"ms":1000}' >/dev/null || FAIL=1
curl -sf -X POST "http://localhost:$PORT/api/topics" -H "$J" -H "$O" -d '{"code":"1.6","status":1}' >/dev/null || FAIL=1
curl -sf -X POST "http://localhost:$PORT/api/plan" -H "$J" -H "$O" -d '{"op":"task","week":0,"idx":0,"on":true}' >/dev/null || FAIL=1
[ $FAIL = 0 ] && echo "✔ smoke OK" || { echo "✘ smoke KO (voir /tmp/ccna-smoke.log)"; exit 1; }
