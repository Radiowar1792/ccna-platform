// Planning de révision : 39 semaines, du lundi 5 octobre 2026 à fin juin 2027.
// "j" = jours du cours Jeremy's IT Lab (voir videos.ts).

export const PLAN_START = '2026-10-05';
export const DEFAULT_EXAM_DATE = '2027-06-30';

export type WeekKind = 'setup' | 'learn' | 'light' | 'review' | 'exam' | 'maintain' | 'final';

export interface Week {
	phase: string;
	kind: WeekKind;
	title: string;
	desc: string;
	days?: [number, number];
	extra: string[];
}

export const WEEKS: Week[] = [
	{ phase: 'Démarrage', kind: 'setup', title: 'Finir le parcours Network Technician', desc: 'Module Support et sécurité + examen du parcours', extra: ['Terminer le module Support et sécurité', "Passer l'examen Network Technician Career Path → badge", 'Vérifier Packet Tracer à jour (compte Netacad)'] },
	{ phase: 'Démarrage', kind: 'setup', days: [1, 3], title: 'Mise en place + bases', desc: 'Appareils, câbles, OSI (révision rapide)', extra: ["Demander à l'école : inscription aux cours Netacad CCNA 1/2/3 (ITN, SRWE, ENSA)", "Faire l'auto-évaluation : mettre chaque thème en LED dans Thèmes"] },
	{ phase: 'Bloc 1 · Fondamentaux', kind: 'learn', days: [4, 6], title: 'CLI et switching Ethernet', desc: 'Intro CLI, Ethernet LAN switching 1 et 2', extra: ['Lab : config de base switch (hostname, mots de passe, banner)'] },
	{ phase: 'Bloc 1 · Fondamentaux', kind: 'learn', days: [7, 9], title: 'Adressage IPv4', desc: 'IPv4 parties 1 et 2, interfaces de switch', extra: ['Lab : adresser un petit réseau à 2 routeurs'] },
	{ phase: 'Bloc 1 · Fondamentaux', kind: 'learn', days: [10, 12], title: 'Routage : les bases', desc: "En-tête IPv4, routage, vie d'un paquet", extra: ['Savoir lire « show ip route » ligne par ligne'] },
	{ phase: 'Bloc 1 · Fondamentaux', kind: 'learn', days: [13, 15], title: 'Subnetting + VLSM', desc: 'La semaine la plus importante du bloc', extra: ['Subnetting : 1 session par jour cette semaine', 'Objectif : un /26 ou /27 calculé en moins de 30 s'] },
	{ phase: 'Bloc 2 · Switching', kind: 'learn', days: [16, 18], title: 'VLAN', desc: 'VLAN 1 à 3, trunks 802.1Q, inter-VLAN', extra: ['Lab : router-on-a-stick + SVI sur switch L3'] },
	{ phase: 'Bloc 2 · Switching', kind: 'learn', days: [19, 21], title: 'DTP/VTP et STP', desc: 'DTP, VTP, Spanning Tree 1 et 2', extra: ['Savoir trouver le root bridge et les rôles de ports à la main'] },
	{ phase: 'Bloc 2 · Switching', kind: 'learn', days: [22, 23], title: 'RSTP et EtherChannel', desc: 'Rapid PVST+, PortFast, BPDU guard, LACP', extra: ['Lab : EtherChannel LACP L2 + L3', 'QCM bilan Switching (domaine 2.0)'] },
	{ phase: 'Bloc 3 · Routage', kind: 'learn', days: [24, 26], title: 'Routage dynamique et OSPF 1', desc: 'Protocoles dynamiques, RIP/EIGRP (survol), OSPF 1', extra: ['Connaître par cœur les distances administratives'] },
	{ phase: 'Bloc 3 · Routage', kind: 'learn', days: [27, 28], title: 'OSPF 2 et 3', desc: 'Voisins, DR/BDR, router ID, coût', extra: ['Lab : OSPF single-area sur 3 routeurs, sans solution'] },
	{ phase: 'Vacances de Noël', kind: 'light', title: 'Semaine légère (Noël)', desc: 'Profite de la famille', extra: ['Refaire 1 lab OSPF'] },
	{ phase: 'Vacances de Noël', kind: 'light', title: 'Semaine légère + bilan', desc: 'Point sur les blocs 1 à 3', extra: ['Examen final Netacad ITN (CCNA 1) : ≥ 70 % au 1er essai', 'Mettre à jour les LED des thèmes'] },
	{ phase: 'Bloc 3 · Routage', kind: 'learn', days: [29, 30], title: 'FHRP, TCP et UDP', desc: 'HSRP, ports, TCP vs UDP', extra: ['Lab : HSRP entre 2 routeurs'] },
	{ phase: 'Bloc 3 · Routage', kind: 'learn', days: [31, 33], title: 'IPv6', desc: "Adressage, types d'adresses, EUI-64, routes IPv6", extra: ['Lab : double pile IPv4/IPv6 + route statique IPv6'] },
	{ phase: 'Bloc 4 · Sécurité et services', kind: 'learn', days: [34, 35], title: 'ACL', desc: 'ACL standard et étendues', extra: ['Lab : 3 ACL étendues sans aide', 'Savoir où placer une ACL (in/out, source/destination)'] },
	{ phase: 'Bloc 4 · Sécurité et services', kind: 'learn', days: [36, 39], title: 'CDP/LLDP, NTP, DNS, DHCP', desc: "Services d'infrastructure", extra: ['Lab : DHCP sur routeur + ip helper-address'] },
	{ phase: 'Bloc 4 · Sécurité et services', kind: 'learn', days: [40, 43], title: 'SNMP, Syslog, SSH, FTP/TFTP', desc: 'Gestion et supervision', extra: ['Apprendre les 8 niveaux Syslog (0 à 7)'] },
	{ phase: 'Bloc 4 · Sécurité et services', kind: 'learn', days: [44, 45], title: 'NAT', desc: 'NAT statique, dynamique, PAT', extra: ['Lab : PAT (overload) + « show ip nat translations »'] },
	{ phase: 'Bloc 4 · Sécurité et services', kind: 'learn', days: [46, 47], title: 'QoS', desc: 'Classification, marquage, files, policing/shaping', extra: ['Fiche : DSCP EF / AF / CS en 1 page'] },
	{ phase: 'Bloc 4 · Sécurité et services', kind: 'learn', days: [48, 51], title: 'Sécurité L2', desc: 'Fondamentaux, port security, DHCP snooping, DAI', extra: ['Lab : port security sticky + violation shutdown'] },
	{ phase: 'Bloc 5 · Archi, Wi-Fi, automatisation', kind: 'learn', days: [52, 54], title: 'Architectures et cloud', desc: 'LAN 2/3 tiers, spine-leaf, WAN, virtualisation', extra: [] },
	{ phase: 'Bloc 5 · Archi, Wi-Fi, automatisation', kind: 'learn', days: [55, 58], title: 'Wi-Fi', desc: 'Fondamentaux, architectures, sécurité, WLC', extra: ['Examen final Netacad SRWE (CCNA 2) : ≥ 70 % au 1er essai'] },
	{ phase: 'Bloc 5 · Archi, Wi-Fi, automatisation', kind: 'learn', days: [59, 63], title: 'Automatisation', desc: 'SDN, JSON, REST, Ansible/Terraform + IA (v1.1)', extra: ['Savoir lire un JSON et associer verbes HTTP ↔ CRUD'] },
	{ phase: 'Révision', kind: 'review', title: 'Révision Switching', desc: 'VLAN, STP, EtherChannel', extra: ['Refaire 3 labs Switching sans solution', 'QCM domaine 2.0 ≥ 80 %'] },
	{ phase: 'Révision', kind: 'review', title: 'Révision Routage', desc: 'Statique, OSPF, FHRP, IPv6', extra: ['Refaire 3 labs Routage sans solution', 'QCM domaine 3.0 ≥ 80 %'] },
	{ phase: 'Révision', kind: 'review', title: 'Révision Services, ACL, NAT', desc: 'Domaines 4.0 et 5.0', extra: ['Examen final Netacad ENSA (CCNA 3) : ≥ 70 % au 1er essai', 'Remplir le questionnaire de fin de cours (obligatoire pour le bon)'] },
	{ phase: 'Examens blancs', kind: 'exam', title: 'Examen blanc n°1', desc: 'Conditions réelles : 2 h, sans notes', extra: ["Passer l'examen blanc CCNA de ENSA", 'Noter le score dans Examens blancs', 'Passer les thèmes ratés en LED orange', 'Demander le bon de réduction sur Netacad'] },
	{ phase: 'Examens blancs', kind: 'review', title: 'Points faibles', desc: 'Vacances de printemps', extra: ['Revoir les vidéos des thèmes ratés', '2 labs sur le thème le plus faible'] },
	{ phase: 'Examens blancs', kind: 'exam', title: 'Examen blanc n°2', desc: 'Conditions réelles', extra: ['Examen blanc (mode examen de la plateforme ou PDF)', 'Analyser les erreurs'] },
	{ phase: 'Période examens BTS', kind: 'maintain', title: 'Mode maintien (BTS)', desc: 'Priorité au BTS', extra: [] },
	{ phase: 'Période examens BTS', kind: 'maintain', title: 'Mode maintien (BTS)', desc: 'Priorité au BTS', extra: [] },
	{ phase: 'Période examens BTS', kind: 'maintain', title: 'Mode maintien (BTS)', desc: 'Priorité au BTS', extra: [] },
	{ phase: 'Dernière ligne droite', kind: 'exam', title: 'Examen blanc n°3 + réservation', desc: 'Si ≥ 80 % : réserve ta date', extra: ['Examen blanc complet', 'Si ≥ 80 % : réserver sur Pearson VUE avec le bon (4 à 5 semaines plus tard)'] },
	{ phase: 'Dernière ligne droite', kind: 'review', title: 'Points faibles', desc: 'Labs ciblés', extra: ['Labs sur les 3 thèmes encore en orange'] },
	{ phase: 'Dernière ligne droite', kind: 'exam', title: 'Examen blanc n°4', desc: 'Questions jamais vues, objectif 85 %', extra: ['Passer les questions gardées en réserve', 'Score ≥ 85 % ? Tu es prêt.'] },
	{ phase: 'Dernière ligne droite', kind: 'review', title: 'Révision finale', desc: 'Fiches et commandes', extra: ['Écrire ta fiche « commandes show » sur 1 page', 'Relire toutes tes notes'] },
	{ phase: 'Dernière ligne droite', kind: 'final', title: 'Semaine calme', desc: 'On ne charge plus', extra: ['Flashcards + subnetting rapide uniquement', "Vérifier pièce d'identité et convocation Pearson VUE"] },
	{ phase: 'Examen', kind: 'final', title: 'Examen CCNA 200-301', desc: 'Fin juin / début juillet', extra: ['Bien dormir la veille', 'Passer le CCNA'] }
];

export interface Task {
	when: string;
	text: string;
	link?: string;
}

export function tasksFor(i: number, solo: boolean): Task[] {
	const w = WEEKS[i];
	const list: Task[] = [];
	const dayRange = w.days ? `jours ${w.days[0]} à ${w.days[1]}` : '';
	if (w.kind === 'learn') {
		list.push({ when: 'Lun–Mer', text: `Temps morts en entreprise : vidéos Jeremy's IT Lab, ${dayRange}, avec prise de notes`, link: '/videos' });
		list.push({ when: 'Jeu–Ven', text: "Temps morts à l'école : labs Packet Tracer des vidéos de la semaine (+ module Netacad)" });
	} else if (w.kind === 'setup' && w.days) {
		list.push({ when: 'Lun–Mer', text: `Vidéos Jeremy's IT Lab, ${dayRange} (en accéléré, tu connais déjà)`, link: '/videos' });
	}
	w.extra.forEach((t) => list.push({ when: 'Semaine', text: t }));
	if (w.kind === 'maintain') {
		list.push({ when: 'Chaque jour', text: 'Flashcards 10 min, pas plus', link: '/flashcards' });
		list.push({ when: '2× / sem.', text: 'Subnetting 10 min pour garder le rythme', link: '/subnetting' });
	} else if (i < WEEKS.length - 1) {
		list.push({ when: 'Chaque jour', text: 'Flashcards 15 min (téléphone, dans les temps morts)', link: '/flashcards' });
		if (w.kind !== 'final') list.push({ when: '3× / sem.', text: 'Subnetting 10 min', link: '/subnetting' });
	}
	if (w.kind !== 'final') {
		list.push(
			solo
				? { when: 'Week-end', text: 'Week-end seul avec le petit : 1 session courte pendant la sieste (flashcards + relire tes notes). Pas plus.' }
				: {
						when: 'Week-end',
						text:
							w.kind === 'exam'
								? "Week-end : refaire au calme les questions ratées de l'examen blanc"
								: w.kind === 'maintain'
									? 'Week-end : repos CCNA, BTS d’abord'
									: 'Week-end : 2 sessions de 1 h 30 → 1 lab refait sans solution + QCM de la semaine',
						link: w.kind === 'maintain' ? undefined : '/qcm'
					}
		);
	}
	return list;
}

/** Index de semaine (0..38) pour une date donnée (YYYY-MM-DD ou Date). */
export function weekIndexOf(d: Date): number {
	const start = new Date(PLAN_START + 'T00:00:00');
	const diff = Math.floor((d.getTime() - start.getTime()) / (7 * 86400000));
	return Math.max(0, Math.min(WEEKS.length - 1, diff));
}

export function weekStart(i: number): Date {
	const d = new Date(PLAN_START + 'T00:00:00');
	d.setDate(d.getDate() + 7 * i);
	return d;
}

/** Semaine paire = week-end seul, sauf si soloStartsOdd est vrai. */
export function defaultSolo(i: number, soloStartsOdd: boolean): boolean {
	return (i % 2 === 0) === !soloStartsOdd;
}
