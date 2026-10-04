// Study plan: 39 weeks, from Monday 5 October 2026 to the end of June 2027.
// "days" = Days of the Jeremy's IT Lab course (see videos.ts).
// WARNING: task order matters (task_done.idx). Add new tasks at the END of `extra` only.

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
	{ phase: 'Getting started', kind: 'setup', title: 'Finish the Network Technician path', desc: 'Network Support and Security module + path exam', extra: ['Finish the Network Support and Security module', 'Pass the Network Technician Career Path exam → badge', 'Update Packet Tracer (Netacad account)'] },
	{ phase: 'Getting started', kind: 'setup', days: [1, 3], title: 'Setup + basics', desc: 'Devices, cables, OSI (quick review)', extra: ['Ask your school to enroll you in Netacad CCNA 1/2/3 (ITN, SRWE, ENSA)', 'Self-assessment: set an LED for every topic on the Topics page'] },
	{ phase: 'Block 1 · Fundamentals', kind: 'learn', days: [4, 6], title: 'CLI and Ethernet switching', desc: 'CLI intro, Ethernet LAN switching parts 1 and 2', extra: ['Lab: basic switch config (hostname, passwords, banner)'] },
	{ phase: 'Block 1 · Fundamentals', kind: 'learn', days: [7, 9], title: 'IPv4 addressing', desc: 'IPv4 parts 1 and 2, switch interfaces', extra: ['Lab: address a small network with 2 routers'] },
	{ phase: 'Block 1 · Fundamentals', kind: 'learn', days: [10, 12], title: 'Routing basics', desc: 'IPv4 header, routing fundamentals, life of a packet', extra: ['Be able to read "show ip route" line by line'] },
	{ phase: 'Block 1 · Fundamentals', kind: 'learn', days: [13, 15], title: 'Subnetting + VLSM', desc: 'The most important week of the block', extra: ['Subnetting: one session every day this week', 'Goal: solve a /26 or /27 in under 30 seconds'] },
	{ phase: 'Block 2 · Switching', kind: 'learn', days: [16, 18], title: 'VLAN', desc: 'VLANs parts 1 to 3, 802.1Q trunks, inter-VLAN routing', extra: ['Lab: router-on-a-stick + SVIs on a L3 switch'] },
	{ phase: 'Block 2 · Switching', kind: 'learn', days: [19, 21], title: 'DTP/VTP and STP', desc: 'DTP, VTP, Spanning Tree parts 1 and 2', extra: ['Find the root bridge and port roles by hand'] },
	{ phase: 'Block 2 · Switching', kind: 'learn', days: [22, 23], title: 'RSTP and EtherChannel', desc: 'Rapid PVST+, PortFast, BPDU guard, LACP', extra: ['Lab: LACP EtherChannel, L2 + L3', 'Review quiz: Switching (domain 2.0)'] },
	{ phase: 'Block 3 · Routing', kind: 'learn', days: [24, 26], title: 'Dynamic routing and OSPF part 1', desc: 'Dynamic protocols, RIP/EIGRP (overview), OSPF part 1', extra: ['Learn the administrative distances by heart'] },
	{ phase: 'Block 3 · Routing', kind: 'learn', days: [27, 28], title: 'OSPF parts 2 and 3', desc: 'Neighbors, DR/BDR, router ID, cost', extra: ['Lab: single-area OSPF on 3 routers, without the solution'] },
	{ phase: 'Christmas holidays', kind: 'light', title: 'Light week (Christmas)', desc: 'Enjoy time with your family', extra: ['Redo one OSPF lab'] },
	{ phase: 'Christmas holidays', kind: 'light', title: 'Light week + review', desc: 'Check your progress on blocks 1 to 3', extra: ['Netacad ITN final exam (CCNA 1): ≥ 70% on the first attempt', 'Update the topic LEDs'] },
	{ phase: 'Block 3 · Routing', kind: 'learn', days: [29, 30], title: 'FHRP, TCP and UDP', desc: 'HSRP, port numbers, TCP vs UDP', extra: ['Lab: HSRP between 2 routers'] },
	{ phase: 'Block 3 · Routing', kind: 'learn', days: [31, 33], title: 'IPv6', desc: 'Addressing, address types, EUI-64, IPv6 routes', extra: ['Lab: dual stack IPv4/IPv6 + IPv6 static route'] },
	{ phase: 'Block 4 · Security and services', kind: 'learn', days: [34, 35], title: 'ACL', desc: 'Standard and extended ACLs', extra: ['Lab: 3 extended ACLs without help', 'Know where to place an ACL (in/out, near source/destination)'] },
	{ phase: 'Block 4 · Security and services', kind: 'learn', days: [36, 39], title: 'CDP/LLDP, NTP, DNS, DHCP', desc: 'Infrastructure services', extra: ['Lab: DHCP on a router + ip helper-address'] },
	{ phase: 'Block 4 · Security and services', kind: 'learn', days: [40, 43], title: 'SNMP, Syslog, SSH, FTP/TFTP', desc: 'Management and monitoring', extra: ['Learn the 8 Syslog levels (0 to 7)'] },
	{ phase: 'Block 4 · Security and services', kind: 'learn', days: [44, 45], title: 'NAT', desc: 'Static NAT, dynamic NAT, PAT', extra: ['Lab: PAT (overload) + "show ip nat translations"'] },
	{ phase: 'Block 4 · Security and services', kind: 'learn', days: [46, 47], title: 'QoS', desc: 'Classification, marking, queuing, policing/shaping', extra: ['Cheat sheet: DSCP EF / AF / CS on one page'] },
	{ phase: 'Block 4 · Security and services', kind: 'learn', days: [48, 51], title: 'Layer 2 security', desc: 'Security fundamentals, port security, DHCP snooping, DAI', extra: ['Lab: port security sticky + violation shutdown'] },
	{ phase: 'Block 5 · Architecture, wireless, automation', kind: 'learn', days: [52, 54], title: 'Architectures and cloud', desc: '2/3-tier LANs, spine-leaf, WAN, virtualization', extra: [] },
	{ phase: 'Block 5 · Architecture, wireless, automation', kind: 'learn', days: [55, 58], title: 'Wi-Fi', desc: 'Fundamentals, architectures, security, WLC', extra: ['Netacad SRWE final exam (CCNA 2): ≥ 70% on the first attempt'] },
	{ phase: 'Block 5 · Architecture, wireless, automation', kind: 'learn', days: [59, 63], title: 'Automation', desc: 'SDN, JSON, REST, Ansible/Terraform + AI (v1.1)', extra: ['Read JSON and match HTTP verbs ↔ CRUD'] },
	{ phase: 'Review', kind: 'review', title: 'Review: Switching', desc: 'VLAN, STP, EtherChannel', extra: ['Redo 3 switching labs without the solution', 'Quiz domain 2.0 ≥ 80%'] },
	{ phase: 'Review', kind: 'review', title: 'Review: Routing', desc: 'Static, OSPF, FHRP, IPv6', extra: ['Redo 3 routing labs without the solution', 'Quiz domain 3.0 ≥ 80%'] },
	{ phase: 'Review', kind: 'review', title: 'Review: Services, ACL, NAT', desc: 'Domains 4.0 and 5.0', extra: ['Netacad ENSA final exam (CCNA 3): ≥ 70% on the first attempt', 'Fill in the end-of-course survey (required for the voucher)'] },
	{ phase: 'Practice exams', kind: 'exam', title: 'Practice exam #1', desc: 'Real conditions: 2 hours, no notes', extra: ['Take the ENSA CCNA practice exam', 'Log the score on the Stats page', 'Set the failed topics to amber', 'Request the discount voucher on Netacad'] },
	{ phase: 'Practice exams', kind: 'review', title: 'Weak points', desc: 'Spring holidays', extra: ['Rewatch the videos of the failed topics', '2 labs on your weakest topic'] },
	{ phase: 'Practice exams', kind: 'exam', title: 'Practice exam #2', desc: 'Real conditions', extra: ['Practice exam (platform exam mode or PDF)', 'Analyze your mistakes'] },
	{ phase: 'BTS exam period', kind: 'maintain', title: 'Maintenance mode (BTS)', desc: 'BTS comes first', extra: [] },
	{ phase: 'BTS exam period', kind: 'maintain', title: 'Maintenance mode (BTS)', desc: 'BTS comes first', extra: [] },
	{ phase: 'BTS exam period', kind: 'maintain', title: 'Maintenance mode (BTS)', desc: 'BTS comes first', extra: [] },
	{ phase: 'Final stretch', kind: 'exam', title: 'Practice exam #3 + booking', desc: 'If ≥ 80%: book your exam date', extra: ['Full practice exam', 'If ≥ 80%: book on Pearson VUE with the voucher (4 to 5 weeks later)'] },
	{ phase: 'Final stretch', kind: 'review', title: 'Weak points', desc: 'Targeted labs', extra: ['Labs on the 3 topics still in amber'] },
	{ phase: 'Final stretch', kind: 'exam', title: 'Practice exam #4', desc: 'Never-seen questions, goal 85%', extra: ['Use the questions you kept in reserve', 'Score ≥ 85%? You are ready.'] },
	{ phase: 'Final stretch', kind: 'review', title: 'Final review', desc: 'Cheat sheets and commands', extra: ['Write your one-page "show commands" cheat sheet', 'Reread all your notes'] },
	{ phase: 'Final stretch', kind: 'final', title: 'Quiet week', desc: 'No heavy studying any more', extra: ['Flashcards + quick subnetting only', 'Check your ID and Pearson VUE confirmation'] },
	{ phase: 'Exam', kind: 'final', title: 'CCNA 200-301 exam', desc: 'End of June / early July', extra: ['Sleep well the night before', 'Pass the CCNA'] }
];

export interface Task {
	when: string;
	text: string;
	link?: string;
}

export function tasksFor(i: number, solo: boolean): Task[] {
	const w = WEEKS[i];
	const list: Task[] = [];
	const dayRange = w.days ? `Days ${w.days[0]}–${w.days[1]}` : '';
	if (w.kind === 'learn') {
		list.push({ when: 'Mon–Wed', text: `Free time at work: Jeremy's IT Lab videos, ${dayRange}, + lesson and mini quiz`, link: '/videos' });
		list.push({ when: 'Thu–Fri', text: 'Free time at school: Packet Tracer labs from this week\'s videos (+ Netacad module)' });
	} else if (w.kind === 'setup' && w.days) {
		list.push({ when: 'Mon–Wed', text: `Jeremy's IT Lab videos, ${dayRange} (at 1.25×, you already know this)`, link: '/videos' });
	}
	w.extra.forEach((t) => list.push({ when: 'This week', text: t }));
	if (w.kind === 'maintain') {
		list.push({ when: 'Every day', text: 'Flashcards, 10 min max', link: '/flashcards' });
		list.push({ when: '2× / week', text: 'Subnetting 10 min to keep the pace', link: '/subnetting' });
	} else if (i < WEEKS.length - 1) {
		list.push({ when: 'Every day', text: 'Flashcards 15 min (on your phone, in free time)', link: '/flashcards' });
		if (w.kind !== 'final') list.push({ when: '3× / week', text: 'Subnetting 10 min', link: '/subnetting' });
	}
	if (w.kind !== 'final') {
		list.push(
			solo
				? { when: 'Weekend', text: 'Weekend alone with your son: one short session during his nap (flashcards + reread your notes). That is enough.' }
				: {
						when: 'Weekend',
						text:
							w.kind === 'exam'
								? 'Weekend: calmly redo the questions you missed in the practice exam'
								: w.kind === 'maintain'
									? 'Weekend: no CCNA, BTS first'
									: 'Weekend: 2 sessions of 1.5 h → redo one lab without the solution + weekly quiz',
						link: w.kind === 'maintain' ? undefined : '/qcm'
					}
		);
	}
	return list;
}

/** Week index (0..38) for a given date. */
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

/** Even week = weekend alone, unless soloStartsOdd is true. */
export function defaultSolo(i: number, soloStartsOdd: boolean): boolean {
	return (i % 2 === 0) === !soloStartsOdd;
}
