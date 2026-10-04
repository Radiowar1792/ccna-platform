#!/usr/bin/env bash
# À lancer DANS LE LXC (root). Installe ou met à jour la plateforme.
#   bash install.sh <dossier-source>
set -euo pipefail

SRC="${1:-$(cd "$(dirname "$0")/.." && pwd)}"
APP=/opt/ccna-platform
DATA=/var/lib/ccna-platform
ENVF=/etc/ccna-platform.env
NODE_MAJOR=24

export DEBIAN_FRONTEND=noninteractive

if ! command -v node >/dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 22 ]; then
	echo "==> Installation de Node.js $NODE_MAJOR (NodeSource)"
	apt-get update -qq
	apt-get install -y -qq curl ca-certificates gnupg sqlite3 >/dev/null
	curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash - >/dev/null
	apt-get install -y -qq nodejs >/dev/null
fi
command -v sqlite3 >/dev/null || apt-get install -y -qq sqlite3 >/dev/null

id ccna >/dev/null 2>&1 || useradd --system --home "$DATA" --shell /usr/sbin/nologin ccna
mkdir -p "$APP" "$DATA" /var/backups/ccna-platform

echo "==> Copie du code"
# rsync n'est pas toujours présent : on remplace le code, jamais les données.
find "$APP" -mindepth 1 -maxdepth 1 ! -name node_modules -exec rm -rf {} +
cp -a "$SRC"/. "$APP"/
rm -rf "$APP/data" "$APP/.git"

echo "==> Dépendances et build"
cd "$APP"
npm ci --no-audit --no-fund --loglevel=error
npm run build --silent
npm prune --omit=dev --no-audit --no-fund --loglevel=error

if [ ! -f "$ENVF" ]; then
	echo "==> Création de $ENVF"
	IP="$(hostname -I | awk '{print $1}')"
	# (pas de "tr </dev/urandom | head" : avec pipefail, le SIGPIPE arrête le script)
	PASS="$(node -e "process.stdout.write(require('crypto').randomBytes(12).toString('base64url'))")"
	SECRET="$(node -e "process.stdout.write(require('crypto').randomBytes(32).toString('hex'))")"
	cat > "$ENVF" <<CONF
PORT=3000
HOST=0.0.0.0
ORIGIN=http://$IP:3000
APP_PASSWORD=$PASS
SESSION_SECRET=$SECRET
DATABASE_PATH=$DATA/ccna.db
TZ=Europe/Paris
# Clé facultative YouTube Data API v3 (synchronisation complète de la playlist)
YOUTUBE_API_KEY=
CONF
	chmod 600 "$ENVF"
	echo "   Mot de passe de connexion : $PASS"
fi

chown -R ccna:ccna "$DATA" /var/backups/ccna-platform
cp "$APP/deploy/ccna-platform.service" /etc/systemd/system/
cp "$APP/deploy/ccna-backup.service" "$APP/deploy/ccna-backup.timer" /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now ccna-platform.service ccna-backup.timer
systemctl restart ccna-platform.service
sleep 2
systemctl --no-pager --lines=5 status ccna-platform.service || true
echo "==> OK"
