import type { Lesson } from './types';

// Block 2 — Switching (Days 16 to 23)
export const BLOCK2: Lesson[] = [
	{
		day: 16,
		summary: 'A VLAN (Virtual LAN) splits one switch into several separate broadcast domains. Hosts in different VLANs cannot talk directly: they need a router. VLANs improve security and reduce broadcast traffic. An access port belongs to one single VLAN.',
		points: ['One VLAN = one broadcast domain = one IP subnet.', 'Access port = carries one VLAN, untagged.', 'VLAN 1 is the default VLAN; all ports start in it.', 'Traffic between VLANs needs a Layer 3 device (router or L3 switch).'],
		vocab: [['broadcast domain', 'domaine de diffusion'], ['access port', 'port d\'accès'], ['to segment', 'segmenter'], ['inter-VLAN routing', 'routage entre VLAN'], ['default VLAN', 'VLAN par défaut']],
		commands: ['vlan 10', 'name SALES', 'interface f0/2', 'switchport mode access', 'switchport access vlan 10', 'show vlan brief'],
		hint: 'If two PCs are in different VLANs, check the router before blaming the switch.',
		fr: "Un VLAN découpe un switch physique en plusieurs switchs logiques. Chaque VLAN est un domaine de broadcast séparé et correspond à un sous-réseau IP. Pour communiquer d'un VLAN à l'autre, il faut passer par un router ou un switch de niveau 3 (inter-VLAN routing). On crée le VLAN, puis on place les ports d'accès dedans.",
		quiz: [
			{ q: 'A VLAN is a separate…', o: ['collision domain', 'broadcast domain', 'routing table', 'MAC address'], a: 1, why: 'Chaque VLAN est un domaine de broadcast.' },
			{ q: 'What do hosts in different VLANs need to communicate?', o: ['A hub', 'A Layer 3 device', 'A longer cable', 'CDP'], a: 1, why: 'Il faut un router ou un switch L3.' },
			{ q: 'Which command shows VLANs and their access ports?', o: ['show interfaces trunk', 'show vlan brief', 'show ip route', 'show mac address-table'], a: 1, why: 'show vlan brief liste les VLAN et leurs ports.' }
		]
	},
	{
		day: 17,
		summary: 'A trunk port carries traffic from many VLANs on one link. 802.1Q adds a 4-byte tag with the VLAN ID to each frame. The native VLAN is not tagged and must match on both sides. Router-on-a-stick uses subinterfaces on one router port to route between VLANs.',
		points: ['802.1Q tag = 4 bytes, VLAN ID on 12 bits (1–4094 usable).', 'Native VLAN: default 1, untagged, must match on both ends.', 'Router-on-a-stick: one subinterface per VLAN with "encapsulation dot1q <vlan>".', 'Limit allowed VLANs on trunks for security.'],
		vocab: [['trunk', 'lien trunk (multi-VLAN)'], ['tag', 'étiquette'], ['native VLAN', 'VLAN natif'], ['subinterface', 'sous-interface'], ['allowed VLANs', 'VLAN autorisés']],
		commands: ['switchport mode trunk', 'switchport trunk allowed vlan 10,20', 'switchport trunk native vlan 99', 'show interfaces trunk', 'interface g0/0.10', 'encapsulation dot1Q 10'],
		hint: 'Native VLAN mismatch: CDP will warn you in the logs.',
		fr: "Le trunk transporte plusieurs VLAN sur un seul câble en ajoutant un tag 802.1Q (le numéro du VLAN) dans chaque frame. Seul le VLAN natif passe sans tag : il doit être identique des deux côtés, sinon le trafic passe d'un VLAN à l'autre. Le router-on-a-stick crée une sous-interface par VLAN sur un seul port physique du router.",
		quiz: [
			{ q: 'How big is the 802.1Q tag?', o: ['2 bytes', '4 bytes', '8 bytes', '12 bytes'], a: 1, why: 'Le tag 802.1Q fait 4 octets.' },
			{ q: 'Which VLAN is sent untagged on an 802.1Q trunk?', o: ['VLAN 1 always', 'The native VLAN', 'The voice VLAN', 'The management VLAN'], a: 1, why: 'Le VLAN natif n\'est pas taggé (VLAN 1 par défaut, modifiable).' },
			{ q: 'Which command is used on a router subinterface for VLAN 20?', o: ['switchport access vlan 20', 'encapsulation dot1Q 20', 'vlan 20', 'ip vlan 20'], a: 1, why: 'encapsulation dot1Q 20 associe la sous-interface au VLAN 20.' }
		]
	},
	{
		day: 18,
		summary: 'A multilayer (Layer 3) switch can route between VLANs without an external router. You create an SVI (Switch Virtual Interface) for each VLAN and give it an IP address. You must enable "ip routing". A routed port works like a router interface with "no switchport".',
		points: ['SVI = "interface vlan 10" with an IP address = gateway of VLAN 10.', '"ip routing" turns on routing on the L3 switch.', '"no switchport" makes a port a routed port.', 'An SVI is up only if the VLAN exists and at least one port in it is up.'],
		vocab: [['multilayer switch', 'switch multicouche (L3)'], ['SVI', 'interface virtuelle de VLAN'], ['routed port', 'port routé'], ['to enable', 'activer'], ['up/up', 'interface active et fonctionnelle']],
		commands: ['ip routing', 'interface vlan 10', 'ip address 192.168.10.1 255.255.255.0', 'no shutdown', 'interface g1/0/1', 'no switchport'],
		hint: 'SVI down? Check that the VLAN exists and has at least one active port.',
		fr: "Sur un switch L3, chaque VLAN reçoit une SVI (interface vlan X) avec une IP : c'est la passerelle des PC de ce VLAN. Sans la commande ip routing, le switch ne route pas. Une SVI ne passe up/up que si le VLAN existe et qu'au moins un port (accès ou trunk) de ce VLAN est actif.",
		quiz: [
			{ q: 'What is an SVI?', o: ['A physical port', 'A virtual Layer 3 interface for a VLAN', 'A trunk protocol', 'A VLAN database'], a: 1, why: 'SVI = interface virtuelle L3 d\'un VLAN.' },
			{ q: 'Which command allows a multilayer switch to route?', o: ['ip routing', 'router on', 'switchport routing', 'ip forward'], a: 0, why: 'ip routing active le routage.' },
			{ q: 'Which command turns a switch port into a routed port?', o: ['switchport mode access', 'no switchport', 'routed enable', 'ip route'], a: 1, why: 'no switchport transforme le port en port routé.' }
		]
	},
	{
		day: 19,
		summary: 'DTP (Dynamic Trunking Protocol) can negotiate trunks automatically, but it is a security risk. VTP (VLAN Trunking Protocol) can share the VLAN list between switches. Good practice: disable DTP and use VTP transparent mode (or VTP off).',
		points: ['DTP modes: dynamic desirable (asks for a trunk), dynamic auto (waits).', 'auto + auto = access link. desirable + auto = trunk.', 'Disable DTP: "switchport mode trunk" + "switchport nonegotiate".', 'VTP modes: server, client, transparent. The highest revision number wins.'],
		vocab: [['to negotiate', 'négocier'], ['dynamic desirable / auto', 'mode qui demande / qui attend'], ['revision number', 'numéro de révision'], ['transparent mode', 'mode transparent'], ['to propagate', 'propager']],
		commands: ['switchport mode trunk', 'switchport nonegotiate', 'vtp mode transparent', 'show interfaces f0/1 switchport'],
		hint: 'A new switch with a higher VTP revision number can delete all your VLANs. Use transparent mode.',
		fr: "DTP négocie le trunk tout seul : pratique mais dangereux (un attaquant peut négocier un trunk et voir tous les VLAN). On le désactive avec switchport nonegotiate. VTP synchronise les VLAN entre switchs ; le danger est qu'un switch avec un revision number plus élevé écrase la base VLAN de tout le réseau. En mode transparent, le switch garde sa propre liste.",
		quiz: [
			{ q: 'Both ends are "dynamic auto". What is the result?', o: ['Trunk', 'Access', 'Err-disabled', 'EtherChannel'], a: 1, why: 'auto + auto : personne ne demande, le lien reste en access.' },
			{ q: 'Which command disables DTP on a trunk port?', o: ['no dtp', 'switchport nonegotiate', 'vtp mode off', 'switchport trunk off'], a: 1, why: 'switchport nonegotiate coupe DTP.' },
			{ q: 'Which VTP mode keeps its own VLANs and does not sync?', o: ['Server', 'Client', 'Transparent', 'Primary'], a: 2, why: 'Le mode transparent ne se synchronise pas.' }
		]
	},
	{
		day: 20,
		summary: 'Redundant links between switches create Layer 2 loops. Broadcast frames would loop forever (broadcast storm) because Ethernet has no TTL. STP (Spanning Tree Protocol) blocks some ports to remove loops, and unblocks them if a link fails.',
		points: ['Loop problems: broadcast storms, MAC table instability.', 'STP elects one root bridge: lowest bridge ID (priority + MAC).', 'Default priority 32768 (+ VLAN ID with PVST+).', 'All ports of the root bridge are designated ports.'],
		vocab: [['loop', 'boucle'], ['broadcast storm', 'tempête de broadcast'], ['root bridge', 'pont racine'], ['bridge ID', 'identifiant du pont'], ['to block', 'bloquer']],
		hint: 'Lowest is best in STP: lowest bridge ID, lowest cost, lowest port ID.',
		fr: "Sans STP, une simple boucle physique fait tourner les broadcasts à l'infini (Ethernet n'a pas de TTL) et le réseau s'effondre en quelques secondes. STP élit un root bridge : celui qui a le plus petit bridge ID (priorité puis adresse MAC). Ensuite chaque switch calcule le meilleur chemin vers le root et bloque les ports redondants.",
		quiz: [
			{ q: 'Why are Layer 2 loops dangerous?', o: ['Frames have a TTL', 'Ethernet frames have no TTL, so broadcasts loop forever', 'Routers drop them', 'They slow down DNS'], a: 1, why: 'Pas de TTL en couche 2 : les broadcasts tournent sans fin.' },
			{ q: 'How is the root bridge elected?', o: ['Highest priority', 'Lowest bridge ID', 'Most ports', 'Highest MAC'], a: 1, why: 'Le plus petit bridge ID (priorité puis MAC).' },
			{ q: 'What is the default STP priority?', o: ['0', '4096', '32768', '65535'], a: 2, why: '32768 par défaut (+ le numéro de VLAN avec PVST+).' }
		]
	},
	{
		day: 21,
		summary: 'Each non-root switch chooses one root port: the port with the lowest cost to the root bridge. On each segment, one designated port is chosen. All the other ports become blocking. Classic STP port states are blocking, listening, learning and forwarding.',
		points: ['Root port = lowest root cost on a non-root switch.', 'Cost: 10 Mbps = 100, 100 Mbps = 19, 1 Gbps = 4, 10 Gbps = 2.', 'Tie-breakers: lowest neighbor bridge ID, then lowest neighbor port ID.', 'Classic STP takes up to 50 seconds to converge (20 + 15 + 15).'],
		vocab: [['root port', 'port racine'], ['designated port', 'port désigné'], ['root cost', 'coût vers la racine'], ['to converge', 'converger'], ['tie-breaker', 'critère de départage']],
		commands: ['show spanning-tree', 'spanning-tree vlan 10 root primary', 'spanning-tree vlan 10 priority 4096'],
		hint: 'Find the root first, then the root ports, then the designated ports. Whatever is left is blocking.',
		fr: "Méthode d'examen : 1) trouve le root bridge (plus petit bridge ID). 2) Sur chaque autre switch, le port avec le plus petit coût vers le root devient root port. 3) Sur chaque lien, le côté avec le meilleur coût vers le root devient designated port. 4) Les ports restants sont bloqués (non-designated). Les états classiques : blocking → listening (15 s) → learning (15 s) → forwarding.",
		quiz: [
			{ q: 'What is the STP cost of a 1 Gbps link?', o: ['19', '4', '2', '100'], a: 1, why: '1 Gbps = 4 (100 Mbps = 19, 10 Gbps = 2).' },
			{ q: 'How many root ports does the root bridge have?', o: ['0', '1', 'One per VLAN', 'All its ports'], a: 0, why: 'Le root bridge n\'a aucun root port : tous ses ports sont designated.' },
			{ q: 'Which state comes right before forwarding in classic STP?', o: ['Blocking', 'Listening', 'Learning', 'Disabled'], a: 2, why: 'L\'ordre est listening puis learning puis forwarding.' }
		]
	},
	{
		day: 22,
		summary: 'Rapid STP (802.1w) converges in a few seconds instead of up to 50. Cisco uses Rapid PVST+ (one RSTP instance per VLAN). RSTP adds alternate and backup ports. PortFast makes access ports go to forwarding immediately, and BPDU Guard protects them.',
		points: ['RSTP states: discarding, learning, forwarding.', 'Alternate port = backup path to the root (replaces a failed root port quickly).', 'PortFast: only on ports connected to end hosts.', 'BPDU Guard: err-disables a PortFast port if a BPDU is received.'],
		vocab: [['rapid', 'rapide'], ['alternate port', 'port alternatif'], ['backup port', 'port de secours'], ['discarding', 'en rejet'], ['err-disabled', 'désactivé suite à une erreur']],
		commands: ['spanning-tree mode rapid-pvst', 'spanning-tree portfast', 'spanning-tree bpduguard enable', 'spanning-tree portfast default'],
		hint: 'PortFast and BPDU Guard go together, on access ports only.',
		fr: "RSTP garde la même logique d'élection mais converge beaucoup plus vite grâce à des échanges actifs entre switchs. Il n'y a plus que 3 états (discarding, learning, forwarding). Le port alternate est un root port de secours prêt à prendre le relais. PortFast fait passer un port d'accès directement en forwarding ; BPDU Guard le désactive (err-disabled) si quelqu'un y branche un switch.",
		quiz: [
			{ q: 'Which RSTP port role is a ready backup for the root port?', o: ['Designated', 'Alternate', 'Disabled', 'Edge'], a: 1, why: 'Le port alternate remplace le root port en cas de panne.' },
			{ q: 'Where should PortFast be enabled?', o: ['On trunks between switches', 'On ports connected to end hosts', 'On the root bridge only', 'On router ports'], a: 1, why: 'PortFast uniquement sur les ports vers des hôtes.' },
			{ q: 'What does BPDU Guard do when a BPDU arrives?', o: ['Ignores it', 'Puts the port in err-disabled state', 'Makes the port root', 'Floods it'], a: 1, why: 'Le port passe en err-disabled.' }
		]
	},
	{
		day: 23,
		summary: 'EtherChannel bundles several physical links into one logical link. STP sees only one link, so no port is blocked and you get more bandwidth. LACP is the open standard and PAgP is Cisco proprietary. All member ports must have the same settings.',
		points: ['LACP modes: active / passive. PAgP modes: desirable / auto. Static: on.', 'active+active and active+passive work; passive+passive does not.', 'Members must match: speed, duplex, VLANs, trunk/access mode.', 'Load balancing is per flow (based on MAC or IP), not per frame.'],
		vocab: [['to bundle', 'regrouper'], ['link aggregation', 'agrégation de liens'], ['port-channel', 'interface logique agrégée'], ['load balancing', 'répartition de charge'], ['member port', 'port membre']],
		commands: ['interface range g0/1 - 2', 'channel-group 1 mode active', 'show etherchannel summary', 'interface port-channel 1'],
		hint: 'In "show etherchannel summary", look for (SU) for a Layer 2 channel in use, or (RU) for Layer 3.',
		fr: "EtherChannel regroupe 2 à 8 liens en une seule interface logique (port-channel). STP ne bloque plus les liens redondants et le débit s'additionne. LACP (standard IEEE 802.3ad) : active démarre la négociation, passive attend. Les paramètres des ports membres doivent être identiques sinon le canal ne monte pas.",
		quiz: [
			{ q: 'Which mode pair will form an LACP EtherChannel?', o: ['passive / passive', 'active / passive', 'auto / auto', 'desirable / active'], a: 1, why: 'Il faut au moins un côté en active.' },
			{ q: 'Which EtherChannel protocol is an open standard?', o: ['PAgP', 'LACP', 'DTP', 'VTP'], a: 1, why: 'LACP est le standard IEEE.' },
			{ q: 'How does STP see an EtherChannel?', o: ['As several links, some blocked', 'As one single logical link', 'It ignores it', 'As a trunk loop'], a: 1, why: 'STP voit un seul lien logique, donc rien n\'est bloqué.' }
		]
	}
];
