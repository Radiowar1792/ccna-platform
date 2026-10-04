#!/usr/bin/env bash
# À lancer SUR LE NŒUD PROXMOX pour pousser une nouvelle version dans le LXC existant.
#   bash deploy/update.sh <CTID>
set -euo pipefail
CTID="${1:?Usage : bash deploy/update.sh <CTID>}"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
tar --exclude=node_modules --exclude=build --exclude=.svelte-kit --exclude=.git --exclude='data/*.db*' --exclude=.env \
	-czf "$TMP/ccna.tar.gz" -C "$PROJECT_DIR" .
pct push "$CTID" "$TMP/ccna.tar.gz" /tmp/ccna.tar.gz
rm -rf "$TMP"
pct exec "$CTID" -- bash -c 'rm -rf /tmp/ccna-src && mkdir -p /tmp/ccna-src && tar -xzf /tmp/ccna.tar.gz -C /tmp/ccna-src && bash /tmp/ccna-src/deploy/install.sh /tmp/ccna-src'
echo "✔ Mise à jour terminée (données conservées)."
