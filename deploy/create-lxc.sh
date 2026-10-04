#!/usr/bin/env bash
# À lancer SUR LE NŒUD PROXMOX (shell root). Crée un LXC Debian 13 non privilégié et installe la plateforme.
#
# Directement depuis GitHub (le plus simple) :
#   bash -c "$(curl -fsSL https://raw.githubusercontent.com/Radiowar1792/ccna-platform/main/deploy/create-lxc.sh)"
#
# Ou depuis une copie locale du projet :
#   bash deploy/create-lxc.sh [CTID] [STOCKAGE] [BRIDGE]      ex. : bash deploy/create-lxc.sh 120 local-lvm vmbr0
#
# Variables facultatives : CT_IP=192.168.1.50/24 CT_GW=192.168.1.1 (sinon DHCP)
set -euo pipefail

CTID="${1:-$(pvesh get /cluster/nextid)}"
STORAGE="${2:-local-lvm}"
BRIDGE="${3:-vmbr0}"
HOSTNAME_CT="ccna"
TEMPLATE_STORE="local"
RAW="https://raw.githubusercontent.com/Radiowar1792/ccna-platform/main"
# Copie locale si le script est lancé depuis le projet, sinon installation depuis GitHub.
PROJECT_DIR=""
if [ -f "${BASH_SOURCE[0]:-}" ] && [ -f "$(dirname "${BASH_SOURCE[0]}")/../package.json" ]; then
	PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
fi

command -v pct >/dev/null || { echo "Ce script doit tourner sur un nœud Proxmox VE."; exit 1; }

echo "==> Recherche du template Debian 13 (repli sur Debian 12)"
pveam update >/dev/null || true
TPL="$(pveam available --section system | awk '/debian-13-standard/ {print $2}' | sort -V | tail -1)"
[ -z "$TPL" ] && TPL="$(pveam available --section system | awk '/debian-12-standard/ {print $2}' | sort -V | tail -1)"
[ -z "$TPL" ] && { echo "Aucun template Debian trouvé."; exit 1; }
if ! pveam list "$TEMPLATE_STORE" | grep -q "$TPL"; then
	echo "==> Téléchargement de $TPL"
	pveam download "$TEMPLATE_STORE" "$TPL"
fi

if [ -n "${CT_IP:-}" ]; then NET="name=eth0,bridge=$BRIDGE,ip=$CT_IP,gw=${CT_GW:?CT_GW requis avec CT_IP}"; else NET="name=eth0,bridge=$BRIDGE,ip=dhcp"; fi

echo "==> Création du conteneur $CTID ($TPL)"
pct create "$CTID" "$TEMPLATE_STORE:vztmpl/$TPL" \
	--hostname "$HOSTNAME_CT" \
	--cores 1 --memory 1024 --swap 512 \
	--rootfs "$STORAGE:8" \
	--net0 "$NET" \
	--unprivileged 1 --features nesting=1 \
	--onboot 1 --timezone Europe/Paris \
	--description "Plateforme de révision CCNA (SvelteKit + SQLite)"

pct start "$CTID"
echo "==> Attente du réseau"
for i in $(seq 1 30); do
	pct exec "$CTID" -- bash -c 'getent hosts deb.debian.org >/dev/null' && break
	sleep 2
done

if [ -n "$PROJECT_DIR" ]; then
	echo "==> Copie du projet local"
	TMP="$(mktemp -d)"
	tar --exclude=node_modules --exclude=build --exclude=.svelte-kit --exclude=.git --exclude='data/*.db*' --exclude=.env \
		-czf "$TMP/ccna.tar.gz" -C "$PROJECT_DIR" .
	pct push "$CTID" "$TMP/ccna.tar.gz" /tmp/ccna.tar.gz
	rm -rf "$TMP"
	pct exec "$CTID" -- bash -c 'mkdir -p /tmp/ccna-src && tar -xzf /tmp/ccna.tar.gz -C /tmp/ccna-src && bash /tmp/ccna-src/deploy/install.sh /tmp/ccna-src'
else
	echo "==> Installation depuis GitHub"
	pct exec "$CTID" -- bash -c "apt-get update -qq && apt-get install -y -qq curl ca-certificates >/dev/null && curl -fsSL $RAW/deploy/install-lxc.sh | bash"
fi

IP="$(pct exec "$CTID" -- hostname -I | awk '{print $1}')"
echo
echo "✔ Terminé. Ouvre http://$IP:3000"
echo "  Le mot de passe est dans le conteneur : pct exec $CTID -- grep APP_PASSWORD /etc/ccna-platform.env"
