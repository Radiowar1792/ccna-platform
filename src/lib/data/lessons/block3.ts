import type { Lesson } from './types';

// Block 3 — Routing (Days 24 to 33)
export const BLOCK3: Lesson[] = [
	{
		day: 24,
		summary: 'Dynamic routing protocols let routers share routes automatically and adapt when a link fails. IGPs work inside one organization (RIP, EIGRP, OSPF), EGPs between organizations (BGP). Each protocol uses a metric to choose the best path, and administrative distance (AD) is used to compare different protocols.',
		points: ['Distance vector: RIP, EIGRP. Link state: OSPF, IS-IS.', 'Metric: RIP = hop count, EIGRP = bandwidth + delay, OSPF = cost.', 'AD: connected 0, static 1, eBGP 20, EIGRP 90, OSPF 110, RIP 120.', 'Lower AD = more trusted. Same AD? Lower metric wins.'],
		vocab: [['dynamic routing', 'routage dynamique'], ['metric', 'métrique'], ['administrative distance', 'distance administrative'], ['link state / distance vector', 'état de lien / vecteur de distance'], ['ECMP (equal-cost multi-path)', 'répartition sur plusieurs chemins de même coût']],
		hint: 'AD compares protocols. Metric compares routes inside one protocol.',
		fr: "Les protocoles de routage dynamique évitent de tout configurer à la main. Si deux protocoles connaissent le même préfixe, le router garde celui avec la plus petite AD (EIGRP 90 bat OSPF 110). À l'intérieur d'un même protocole, c'est la métrique qui départage. Mais avant tout ça, la route la plus précise (longest prefix match) gagne toujours.",
		quiz: [
			{ q: 'What is the administrative distance of OSPF?', o: ['90', '100', '110', '120'], a: 2, why: 'OSPF = 110.' },
			{ q: 'Which protocol is link state?', o: ['RIP', 'EIGRP', 'OSPF', 'BGP'], a: 2, why: 'OSPF est un protocole à état de lien.' },
			{ q: 'Two protocols advertise the same prefix. What decides which one is installed?', o: ['Metric', 'Administrative distance', 'Router ID', 'Interface speed'], a: 1, why: 'Entre protocoles différents, c\'est l\'AD.' }
		]
	},
	{
		day: 25,
		summary: 'RIP uses hop count as its metric, with a maximum of 15 hops. It is simple but slow and old. EIGRP is a Cisco advanced distance vector protocol that uses bandwidth and delay. It converges fast thanks to feasible successors. For the CCNA you only need the basics of these two.',
		points: ['RIP: metric = hops, max 15 (16 = unreachable), updates every 30 s.', 'RIPv2 sends updates to multicast 224.0.0.9.', 'EIGRP: AD 90, multicast 224.0.0.10, metric = bandwidth + delay.', 'Successor = best route; feasible successor = loop-free backup.'],
		vocab: [['hop count', 'nombre de sauts'], ['unreachable', 'injoignable'], ['successor / feasible successor', 'route principale / de secours'], ['wildcard mask', 'masque générique'], ['to advertise', 'annoncer']],
		commands: ['router rip', 'version 2', 'no auto-summary', 'router eigrp 100', 'network 10.0.0.0 0.255.255.255'],
		hint: 'The CCNA focuses on OSPF. For RIP and EIGRP, know the AD, the metric and the multicast address.',
		fr: "RIP compte les routers traversés : au-delà de 15, la destination est considérée injoignable, donc inutilisable pour les grands réseaux. EIGRP (propriétaire Cisco à l'origine) calcule sa métrique avec la bande passante la plus faible et le délai cumulé, et garde une route de secours sans boucle (feasible successor) pour basculer immédiatement.",
		quiz: [
			{ q: 'What is the maximum hop count for RIP?', o: ['10', '15', '16', '255'], a: 1, why: '15 sauts maximum, 16 = injoignable.' },
			{ q: 'What is the administrative distance of EIGRP (internal)?', o: ['90', '110', '120', '170'], a: 0, why: 'EIGRP interne = 90.' },
			{ q: 'Which metric does RIP use?', o: ['Cost', 'Bandwidth and delay', 'Hop count', 'Load'], a: 2, why: 'RIP utilise le nombre de sauts.' }
		]
	},
	{
		day: 26,
		summary: 'OSPF is a link-state protocol. Each router floods LSAs that describe its links, builds the same map of the network (the LSDB), and runs the SPF algorithm (Dijkstra) to find the best paths. OSPF uses areas; the backbone area is area 0. The CCNA covers single-area OSPF.',
		points: ['LSA = Link State Advertisement. LSDB = Link State Database.', 'All routers in an area have the same LSDB.', 'Area 0 = backbone. Multi-area designs connect to area 0 through ABRs.', 'Enable OSPF with "network ... area 0" or directly on the interface.'],
		vocab: [['link state advertisement', 'annonce d\'état de lien'], ['database', 'base de données'], ['shortest path first', 'plus court chemin d\'abord'], ['area', 'aire, zone'], ['backbone', 'épine dorsale']],
		commands: ['router ospf 1', 'network 10.0.12.0 0.0.0.3 area 0', 'passive-interface g0/2', 'show ip protocols'],
		hint: 'The OSPF process ID is local: two neighbors can use different process IDs.',
		fr: "Avec OSPF, chaque router décrit ses liens dans des LSA et les diffuse à toute l'aire. Tout le monde obtient la même carte (LSDB), puis chacun calcule son arbre des plus courts chemins avec l'algorithme SPF de Dijkstra. passive-interface empêche d'envoyer des hellos vers un LAN où il n'y a pas d'autre router, tout en annonçant ce réseau.",
		quiz: [
			{ q: 'Which algorithm does OSPF use?', o: ['Bellman-Ford', 'DUAL', 'SPF (Dijkstra)', 'Spanning Tree'], a: 2, why: 'OSPF utilise SPF (Dijkstra).' },
			{ q: 'What is the backbone area?', o: ['Area 1', 'Area 0', 'Area 10', 'Area 255'], a: 1, why: 'L\'aire 0 est le backbone.' },
			{ q: 'What does "passive-interface" do in OSPF?', o: ['Disables the interface', 'Stops sending hellos but still advertises the network', 'Removes the network from OSPF', 'Sets the cost to 0'], a: 1, why: 'Plus de hellos sur l\'interface, mais le réseau reste annoncé.' }
		]
	},
	{
		day: 27,
		summary: 'OSPF uses cost as its metric. Cost = reference bandwidth ÷ interface bandwidth, and the default reference is 100 Mbps. This means FastEthernet and faster links all have a cost of 1, so you should raise the reference bandwidth. Routers become neighbors by exchanging hello packets.',
		points: ['Default reference bandwidth = 100 Mbps → change it with "auto-cost reference-bandwidth".', 'You can also set "ip ospf cost" on an interface.', 'Hellos go to 224.0.0.5. Default hello 10 s, dead 40 s.', 'Neighbor states: Down → Init → 2-Way → ExStart → Exchange → Loading → Full.'],
		vocab: [['reference bandwidth', 'bande passante de référence'], ['neighbor', 'voisin'], ['adjacency', 'adjacence'], ['hello / dead timer', 'minuterie hello / dead'], ['full state', 'état complet (synchronisé)']],
		commands: ['auto-cost reference-bandwidth 10000', 'ip ospf cost 10', 'show ip ospf neighbor', 'show ip ospf interface brief'],
		hint: 'Change the reference bandwidth on ALL routers, or the costs will not be consistent.',
		fr: "Le coût OSPF = 100 Mbps ÷ débit de l'interface. Problème : FastEthernet, Gigabit et 10G ont tous un coût de 1 par défaut, OSPF ne fait donc pas la différence. On augmente la référence (auto-cost reference-bandwidth) sur tous les routers. Deux routers deviennent voisins grâce aux hellos (multicast 224.0.0.5) et doivent atteindre l'état Full pour échanger leurs bases.",
		quiz: [
			{ q: 'What is the default OSPF reference bandwidth?', o: ['10 Mbps', '100 Mbps', '1 Gbps', '10 Gbps'], a: 1, why: '100 Mbps par défaut.' },
			{ q: 'Which multicast address do OSPF routers use for hellos?', o: ['224.0.0.5', '224.0.0.9', '224.0.0.10', '255.255.255.255'], a: 0, why: '224.0.0.5 = tous les routers OSPF.' },
			{ q: 'Which is the final neighbor state when databases are synchronized?', o: ['2-Way', 'Exchange', 'Loading', 'Full'], a: 3, why: 'Full = bases synchronisées.' }
		]
	},
	{
		day: 28,
		summary: 'On broadcast networks like Ethernet, OSPF elects a DR and a BDR to reduce the number of adjacencies. The router with the highest priority wins, then the highest router ID. The election is not preemptive. On point-to-point links there is no DR. Many parameters must match to become neighbors.',
		points: ['DR/BDR election: highest priority (default 1, 0 = never), then highest router ID.', 'Router ID: manual > highest loopback IP > highest physical interface IP.', 'DROthers stay in 2-Way with each other: this is normal.', 'Must match: area, subnet, hello/dead timers, authentication, MTU; router IDs must be unique.'],
		vocab: [['designated router (DR)', 'routeur désigné'], ['backup designated router (BDR)', 'routeur désigné de secours'], ['priority', 'priorité'], ['preemptive', 'préemptif'], ['to match', 'correspondre']],
		commands: ['router-id 1.1.1.1', 'ip ospf priority 100', 'ip ospf network point-to-point', 'clear ip ospf process'],
		hint: 'Changing the router ID only takes effect after "clear ip ospf process" or a reload.',
		fr: "Sur un segment Ethernet avec plusieurs routers, OSPF élit un DR et un BDR : les autres (DROthers) ne forment une adjacence Full qu'avec eux, ce qui réduit le trafic. Le plus haut niveau de priorité gagne, puis le plus haut router ID. L'élection n'est pas préemptive : un nouveau router plus prioritaire ne prend pas la place tant que le DR fonctionne.",
		quiz: [
			{ q: 'Which priority value prevents a router from becoming DR?', o: ['0', '1', '100', '255'], a: 0, why: 'Priorité 0 = jamais DR ni BDR.' },
			{ q: 'Which is preferred for the OSPF router ID?', o: ['Highest physical IP', 'Highest loopback IP', 'Manual router-id command', 'Lowest MAC'], a: 2, why: 'La commande router-id est prioritaire.' },
			{ q: 'Two DROthers on the same segment stay in which state?', o: ['Full', '2-Way', 'Init', 'Down'], a: 1, why: '2-Way est normal entre deux DROthers.' }
		]
	},
	{
		day: 29,
		summary: 'If the default gateway router fails, hosts lose access to other networks. A First Hop Redundancy Protocol (FHRP) gives hosts one virtual IP and virtual MAC shared by several routers. HSRP is Cisco proprietary, VRRP is an open standard, and GLBP adds load balancing.',
		points: ['HSRP: active and standby routers. VRRP: master and backup.', 'Hosts use the virtual IP as their default gateway.', 'HSRP default priority 100; preemption is disabled by default.', 'HSRP v1 virtual MAC: 0000.0c07.acXX (XX = group number).'],
		vocab: [['redundancy', 'redondance'], ['virtual IP', 'IP virtuelle'], ['active / standby', 'actif / en attente'], ['failover', 'basculement'], ['preemption', 'préemption (reprise du rôle)']],
		commands: ['standby 1 ip 192.168.1.254', 'standby 1 priority 110', 'standby 1 preempt', 'show standby brief'],
		hint: 'Without "preempt", the router with the higher priority does not take back the active role after it reboots.',
		fr: "Un FHRP évite que la panne d'un router coupe tout le LAN. Les deux routers partagent une IP et une MAC virtuelles ; les PC ont cette IP virtuelle comme passerelle. Si le router actif tombe, le standby prend le relais sans que les PC ne changent rien. Avec HSRP, il faut activer preempt pour que le router prioritaire reprenne sa place à son retour.",
		quiz: [
			{ q: 'What do hosts configure as their default gateway with HSRP?', o: ['The active router\'s real IP', 'The virtual IP', 'The standby router\'s IP', 'The broadcast address'], a: 1, why: 'Les hôtes utilisent l\'IP virtuelle.' },
			{ q: 'Which FHRP is an open standard?', o: ['HSRP', 'GLBP', 'VRRP', 'CDP'], a: 2, why: 'VRRP est standard ; HSRP et GLBP sont Cisco.' },
			{ q: 'What is the default HSRP priority?', o: ['0', '1', '100', '255'], a: 2, why: 'Priorité HSRP par défaut = 100.' }
		]
	},
	{
		day: 30,
		summary: 'Layer 4 delivers data to the right application using port numbers. TCP is connection-oriented and reliable: three-way handshake, sequence numbers, acknowledgments and windowing. UDP is connectionless and fast, with no reliability. Real-time voice and video usually use UDP.',
		points: ['TCP handshake: SYN → SYN-ACK → ACK. Closing: FIN, ACK, FIN, ACK.', 'TCP header 20 bytes min; UDP header 8 bytes.', 'Well-known ports 0–1023. Ephemeral (source) ports are random high numbers.', 'TCP: HTTP 80, HTTPS 443, SSH 22, Telnet 23, FTP 20/21, SMTP 25. UDP: DNS 53 (also TCP), DHCP 67/68, TFTP 69, SNMP 161, Syslog 514.'],
		vocab: [['connection-oriented', 'orienté connexion'], ['acknowledgment', 'accusé de réception'], ['three-way handshake', 'poignée de main en trois temps'], ['windowing', 'fenêtrage (contrôle de flux)'], ['ephemeral port', 'port éphémère']],
		hint: 'Reliability costs time: TCP for files and web, UDP for live voice and DNS queries.',
		fr: "TCP établit une connexion (SYN, SYN-ACK, ACK), numérote les segments, attend des accusés de réception et renvoie ce qui est perdu : fiable mais plus lent. UDP envoie sans connexion ni contrôle : rapide, idéal pour la voix et la vidéo en temps réel où un paquet en retard ne sert à rien. Les ports permettent d'adresser la bonne application.",
		quiz: [
			{ q: 'What is the correct order of the TCP handshake?', o: ['SYN, ACK, SYN-ACK', 'SYN, SYN-ACK, ACK', 'ACK, SYN, FIN', 'SYN, FIN, ACK'], a: 1, why: 'SYN → SYN-ACK → ACK.' },
			{ q: 'Which port does SSH use?', o: ['21', '22', '23', '443'], a: 1, why: 'SSH = TCP 22.' },
			{ q: 'Why does VoIP usually use UDP?', o: ['It is more reliable', 'It has lower delay and overhead', 'It encrypts data', 'It uses bigger headers'], a: 1, why: 'Moins de délai et d\'overhead, idéal pour le temps réel.' }
		]
	},
	{
		day: 31,
		summary: 'IPv6 addresses are 128 bits long, written in hexadecimal as 8 groups of 16 bits. You can shorten them: remove leading zeros in each group, and replace one series of all-zero groups with "::". The usual prefix length for a LAN is /64.',
		points: ['128 bits = 8 groups (hextets) of 4 hex digits.', 'Rule 1: remove leading zeros (0db8 → db8).', 'Rule 2: "::" replaces consecutive zero groups, only ONCE per address.', 'A typical LAN subnet is a /64.'],
		vocab: [['hexadecimal', 'hexadécimal'], ['hextet', 'groupe de 16 bits'], ['leading zeros', 'zéros de tête'], ['to abbreviate', 'abréger'], ['consecutive', 'consécutif']],
		commands: ['ipv6 unicast-routing', 'interface g0/0', 'ipv6 address 2001:db8:1:1::1/64', 'show ipv6 interface brief'],
		hint: 'If you see "::" twice in an address, it is invalid.',
		fr: "IPv6 = 128 bits (contre 32 en IPv4), écrit en 8 groupes hexadécimaux. Pour abréger : on enlève les zéros au début de chaque groupe, et on remplace une seule suite de groupes à zéro par « :: » (sinon on ne saurait pas combien de zéros remettre à chaque endroit). Sur un router Cisco, ipv6 unicast-routing est nécessaire pour router en IPv6.",
		quiz: [
			{ q: 'How many bits are in an IPv6 address?', o: ['32', '64', '96', '128'], a: 3, why: 'IPv6 = 128 bits.' },
			{ q: 'How many times can "::" appear in an IPv6 address?', o: ['Once', 'Twice', 'Unlimited', 'Never'], a: 0, why: 'Une seule fois par adresse.' },
			{ q: 'Which command lets a Cisco router route IPv6?', o: ['ipv6 enable', 'ipv6 unicast-routing', 'ipv6 routing on', 'router ipv6'], a: 1, why: 'ipv6 unicast-routing active le routage IPv6.' }
		]
	},
	{
		day: 32,
		summary: 'IPv6 has several address types. Global unicast addresses are public (2000::/3). Unique local addresses are private (FC00::/7). Link-local addresses (FE80::/10) are created automatically on every interface and never routed. Multicast starts with FF. There is no broadcast in IPv6.',
		points: ['Global unicast: 2000::/3. Unique local: FC00::/7 (FD in practice). Link-local: FE80::/10.', 'Multicast FF00::/8: FF02::1 all nodes, FF02::2 all routers.', 'No broadcast in IPv6: multicast replaces it.', 'Anycast: same address on several devices, the nearest one answers.'],
		vocab: [['global unicast', 'unicast global (public)'], ['unique local', 'local unique (privé)'], ['link-local', 'lien local'], ['anycast', 'anycast (le plus proche répond)'], ['all-nodes multicast', 'multicast vers tous les nœuds']],
		hint: 'FE80 = "Find Everyone on this link only". It never leaves the link.',
		fr: "En IPv6 chaque interface a au moins une adresse link-local (FE80::) générée automatiquement : elle sert aux échanges sur le lien (voisins, protocoles de routage) mais n'est jamais routée. Les adresses global unicast (commençant par 2 ou 3) sont publiques. Il n'y a plus de broadcast : on utilise le multicast (FF02::1 pour tous les hôtes du lien).",
		quiz: [
			{ q: 'Which prefix is used for link-local addresses?', o: ['2000::/3', 'FC00::/7', 'FE80::/10', 'FF00::/8'], a: 2, why: 'Link-local = FE80::/10.' },
			{ q: 'What replaces broadcast in IPv6?', o: ['Anycast', 'Multicast', 'Unicast', 'Nothing, broadcast still exists'], a: 1, why: 'Le multicast remplace le broadcast.' },
			{ q: 'Which address type is like private IPv4 addresses?', o: ['Global unicast', 'Unique local', 'Link-local', 'Multicast'], a: 1, why: 'Unique local (FC00::/7) est l\'équivalent des adresses privées.' }
		]
	},
	{
		day: 33,
		summary: 'Modified EUI-64 builds a 64-bit interface ID from the 48-bit MAC address. Hosts can get an address automatically with SLAAC, using the prefix sent in Router Advertisements. NDP (Neighbor Discovery) replaces ARP. IPv6 static routes work like IPv4 static routes.',
		points: ['EUI-64: split the MAC, insert FFFE, flip the 7th bit.', 'NDP messages: NS/NA (like ARP), RS/RA (find routers and prefixes).', 'SLAAC = Stateless Address Auto-Configuration (prefix from RA + EUI-64 or random ID).', 'DAD (Duplicate Address Detection) checks that an address is unique.'],
		vocab: [['interface ID', 'identifiant d\'interface'], ['to flip a bit', 'inverser un bit'], ['neighbor solicitation / advertisement', 'sollicitation / annonce de voisin'], ['router advertisement', 'annonce de routeur'], ['duplicate', 'en double']],
		commands: ['ipv6 address 2001:db8:1::/64 eui-64', 'ipv6 address autoconfig', 'ipv6 route ::/0 2001:db8:12::2', 'show ipv6 neighbors'],
		hint: 'EUI-64 example: MAC 0011.2233.4455 → interface ID 0211:22FF:FE33:4455.',
		fr: "EUI-64 : on coupe la MAC en deux, on insère FFFE au milieu et on inverse le 7e bit du premier octet (00 devient 02). NDP remplace ARP : Neighbor Solicitation / Advertisement pour trouver une MAC, Router Solicitation / Advertisement pour découvrir le router et le préfixe. Avec SLAAC, l'hôte construit seul son adresse à partir du préfixe annoncé.",
		quiz: [
			{ q: 'Which value is inserted in the middle of the MAC for EUI-64?', o: ['FFFF', 'FFFE', 'FE80', '0000'], a: 1, why: 'On insère FFFE au milieu.' },
			{ q: 'Which IPv6 protocol replaces ARP?', o: ['DHCPv6', 'NDP', 'ICMP redirect', 'SLAAC'], a: 1, why: 'NDP (Neighbor Discovery) remplace ARP.' },
			{ q: 'Which command configures an IPv6 default route?', o: ['ipv6 route 0.0.0.0/0 ...', 'ipv6 route ::/0 <next-hop>', 'ipv6 default-gateway', 'ip route ::/0'], a: 1, why: 'La route par défaut IPv6 est ::/0.' }
		]
	}
];
