# Contexte pour Claude

Projet perso de Batiste (BTS SIO SISR) : plateforme de révision CCNA 200-301, auto-hébergée dans un LXC Debian 13 sur Proxmox.

- Stack : SvelteKit 2, Svelte 5 (runes : $state, $derived, $props), TypeScript, SQLite via `node:sqlite`, ts-fsrs.
- Tout le texte de l'interface est en français ; les énoncés de QCM et le recto des cartes sont en anglais (comme l'examen).
- Schéma SQL : `src/lib/server/db.ts`. Pour le faire évoluer, AJOUTER une entrée au tableau MIGRATIONS (ne jamais modifier une migration existante).
- Contenu de départ : `src/lib/data/*.ts`, importé avec INSERT OR IGNORE par `seed_key`.
- Pas de dumps d'examen : les questions doivent être originales.
- Vérifier : `npm run check` puis `npm run build`.
- Déploiement : `deploy/update.sh <CTID>` sur le nœud Proxmox.
