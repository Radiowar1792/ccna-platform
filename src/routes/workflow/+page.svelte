<script lang="ts">
	// Page en français (demande de Batiste) : la méthode complète pour utiliser la plateforme.
	const LOOP = [
		{ t: 'Regarder la vidéo', where: 'Videos', time: '20–40 min', when: 'Lun–Mer, temps morts', how: "Sous-titres anglais activés (bouton CC), vitesse 1,25×. Tu ne prends pas encore de notes : tu écoutes et tu suis le raisonnement de Jeremy." },
		{ t: 'Lire la leçon en anglais', where: 'Videos → Summary', time: '5–10 min', when: 'Juste après la vidéo', how: "Lis le Summary, puis clique sur Listen et relis en même temps que la voix. Lis les Key points et les Commands. Dans Vocabulary, coche « Hide French » et essaie de traduire chaque terme avant de survoler." },
		{ t: 'Faire le mini quiz', where: 'Videos → Mini quiz', time: '2 min', when: 'Tout de suite', how: "Objectif 3/3. Si tu rates une question, ouvre « Explication en français », relis le Summary, puis clique sur Retry. Le meilleur score s'affiche dans la liste des vidéos." },
		{ t: 'Cocher « Watched » et étudier les cartes du Day', where: 'Videos → Flashcards · Day N', time: '5–10 min', when: 'Même session', how: "Cocher la vidéo débloque ses flashcards, comme le deck Anki de Jeremy. Clique sur « Study Day N cards » : tu les vois une première fois pendant que la vidéo est fraîche. Ensuite, l'algorithme les ramène tout seul dans tes révisions quotidiennes." },
		{ t: 'Faire le lab Packet Tracer', where: 'Packet Tracer (lien dans la description YouTube)', time: '20–45 min', when: 'Jeu–Ven à l’école', how: "D'abord sans regarder la solution. Bloqué plus de 10 minutes ? Regarde uniquement l'étape qui bloque, puis termine seul. Tape les commandes en entier (pas d'abréviations) les premières fois." },
		{ t: 'Mettre à jour le thème', where: 'Topics', time: '2 min', when: 'Après le lab', how: "Passe la LED du thème en orange (« To review ») et écris dans Notes, en anglais, les commandes et les pièges que tu as rencontrés. Le vert (« Mastered »), seulement quand tu réussis un QCM du domaine à 85 % ou plus." },
		{ t: 'Ajouter tes propres cartes', where: 'Flashcards → Add a card', time: '2 min', when: 'Dès que tu te trompes', how: "Chaque erreur en lab ou en QCM devient une carte (recto en anglais, avec le Day). C'est le geste qui fait le plus progresser : tu révises exactement ce que tu ne sais pas." }
	];
	const DAYS = [
		{ d: 'Lundi à mercredi', s: 'En entreprise', items: ['Flashcards du jour sur ton téléphone (15 min, dans les temps morts)', 'Une vidéo par jour environ, suivie de sa leçon et de son mini quiz', 'Cocher « Watched » puis étudier les cartes du Day', 'Noter la session (Home → Log a study session) si tu as fait autre chose que l’app'] },
		{ d: 'Jeudi et vendredi', s: 'À l’école', items: ['Flashcards du jour', 'Labs Packet Tracer des vidéos de la semaine', 'Module Netacad correspondant (pour le bon de réduction)', 'Un QCM de 10 questions sur le domaine de la semaine (mode Practice, « My mistakes first »)'] },
		{ d: 'Week-end avec ta femme', s: 'Session longue', items: ['Flashcards du jour', '2 sessions d’1 h 30 : refaire un lab sans solution, puis le QCM de la semaine', '10 exercices de subnetting', 'Revue du dimanche soir (voir plus bas)'] },
		{ d: 'Week-end seul avec ton fils', s: 'Minimum vital', items: ['Flashcards du jour pendant la sieste', '5 exercices de subnetting si tu as encore 5 minutes', 'C’est tout. Le planning est calculé pour ça : zéro culpabilité.'] }
	];
	const KPIS = [
		['Flashcards dues le soir', '0', 'Flashcards', "Ne jamais laisser de cartes dues s'accumuler : 15 min par jour suffisent."],
		['Rétention des cartes', '≈ 90 %', 'Stats → Flashcards', 'Plus bas : trop de nouvelles cartes, baisse « New cards per day ». Plus haut : tu peux en ajouter.'],
		['Mini quiz des leçons', '3/3', 'Stats → Lessons', 'Une case rouge ou orange = relire la leçon et refaire le quiz.'],
		['Subnetting', '> 90 % en < 30 s', 'Stats → Subnetting', 'C’est la compétence la plus rentable de l’examen.'],
		['QCM par domaine', '≥ 85 %', 'Stats → Quizzes', 'En dessous de 70 % : revoir les vidéos du domaine avant de refaire un QCM.'],
		['Vidéos vs planning', 'Courbe bleue ≥ jaune', 'Stats → Plan & videos', 'Si tu es en retard de plus d’une semaine, applique la règle « en cas de retard ».'],
		['Tâches de la semaine', '≥ 80 %', 'Plan', 'Coche au fur et à mesure, pas le dimanche soir de mémoire.']
	];
	const PHASES = [
		['Octobre → mi-mars', 'Apprendre', 'La boucle vidéo chaque semaine, labs, flashcards tous les jours. Netacad CCNA 1 puis 2 en parallèle.'],
		['Mi-mars → avril', 'Réviser', 'Plus de nouvelles vidéos. Labs refaits sans solution, QCM par domaine, LED à jour. Examen final ENSA → demande du bon de réduction.'],
		['Mai', 'BTS d’abord', 'Mode maintien : flashcards 10 min par jour et un peu de subnetting. Rien d’autre.'],
		['Juin', 'Examens blancs', 'Mode Exam chronométré, questions jamais vues, objectif 85 %. Réservation Pearson VUE dès 80 %.']
	];
</script>

<svelte:head><title>Workflow · CCNA Goal</title></svelte:head>

<div class="stack wf" lang="fr">
	<header class="stack-s">
		<div class="prompt"><b>ccna-lab#</b> show workflow</div>
		<h1>Ton workflow</h1>
		<p class="lead">La méthode la plus efficace pour utiliser la plateforme à fond. Le principe : <b>une boucle courte pour chaque vidéo</b>, <b>des révisions espacées tous les jours</b> et <b>un contrôle chaque semaine</b>. Tu apprends une fois, et l'application se charge de te faire revoir au bon moment.</p>
	</header>

	<section class="card">
		<h2>Le rituel quotidien (non négociable)</h2>
		<div class="ritual">
			<div><span class="big mono">15 min</span><span>Flashcards dues + nouvelles cartes du jour</span></div>
			<div><span class="big mono">5 min</span><span>Quelques exercices de subnetting</span></div>
			<div><span class="big mono">0</span><span>carte due en fin de journée</span></div>
		</div>
		<p class="muted">C'est la seule chose à faire <b>tous</b> les jours, même le week-end où tu es seul avec ton fils. La répétition espacée ne marche que si tu es régulier : 15 minutes par jour valent bien mieux que 2 heures le dimanche. Ouvre Flashcards sur ton téléphone pendant les temps morts.</p>
	</section>

	<section class="stack">
		<h2>La boucle d'une vidéo (un « Day » de Jeremy)</h2>
		<p class="muted">Environ une heure en tout, répartie entre l'entreprise (étapes 1 à 4) et l'école (étapes 5 à 7). Respecte l'ordre : chaque étape prépare la suivante.</p>
		<ol class="loop">
			{#each LOOP as s, i}
				<li class="card">
					<div class="row"><span class="n mono">{i + 1}</span><h3>{s.t}</h3><span class="spacer"></span><span class="pill light">{s.time}</span></div>
					<p class="small muted"><b>Où :</b> {s.where} · <b>Quand :</b> {s.when}</p>
					<p>{s.how}</p>
				</li>
			{/each}
		</ol>
	</section>

	<section class="stack">
		<h2>Ta semaine type</h2>
		<div class="grid2">
			{#each DAYS as d}
				<div class="card">
					<div class="row"><h3>{d.d}</h3><span class="spacer"></span><span class="pill">{d.s}</span></div>
					<ul>{#each d.items as it}<li>{it}</li>{/each}</ul>
				</div>
			{/each}
		</div>
	</section>

	<section class="card">
		<h2>La revue du dimanche soir (10 min)</h2>
		<ol>
			<li><b>Plan</b> : coche ce qui est fait, choisis le type du week-end suivant.</li>
			<li><b>Stats → Overview</b> : la carte d'activité doit être bleue presque tous les jours.</li>
			<li><b>Stats → Flashcards</b> : rétention autour de 90 % ? Sinon ajuste « New cards per day » (5 à 20).</li>
			<li><b>Stats → Quizzes → Weakest topics</b> : choisis les 2 thèmes à retravailler la semaine prochaine (vidéo, lab, QCM ciblé).</li>
			<li><b>Topics</b> : mets les LED à jour. Vert seulement si le QCM du domaine est à 85 % ou plus.</li>
		</ol>
	</section>

	<section class="grid2">
		<div class="card">
			<h2>Flashcards : les règles d'Anki</h2>
			<ul>
				<li><b>Sois honnête</b> : tu as hésité ou tu as trouvé à moitié ? <kbd>1</kbd> Again. <kbd>3</kbd> Good est le bouton normal. <kbd>4</kbd> Easy seulement si c'était immédiat.</li>
				<li><b>Raccourcis</b> : <kbd>Espace</kbd> pour retourner, <kbd>1</kbd> à <kbd>4</kbd> pour noter, <kbd>Ctrl</kbd>+<kbd>Z</kbd> pour annuler une erreur de clic.</li>
				<li><b>Plus de 150 cartes dues ?</b> Passe à 5 nouvelles cartes par jour jusqu'à ce que le stock redescende. Ne supprime rien.</li>
				<li><b>Une carte ratée trois fois</b> (voir « Hardest cards » dans Stats) : réécris-la plus simplement ou coupe-la en deux cartes.</li>
				<li>Le deck officiel de Jeremy s'importe aussi (Flashcards → Import). Ses cartes se rangent par Day et se débloquent avec les vidéos.</li>
			</ul>
		</div>
		<div class="card">
			<h2>QCM : bien s'en servir</h2>
			<ul>
				<li><b>Octobre à février</b> : mode Practice, 10 questions, « My mistakes and unseen questions first », sur le domaine de la semaine.</li>
				<li><b>Lis toujours l'explication</b>, même quand tu as juste : tu as peut-être eu de la chance.</li>
				<li><b>Une erreur = une flashcard</b> que tu écris toi-même.</li>
				<li><b>À partir de mars</b> : mode Timed exam (72 s par question, le rythme du vrai examen), 30 puis 60 questions.</li>
				<li><b>Garde des questions jamais vues</b> pour juin : ce sont elles qui mesurent ton vrai niveau.</li>
			</ul>
		</div>
	</section>

	<section class="card">
		<h2>Progresser en anglais en même temps</h2>
		<ul>
			<li>Sous-titres <b>anglais</b> (pas français) sur les vidéos. Si tu bloques, remets la phrase et relis-la.</li>
			<li>Bouton <b>Listen</b> sur chaque leçon : écoute puis répète les phrases à voix haute (c'est ce qui fixe la prononciation des termes techniques).</li>
			<li><b>Hide French</b> dans le vocabulaire : traduis de tête, puis vérifie.</li>
			<li>Écris tes notes de Topics et tes flashcards <b>en anglais</b>. Le français, seulement pour une explication longue.</li>
			<li>Le paquet <b>Tech English</b> contient aussi les tournures des questions d'examen (« Which two… », « Refer to the exhibit »).</li>
		</ul>
	</section>

	<section class="card">
		<h2>Les indicateurs à surveiller</h2>
		<div class="tablewrap"><table>
			<thead><tr><th>Indicateur</th><th>Objectif</th><th>Où le voir</th><th>Si ce n'est pas bon</th></tr></thead>
			<tbody>{#each KPIS as [k, goal, where, fix]}<tr><td><b>{k}</b></td><td class="mono">{goal}</td><td class="small">{where}</td><td class="small muted">{fix}</td></tr>{/each}</tbody>
		</table></div>
	</section>

	<section class="card warn">
		<h2>En cas de retard</h2>
		<p>Ça arrivera (enfant malade, BTS, fatigue). Dans l'ordre, ce que tu gardes :</p>
		<ol>
			<li><b>Les flashcards du jour</b> : toujours. C'est ce qui empêche d'oublier ce que tu as déjà appris.</li>
			<li><b>La vidéo suivante et son mini quiz</b> : pour continuer à avancer.</li>
			<li><b>Le lab</b> : tu peux le faire plus tard, en lot, le week-end avec ta femme.</li>
		</ol>
		<p class="muted">Ce que tu sacrifies en premier : la session longue du week-end et les QCM supplémentaires. Ne rattrape jamais en doublant les nouvelles cartes : avance la date de l'examen dans Plan si besoin.</p>
	</section>

	<section class="card">
		<h2>Les grandes phases jusqu'à l'examen</h2>
		<div class="phases">
			{#each PHASES as [when, name, what]}
				<div><span class="small mono muted">{when}</span><h3>{name}</h3><p class="small">{what}</p></div>
			{/each}
		</div>
	</section>
</div>

<style>
	.wf { max-width: 980px; }
	.lead { font-size: 16px; line-height: 1.6; max-width: 75ch; }
	h2 { font-size: 20px; }
	ul, ol { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 6px; line-height: 1.55; }
	.ritual { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
	.ritual div { display: flex; flex-direction: column; gap: 2px; padding: 10px 12px; background: var(--panel2); border-radius: 6px; }
	.big { font-size: 26px; font-weight: 600; color: var(--accent); }
	@media (max-width: 600px) { .ritual { grid-template-columns: 1fr; } }
	.loop { list-style: none; padding: 0; gap: 8px; }
	.loop .card { gap: 6px; }
	.n { width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; background: var(--accent); color: var(--accent-ink); font-weight: 600; font-size: 13px; flex: none; }
	.warn { border-left: 3px solid var(--amber); }
	.phases { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
	.phases div { border-top: 3px solid var(--accent); padding-top: 8px; display: flex; flex-direction: column; gap: 4px; }
	.phases div:nth-child(3) { border-color: var(--led-off); }
	.phases div:nth-child(4) { border-color: var(--green); }
	@media (max-width: 760px) { .phases { grid-template-columns: 1fr 1fr; } }
</style>
