#!/usr/bin/env bash
# Installation / mise à jour DANS LE LXC (Debian 12 ou 13), depuis GitHub.
#
#   bash -c "$(curl -fsSL https://raw.githubusercontent.com/Radiowar1792/ccna-platform/main/deploy/install-lxc.sh)"
#
# Relancer la même commande met à jour l'application (les données sont conservées).
# Variables facultatives : REPO_URL, BRANCH
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/Radiowar1792/ccna-platform.git}"
BRANCH="${BRANCH:-main}"
SRC=/opt/ccna-src

[ "$(id -u)" -eq 0 ] || { echo "Lance ce script en root."; exit 1; }
export DEBIAN_FRONTEND=noninteractive

echo "==> Paquets de base"
apt-get update -qq
apt-get install -y -qq git curl ca-certificates >/dev/null

if [ -d "$SRC/.git" ]; then
	echo "==> Mise à jour du code ($BRANCH)"
	git -C "$SRC" fetch --depth 1 origin "$BRANCH"
	git -C "$SRC" reset --hard "origin/$BRANCH"
else
	echo "==> Téléchargement du code"
	rm -rf "$SRC"
	git clone --depth 1 --branch "$BRANCH" "$REPO_URL" "$SRC"
fi

bash "$SRC/deploy/install.sh" "$SRC"

IP="$(hostname -I | awk '{print $1}')"
echo
echo "✔ Plateforme disponible sur http://$IP:3000"
grep -q '^APP_PASSWORD=' /etc/ccna-platform.env && echo "  Mot de passe : $(grep '^APP_PASSWORD=' /etc/ccna-platform.env | cut -d= -f2-)"
