# Guide du projet pour les agents (et les humains)

À lire **avant toute modification**. Ce fichier décrit où en est le code, comment il est organisé, les règles à respecter et la façon de livrer une modification. Mets à jour la section « État actuel » à chaque fois que tu termines une fonctionnalité.

---

## 1. Le projet en bref

**Objectif CCNA** est la plateforme perso de révision de Batiste, étudiant en BTS SIO SISR (en alternance du lundi au mercredi, à l'école le jeudi et le vendredi, papa d'un enfant de 14 mois, seul avec lui un week-end sur deux). Objectif : obtenir le **CCNA 200-301 v1.1** à l'été 2027 (date visée par défaut : 30 juin 2027).

Elle est auto-hébergée dans un **LXC Debian 13 sur Proxmox**. Il n'y a qu'**un seul utilisateur**, protégé par un mot de passe.

Ce qu'elle fait :
- planning de 39 semaines (du 5 octobre 2026 à fin juin 2027) et calendrier ;
- vidéos du cours gratuit de Jeremy's IT Lab intégrées ;
- flashcards à répétition espacée (FSRS, l'algorithme d'Anki) ;
- QCM en anglais avec explications en français ;
- entraînement au subnetting ;
- suivi des thèmes officiels de l'examen et statistiques.

---

## 2. Stack

| Élément | Choix | Remarques |
|---|---|---|
| Framework | SvelteKit 2.70 (adapter-node) | `@sveltejs/kit` reste en 2.x pour l'instant, ne pas passer en 3.x sans le tester |
| UI | Svelte 5 **runes** (`$state`, `$derived`, `$props`, `$effect`) | Pas de syntaxe Svelte 4 (`export let`, `$:`) |
| Langage | TypeScript strict | |
| Base | SQLite via **`node:sqlite`** (`DatabaseSync`, synchrone) | Intégré à Node ≥ 22.13, aucun module natif à compiler |
| Flashcards | `ts-fsrs` 5.x | `scheduler.next(card, now, rating)` |
| CSS | Fichier maison `src/app.css` + `<style>` par composant | Pas de Tailwind ni de bibliothèque UI |
| Polices | IBM Plex Sans / Plex Mono / Saira Semi Condensed (Google Fonts) | |
| Runtime prod | Node 24 LTS, service systemd, utilisateur `ccna` | |

Il n'y a qu'une seule dépendance d'exécution (`ts-fsrs`). N'en ajoute pas sans une vraie raison.

---

## 3. Arborescence

```
src/
├── app.html, app.css, app.d.ts      Squelette HTML, thème (variables CSS clair/sombre), types Locals
├── hooks.server.ts                  Vérifie le cookie de session, redirige vers /login (401 sur /api)
├── lib/
│   ├── api.ts                       post(url, body) : POST JSON puis invalidateAll()
│   ├── dates.ts                     ymd(), parseYmd(), addDays(), formats FR (dates "jour" en heure locale)
│   ├── subnet.ts                    Calculs IPv4 + générateur d'exercices (côté client)
│   ├── data/                        CONTENU STATIQUE (versionné, pas en base)
│   │   ├── plan.ts                  WEEKS (39 semaines), tasksFor(), weekIndexOf(), defaultSolo()
│   │   ├── topics.ts                DOMAINS : les 6 domaines et 53 thèmes officiels v1.1
│   │   ├── videos.ts                COURSE : Day 1 à 63 de Jeremy + thèmes liés, ID de la playlist
│   │   ├── cards.ts                 SEED_CARDS : cartes de départ (clé unique `key`)
│   │   └── questions.ts             SEED_QUESTIONS : questions de départ (clé unique `key`)
│   ├── server/                      CODE SERVEUR UNIQUEMENT
│   │   ├── db.ts                    Connexion, MIGRATIONS[], seed(), getSetting/setSetting
│   │   ├── repo.ts                  Toutes les requêtes SQL (planning, thèmes, vidéos, FSRS, QCM, stats)
│   │   ├── heat.ts                  Points d'activité par jour pour la heatmap
│   │   ├── auth.ts                  Mot de passe unique + cookie signé HMAC (60 jours)
│   │   └── youtube.ts               Synchronisation playlist → videos.youtube_id
│   └── components/                  WeekCard, Heatmap, LineChart, SessionForm
└── routes/
    ├── +layout.svelte / .server.ts  Barre latérale (barre du haut sur mobile), badge des cartes dues
    ├── +page.*                      Accueil : tâche du jour, résumé, semaine, heatmap, sessions
    ├── planning/  calendrier/  themes/  videos/  stats/  subnetting/  login/
    ├── flashcards/                  Paquets + ajout ; reviser/ (session) ; cartes/ (gestion)
    ├── qcm/                         Lancement + ajout de question ; [id]/ (passage et correction)
    └── api/                         plan, topics, videos, review, quiz, subnet, session (JSON)
deploy/                              Scripts Proxmox / LXC + unités systemd
scripts/smoke.sh                     Test de fumée (build + toutes les pages + quelques API)
docs/ARCHITECTURE.md                 Ce fichier
ROADMAP.md                           Fonctionnalités faites et à venir
```

---

## 4. Flux de données

- **Lecture** : chaque page a un `+page.server.ts` dont la fonction `load()` appelle `repo.ts` (SQL synchrone) et renvoie des objets simples.
- **Écriture**, de deux façons selon le cas :
  1. **Routes `/api/*`** (JSON) pour les actions instantanées : cocher une tâche, noter une carte, répondre à une question… Côté client : `post('/api/xxx', body)` de `$lib/api`, qui recharge ensuite les données de la page (`invalidateAll`). Passe `refresh=false` quand la page gère son état elle-même (session de flashcards, notes).
  2. **Form actions SvelteKit** (`export const actions`) pour les vrais formulaires : ajouter une carte, une question ou un examen blanc. Utilise `use:enhance`.
- **Dates** : les jours sont stockés en `YYYY-MM-DD` (heure locale, `TZ=Europe/Paris` en prod). Les horodatages sont en ISO UTC, et `activity()` les ramène en jour local avant de grouper.
- **Mode examen des QCM** : le loader cache `answer` et `explanation` tant que la tentative n'est pas terminée. Ne casse pas ça.

---

## 5. Base de données

Fichier : `DATABASE_PATH` (en dev `./data/ccna.db`, en prod `/var/lib/ccna-platform/ccna.db`).

| Table | Rôle |
|---|---|
| `settings(key, value)` | `examDate`, `soloStartsOdd` |
| `task_done(week, idx, done_at)` | Tâches cochées. `idx` = position dans `tasksFor(week, solo)` |
| `week_solo(week, solo)` | Choix du week-end s'il diffère de l'alternance par défaut |
| `topic_status(code, status 0-2, note)` | LED (0 = à apprendre, 1 = à revoir, 2 = maîtrisé) et notes |
| `videos(day, title, youtube_id, watched_at)` | Day 1 à 63 |
| `cards(id, seed_key, deck, topic, front, back, fsrs JSON, due, suspended)` | Flashcards. `fsrs` = carte ts-fsrs sérialisée |
| `reviews(card_id, rating 1-4, reviewed_at, ms)` | Historique des révisions |
| `questions(id, seed_key, topic, stem, options JSON, answer JSON, explanation)` | Banque QCM |
| `quiz_attempts(id, mode, filter JSON {domain, pick, ids}, total, correct, …)` | Une série de QCM |
| `quiz_answers(attempt_id, question_id, chosen JSON, correct)` | Réponses données |
| `mock_exams(date, source, score)` | Examens blancs saisis à la main |
| `study_sessions(date, minutes, activity, note)` | Temps de travail noté à la main |
| `subnet_drills(at, correct, ms)` | Exercices de subnetting |

### Règles

- **Migrations** : pour changer le schéma, AJOUTE une chaîne à la fin du tableau `MIGRATIONS` dans `db.ts`. Ne modifie **jamais** une migration existante : la base de Batiste est déjà en production, et la version se suit avec `PRAGMA user_version`.
- **Contenu de départ** : ajoute-le dans `src/lib/data/*.ts` avec une `key` unique et jamais réutilisée. Il est inséré au démarrage avec `INSERT OR IGNORE`, ce qui ne crée aucun doublon et n'écrase jamais une carte que Batiste a modifiée. Pour corriger une carte déjà en base, il faut une migration `UPDATE … WHERE seed_key = '…'`.
- **Attention à `tasksFor()`** : changer l'ordre ou le nombre de tâches d'une semaine décale les cases déjà cochées (`task_done.idx`). Ajoute plutôt les nouvelles tâches à la fin de `extra`, et seulement pour des semaines futures.

---

## 6. Conventions

**Langue**
- L'interface, les commentaires et les messages de commit sont en **français**.
- L'énoncé et les réponses des QCM, ainsi que le recto des cartes « Concepts » et « Commandes », sont en **anglais** (comme à l'examen). Les explications et les aides sont en français.
- Le texte s'adresse à Batiste en le tutoyant, de façon simple et directe.

**Contenu CCNA**
- **Questions originales uniquement.** Jamais de « dumps » (ExamTopics, etc.).
- Vérifie chaque fait technique (AD, ports, timers, commandes IOS) avant de l'ajouter. Une erreur dans une flashcard s'apprend par cœur.
- Chaque question et chaque carte est reliée à un code de thème existant (`1.1` … `6.7`).

**Code**
- Svelte 5 runes uniquement. Un composant prend ses paramètres avec `let { … } = $props()`.
- Les requêtes SQL restent dans `src/lib/server/repo.ts`. Les pages appellent des fonctions, elles n'écrivent pas de SQL.
- Exception existante : `qcm/[id]/+page.server.ts` et `stats/+page.server.ts` utilisent encore `db` directement. Tu peux les déplacer dans `repo.ts` quand tu y touches.
- Le code serveur va dans `$lib/server/` : SvelteKit refuse de l'importer côté client.
- Valide toujours les entrées des routes `/api` (bornes, formats).

**Design**
- Utilise les variables CSS de `app.css` (`--panel`, `--accent`, `--green`, `--amber`…), jamais de couleur en dur. Le thème sombre suit `prefers-color-scheme`.
- Thème « baie réseau » : voyants LED pour les états, chiffres en police mono, titres en Saira.
- Classes utilitaires communes : `.card`, `.row`, `.stack`, `.grid2/3`, `.btn(.primary/.small/.ghost)`, `.pill(.amber/.green/.red/.light)`, `.strip/.cell`, `.seg`, `.tasks/.task`, `.bar`.
- L'affichage doit fonctionner sur téléphone (390 px) : Batiste révise souvent sur mobile pendant les temps morts.

---

## 7. Développer

```bash
npm install
cp .env.example .env        # mettre APP_PASSWORD= (vide) pour ne pas avoir de mot de passe en local
npm run dev                 # http://localhost:5173
```

### Avant chaque commit

```bash
npm run check               # svelte-check : 0 erreur exigée (les 5 avertissements "state_referenced_locally" sont voulus)
bash scripts/smoke.sh       # build + toutes les pages en 200 + quelques API
```

Si tu modifies une page, ouvre-la en clair et en sombre, en largeur bureau et en largeur mobile.

### Ajouter une page

1. Crée `src/routes/<nom>/+page.server.ts` (le `load`) et `+page.svelte`.
2. Ajoute le lien dans `NAV` de `src/routes/+layout.svelte`.
3. Ajoute le chemin dans la liste de `scripts/smoke.sh`.

---

## 8. Git et commits

- Branche principale : `main`. Elle doit toujours se déployer sans erreur, car `install-lxc.sh` installe `main` directement.
- Pour une fonctionnalité de plus de quelques fichiers, travaille sur une branche `feat/<sujet>` (ou `fix/<sujet>`), puis fusionne dans `main` une fois les vérifications passées.
- **Messages de commit** au format *Conventional Commits*, avec la description en français :
  ```
  feat(flashcards): import des paquets Anki (.apkg)
  fix(calendrier): décalage d'un jour sur les sessions après minuit
  content(qcm): 20 questions sur OSPF et les ACL
  docs: mise à jour de l'état du projet
  chore(deploy): Node 24 par défaut
  ```
  Types : `feat`, `fix`, `content` (cartes, questions, planning), `style`, `refactor`, `docs`, `chore`, `test`.
- Fais des commits petits et cohérents : une fonctionnalité ou une correction par commit.
- **Auteur** : GitHub refuse les e-mails privés. Utilise
  `git -c user.name="Batiste" -c user.email="210405393+Radiowar1792@users.noreply.github.com" commit …`
- N'ajoute **pas** de ligne `Co-Authored-By` ni d'autre attribution dans les messages : Batiste ne veut pas d'autre contributeur sur le dépôt.
- Ne commite **jamais** : `.env`, `data/*.db*`, `node_modules/`, `build/`, `.svelte-kit/` (déjà dans `.gitignore`).
- Après une fonctionnalité : coche-la dans `ROADMAP.md` et mets à jour la section 10 ci-dessous.

---

## 9. Déploiement

| Cas | Commande |
|---|---|
| Nouveau LXC (sur le nœud Proxmox) | `bash -c "$(curl -fsSL https://raw.githubusercontent.com/Radiowar1792/ccna-platform/main/deploy/create-lxc.sh)"` |
| Installer dans un LXC existant, ou mettre à jour | `bash -c "$(curl -fsSL https://raw.githubusercontent.com/Radiowar1792/ccna-platform/main/deploy/install-lxc.sh)"` (dans le LXC) |

Ce qu'il faut savoir sur le LXC :
- Le code source est dans `/opt/ccna-src` (clone git) et l'application compilée dans `/opt/ccna-platform`.
- Les données sont dans `/var/lib/ccna-platform` et les réglages dans `/etc/ccna-platform.env`.
- Les services sont `ccna-platform.service` (port 3000) et `ccna-backup.timer` (sauvegarde chaque nuit à 3 h 30, 14 jours conservés dans `/var/backups/ccna-platform`).
- `install.sh` remplace le code mais ne touche **jamais** à `/var/lib/ccna-platform` ni à `/etc/ccna-platform.env`.
- Une migration est donc appliquée automatiquement au redémarrage, sur la vraie base de Batiste : teste-la d'abord sur une copie.

---

## 10. État actuel (à tenir à jour)

**Version : 0.1** (4 octobre 2026)

Fait et testé en local : toutes les pages de la v0.1 (voir `ROADMAP.md`), plus 93 cartes et 53 questions de départ.

Limites connues :
- **Jamais encore testé dans un vrai LXC.** Les scripts `deploy/*.sh` passent `bash -n`, mais le premier déploiement réel est à surveiller : template Debian 13, NodeSource, durcissement systemd.
- **Vidéos** : `youtube_id` est vide tant que Batiste n'a pas cliqué sur « Synchroniser la playlist ». Le parsing de la page publique (`youtube.ts → viaPage`) est fragile : il dépend du HTML de YouTube. La voie fiable est `YOUTUBE_API_KEY`.
- **Titres des Days** : ils ont été écrits de mémoire dans `videos.ts`, la synchronisation les remplace. La numérotation peut être décalée sur la fin du cours.
- **Compteur de nouvelles cartes** (`reviewQueue`) : la requête qui compte les cartes introduites aujourd'hui est approximative.
- `node:sqlite` affiche un `ExperimentalWarning`, masqué en prod par `--disable-warning`.
- Pas encore de tests automatisés au-delà de `scripts/smoke.sh`.

**Prochaine étape conseillée** : la v0.2 de `ROADMAP.md`. Par ordre de valeur pour Batiste :
1. Import Anki `.apkg` (le deck de Jeremy).
2. Questions « Refer to the exhibit » avec des sorties `show`.
3. Suivi des labs Packet Tracer par Day.
4. Export et import JSON de toutes les données.
