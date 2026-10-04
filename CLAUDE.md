# Contexte pour Claude

Plateforme perso de révision CCNA 200-301 de Batiste (BTS SIO SISR), auto-hébergée dans un LXC Debian 13 sur Proxmox.

**Lis `docs/ARCHITECTURE.md` avant toute modification.** Il contient l'architecture, le schéma de la base, les conventions, le workflow git et l'état actuel du projet.

L'essentiel :
- SvelteKit 2 + Svelte 5 (runes) + TypeScript, SQLite via `node:sqlite`, flashcards avec `ts-fsrs`.
- Interface en français. QCM et recto des cartes en anglais, explications en français. Questions originales uniquement, jamais de dumps.
- SQL uniquement dans `src/lib/server/repo.ts`. Pour changer le schéma, AJOUTE une migration dans `db.ts` sans jamais en modifier une existante.
- Avant de commiter : `npm run check` puis `bash scripts/smoke.sh`.
- Commits au format `feat(scope): description en français`, auteur `Batiste <210405393+Radiowar1792@users.noreply.github.com>`.
- `main` est déployée telle quelle dans le LXC : elle doit toujours fonctionner.
- Après une fonctionnalité, mets à jour `ROADMAP.md` et la section « État actuel » de `docs/ARCHITECTURE.md`.
