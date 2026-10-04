# Objectif CCNA – plateforme perso

Ma plateforme de préparation au **CCNA 200-301 v1.1** : planning sur 39 semaines, calendrier, vidéos de Jeremy's IT Lab intégrées, flashcards avec répétition espacée (FSRS, comme Anki), QCM en anglais avec corrections en français, entraînement au subnetting et statistiques.

## Architecture

Le guide complet pour développer (et pour les agents Claude) est dans [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

| Couche | Choix | Pourquoi |
|---|---|---|
| Application | **SvelteKit 2 + Svelte 5 + TypeScript** | Front et back dans un seul projet, peu de code, rapide |
| Base de données | **SQLite** via `node:sqlite` (intégré à Node) | Un seul fichier, rien à administrer, aucun module natif à compiler |
| Flashcards | **ts-fsrs** | L'algorithme FSRS utilisé par Anki |
| Serveur | **Node 24 LTS** + systemd dans un **LXC Debian 13** non privilégié | Léger : environ 60 Mo de RAM |

```
src/
  lib/
    data/        Contenu : planning, thèmes de l'examen, vidéos, cartes et questions de départ
    server/      Base SQLite (db.ts), requêtes (repo.ts), connexion, synchro YouTube
    components/  Composants réutilisables (semaine, heatmap, graphique…)
  routes/        Une page par dossier (+page.svelte = affichage, +page.server.ts = données)
    api/         Petites routes JSON appelées par les pages
deploy/          Scripts Proxmox (création du LXC, installation, mise à jour, sauvegarde)
```

Le contenu de départ (cartes, questions, vidéos) est importé au démarrage **sans jamais écraser** ce que tu as modifié. Pour ajouter des questions « officielles » à la plateforme, ajoute-les dans `src/lib/data/questions.ts` avec une `key` unique.

## Lancer en local (Mac)

```bash
cd ~/Documents/ccna-platform
cp .env.example .env      # puis mets APP_PASSWORD vide pour ne pas avoir de mot de passe en local
npm install
npm run dev               # http://localhost:5173
```

Node 22.13 ou plus récent est nécessaire (`node -v`).

## Installer sur Proxmox

### Option 1 : tout automatique (sur le nœud Proxmox)

Dans le shell root du nœud (interface web → ton nœud → Shell) :

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/Radiowar1792/ccna-platform/main/deploy/create-lxc.sh)"
```

Le script crée le conteneur (prochain ID libre, stockage `local-lvm`, bridge `vmbr0`, IP en DHCP), installe tout, puis affiche l'adresse `http://IP:3000` et le mot de passe.

- Avec une IP fixe : `CT_IP=192.168.1.50/24 CT_GW=192.168.1.1 bash -c "$(curl -fsSL …/create-lxc.sh)"`
- Avec un autre stockage ou un autre bridge : télécharge le script puis lance `bash create-lxc.sh 120 local-zfs vmbr1`

### Option 2 : dans un LXC que tu as déjà créé

Crée un LXC Debian 13 non privilégié (1 vCPU, 1 Go de RAM, 8 Go de disque, option *nesting* cochée), puis dans sa console :

```bash
apt update && apt install -y curl
bash -c "$(curl -fsSL https://raw.githubusercontent.com/Radiowar1792/ccna-platform/main/deploy/install-lxc.sh)"
```

### Mettre à jour

Dans la console du LXC, relance simplement :

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/Radiowar1792/ccna-platform/main/deploy/install-lxc.sh)"
```

Le code est mis à jour depuis GitHub et l'application redémarre. La base (`/var/lib/ccna-platform/ccna.db`) n'est jamais touchée.

> Le dépôt doit être **public** pour que ces commandes `curl` et `git clone` fonctionnent sans identifiants.

**Conteneur créé :** Debian 13 standard, non privilégié, 1 vCPU, 1 Go de RAM, 512 Mo de swap, 8 Go de disque, démarrage automatique.

### Sauvegardes

- Une copie de la base est faite chaque nuit à 3 h 30 dans `/var/backups/ccna-platform` (14 jours conservés).
- Ajoute aussi le conteneur à tes sauvegardes Proxmox (Datacenter → Backup).

### Réglages (`/etc/ccna-platform.env` dans le LXC)

| Variable | Rôle |
|---|---|
| `APP_PASSWORD` | Mot de passe de connexion |
| `ORIGIN` | Adresse publique, ex. `http://192.168.1.50:3000` |
| `YOUTUBE_API_KEY` | Facultatif : clé gratuite YouTube Data API v3 pour lier les 63 vidéos d'un coup |

Après une modification : `systemctl restart ccna-platform`.

Pour y accéder hors de chez toi, passe par ton VPN (WireGuard, Tailscale) plutôt que d'ouvrir le port sur Internet.

## Vidéos

La page Vidéos intègre le lecteur YouTube. Le bouton **Synchroniser la playlist** associe chaque « Day N » à sa vidéo. Sans clé API, il lit la page publique de la playlist. Tu peux aussi coller le lien d'une vidéo à la main.

### Clé YouTube gratuite (méthode la plus fiable)

1. Va sur https://console.cloud.google.com, crée un projet (par exemple « ccna »).
2. Menu **API et services → Bibliothèque** : active **YouTube Data API v3**.
3. **API et services → Identifiants → Créer des identifiants → Clé API**. Copie la clé.
4. Dans le LXC : `nano /etc/ccna-platform.env`, colle-la après `YOUTUBE_API_KEY=`, puis `systemctl restart ccna-platform`.
5. Page Vidéos → **Synchroniser la playlist**.

Le quota gratuit (10 000 unités par jour) est très largement suffisant : une synchronisation en consomme 3.
