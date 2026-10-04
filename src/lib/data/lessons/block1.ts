import type { Lesson } from './types';

// Block 1 — Fundamentals (Days 1 to 15)
export const BLOCK1: Lesson[] = [
	{
		day: 1,
		summary: 'A network connects devices so they can share data. Clients request services and servers provide them. Switches connect devices inside the same LAN. Routers connect different networks together. Firewalls filter traffic to protect the network.',
		points: ['A switch forwards frames inside one LAN.', 'A router forwards packets between networks (LANs, WAN, Internet).', 'A firewall allows or blocks traffic based on rules. A next-generation firewall (NGFW) also inspects applications.', 'End hosts are PCs, phones, servers: they send and receive data.'],
		vocab: [['end host', 'équipement terminal (PC, serveur…)'], ['to forward', 'transmettre'], ['client / server', 'client / serveur'], ['LAN (Local Area Network)', 'réseau local'], ['firewall', 'pare-feu']],
		hint: 'Think of the switch as the post office of your street (LAN) and the router as the post office that sends letters to other cities (other networks).',
		fr: "Le switch relie les machines d'un même réseau local (LAN) et travaille avec les adresses MAC (couche 2). Le router relie des réseaux différents et travaille avec les adresses IP (couche 3) : c'est lui la « default gateway » de tes PC. Le firewall décide si un flux est autorisé ou non ; un NGFW sait en plus reconnaître les applications (par exemple bloquer Facebook mais pas le web).",
		quiz: [
			{ q: 'Which device connects different networks together?', o: ['Switch', 'Router', 'Hub', 'Access point'], a: 1, why: 'Le router relie des réseaux différents (couche 3). Le switch reste dans un seul LAN.' },
			{ q: 'Which device filters traffic based on security rules?', o: ['Firewall', 'Switch', 'Repeater', 'Patch panel'], a: 0, why: 'Le firewall autorise ou bloque le trafic selon des règles.' },
			{ q: 'A PC that requests a web page is acting as a…', o: ['server', 'router', 'client', 'gateway'], a: 2, why: 'Celui qui demande un service est le client ; celui qui le fournit est le server.' }
		]
	},
	{
		day: 2,
		summary: 'Ethernet is the standard for wired LANs. Copper UTP cables use RJ45 connectors. A straight-through cable connects different devices, a crossover cable connects similar devices, but Auto MDI-X can fix the wrong cable automatically. Fiber-optic cables send light and reach much longer distances.',
		points: ['UTP = Unshielded Twisted Pair. The wires are twisted to reduce interference.', 'Speeds: 10BASE-T (10 Mbps), 100BASE-TX (100 Mbps), 1000BASE-T (1 Gbps).', 'Copper Ethernet max length is about 100 meters.', 'Multimode fiber: shorter distance, cheaper. Single-mode fiber: very long distance.'],
		vocab: [['twisted pair', 'paire torsadée'], ['straight-through / crossover', 'câble droit / croisé'], ['fiber-optic', 'fibre optique'], ['single-mode / multimode', 'monomode / multimode'], ['interference', 'interférence, perturbation']],
		hint: 'In "1000BASE-T", the number is the speed in Mbps, BASE means baseband and T means twisted pair.',
		fr: "Le câble droit relie deux équipements différents (PC ↔ switch), le câble croisé deux équipements similaires (switch ↔ switch). Aujourd'hui l'Auto MDI-X corrige automatiquement. La fibre multimode utilise une source LED/laser bon marché et va jusqu'à quelques centaines de mètres ; la monomode utilise un laser et va jusqu'à des dizaines de kilomètres.",
		quiz: [
			{ q: 'What is the maximum length of a copper UTP Ethernet cable?', o: ['10 m', '100 m', '500 m', '2 km'], a: 1, why: 'Environ 100 mètres pour l\'Ethernet sur cuivre.' },
			{ q: 'Which fiber type is best for very long distances?', o: ['Multimode', 'Single-mode', 'UTP Cat6', 'Coaxial'], a: 1, why: 'La fibre monomode (single-mode) va le plus loin.' },
			{ q: 'Which feature lets a switch port work with either a straight-through or a crossover cable?', o: ['PoE', 'Auto MDI-X', 'Full duplex', 'CDP'], a: 1, why: 'Auto MDI-X détecte et corrige le type de câble.' }
		]
	},
	{
		day: 3,
		summary: 'The OSI model has 7 layers and the TCP/IP model has 4 (or 5) layers. Each layer has a role. When data goes down the layers, each layer adds a header: this is encapsulation. The receiver removes the headers: this is de-encapsulation.',
		points: ['OSI layers: 7 Application, 6 Presentation, 5 Session, 4 Transport, 3 Network, 2 Data Link, 1 Physical.', 'PDU names: segment (L4), packet (L3), frame (L2), bits (L1).', 'Layer 2 uses MAC addresses, layer 3 uses IP addresses, layer 4 uses port numbers.', 'Same-layer interaction: each layer talks to the same layer on the other device.'],
		vocab: [['layer', 'couche'], ['encapsulation', 'encapsulation (ajout d\'en-têtes)'], ['header / trailer', 'en-tête / en-queue'], ['PDU (Protocol Data Unit)', 'unité de données d\'une couche'], ['segment / packet / frame', 'segment / paquet / trame']],
		hint: 'Mnemonic from layer 1 to 7: "Please Do Not Throw Sausage Pizza Away".',
		fr: "Le modèle OSI sert à découper le fonctionnement du réseau en 7 couches. À l'envoi, chaque couche ajoute son en-tête (encapsulation) : les données deviennent un segment (L4), puis un packet (L3), puis une frame (L2), puis des bits (L1). À la réception, chaque couche retire son en-tête (de-encapsulation). Retiens surtout L2 = MAC / switch, L3 = IP / router, L4 = ports TCP-UDP.",
		quiz: [
			{ q: 'What is the PDU at layer 2?', o: ['Segment', 'Packet', 'Frame', 'Bit'], a: 2, why: 'Couche 2 (Data Link) = frame (trame).' },
			{ q: 'Which OSI layer uses IP addresses?', o: ['Layer 2', 'Layer 3', 'Layer 4', 'Layer 7'], a: 1, why: 'La couche 3 (Network) utilise les adresses IP.' },
			{ q: 'What is encapsulation?', o: ['Removing headers', 'Adding headers as data goes down the layers', 'Encrypting data', 'Compressing data'], a: 1, why: 'Encapsulation = ajout d\'en-têtes en descendant les couches.' }
		]
	},
	{
		day: 4,
		summary: 'You configure Cisco devices with the CLI (Command-Line Interface), first through the console port. There are several modes: user EXEC (>), privileged EXEC (#) and global configuration (config)#. The running-config is in RAM, the startup-config is saved in NVRAM.',
		points: ['enable → privileged EXEC mode. configure terminal → global config mode.', 'enable secret is hashed and more secure than enable password.', 'service password-encryption hides plain-text passwords (weak encryption, type 7).', 'Save with "write memory" or "copy running-config startup-config".'],
		vocab: [['running-config / startup-config', 'config active (RAM) / config de démarrage (NVRAM)'], ['privileged EXEC mode', 'mode privilégié'], ['to save', 'enregistrer'], ['plain text', 'texte en clair'], ['hash', 'empreinte (hachage)']],
		commands: ['enable', 'configure terminal', 'hostname R1', 'enable secret Cisco123', 'service password-encryption', 'copy running-config startup-config'],
		hint: 'If you reboot a router without saving, all changes in the running-config are lost.',
		fr: "Le prompt t'indique le mode : R1> (user EXEC, très limité), R1# (privileged EXEC, toutes les commandes show), R1(config)# (configuration globale). La running-config est en RAM : elle disparaît au redémarrage si tu ne fais pas copy running-config startup-config. Préfère toujours enable secret (hash fort) à enable password.",
		quiz: [
			{ q: 'Which prompt shows privileged EXEC mode?', o: ['R1>', 'R1#', 'R1(config)#', 'R1(config-if)#'], a: 1, why: 'Le # sans (config) = mode privilégié.' },
			{ q: 'Where is the startup-config stored?', o: ['RAM', 'Flash', 'NVRAM', 'ROM'], a: 2, why: 'La startup-config est stockée en NVRAM.' },
			{ q: 'Which command protects privileged mode with a hashed password?', o: ['enable password', 'enable secret', 'service password-encryption', 'login local'], a: 1, why: 'enable secret stocke un hash (plus sûr).' }
		]
	},
	{
		day: 5,
		summary: 'Ethernet frames contain a destination MAC, a source MAC, a type field and an FCS to detect errors. A MAC address is 48 bits (12 hex digits). The first half is the OUI that identifies the manufacturer. A switch learns MAC addresses from the source field of each frame.',
		points: ['Frame: Preamble + SFD, Destination MAC, Source MAC, Type/Length, Payload, FCS.', 'MAC address = 48 bits, written in hexadecimal. OUI = first 24 bits.', 'The switch stores "MAC address → port" in its MAC address table.', 'Unknown destination (unknown unicast): the switch floods the frame.'],
		vocab: [['MAC address table', 'table d\'adresses MAC'], ['to learn', 'apprendre'], ['to flood', 'inonder (envoyer partout)'], ['FCS (Frame Check Sequence)', 'champ de contrôle d\'erreur'], ['OUI', 'identifiant du fabricant']],
		hint: 'A switch learns from the SOURCE MAC, but forwards based on the DESTINATION MAC.',
		fr: "Quand une frame arrive, le switch lit la MAC source et l'associe au port d'entrée (learning). Ensuite il regarde la MAC de destination : s'il la connaît, il envoie la frame seulement sur le bon port (forwarding) ; sinon il l'envoie sur tous les ports sauf celui d'entrée (flooding). Le FCS permet de détecter une frame abîmée, qui sera jetée.",
		quiz: [
			{ q: 'How many bits are in a MAC address?', o: ['32', '48', '64', '128'], a: 1, why: 'Une adresse MAC fait 48 bits (12 chiffres hexadécimaux).' },
			{ q: 'Which field does a switch use to LEARN MAC addresses?', o: ['Destination MAC', 'Source MAC', 'FCS', 'Type'], a: 1, why: 'Le switch apprend grâce à la MAC source.' },
			{ q: 'What does the FCS field do?', o: ['Identifies the vendor', 'Detects transmission errors', 'Encrypts the frame', 'Indicates the VLAN'], a: 1, why: 'Le FCS (CRC) détecte les erreurs de transmission.' }
		]
	},
	{
		day: 6,
		summary: 'ARP finds the MAC address that matches a known IP address. The ARP request is a broadcast, and the ARP reply is a unicast. Ping uses ICMP echo request and echo reply to test connectivity. The MAC address table entries are removed after 5 minutes without traffic.',
		points: ['ARP request: broadcast to FFFF.FFFF.FFFF. ARP reply: unicast.', 'Commands: "arp -a" on Windows, "show arp" on Cisco.', 'Ping = ICMP echo request + echo reply.', 'Dynamic MAC entries age out after 300 seconds by default.'],
		vocab: [['broadcast', 'diffusion (à tous)'], ['unicast', 'envoi à un seul destinataire'], ['echo request / echo reply', 'demande d\'écho / réponse d\'écho'], ['to age out', 'expirer'], ['to resolve', 'résoudre (trouver)']],
		commands: ['show mac address-table', 'clear mac address-table dynamic', 'show arp'],
		hint: 'The first ping often loses one packet: the router is busy doing ARP.',
		fr: "Pour envoyer un paquet sur le LAN, le PC doit connaître la MAC de destination. Il envoie donc une ARP request en broadcast (« qui a l'IP 192.168.1.1 ? »), et seul le propriétaire répond en unicast avec sa MAC. Le résultat est gardé dans le cache ARP. Le ping utilise ICMP ; le premier paquet est souvent perdu à cause de la résolution ARP.",
		quiz: [
			{ q: 'What does ARP do?', o: ['Finds an IP from a name', 'Finds a MAC address from an IP address', 'Assigns IP addresses', 'Finds the default gateway'], a: 1, why: 'ARP associe une adresse IP connue à une adresse MAC.' },
			{ q: 'How is an ARP request sent?', o: ['Unicast', 'Multicast', 'Broadcast', 'Anycast'], a: 2, why: 'La requête ARP est en broadcast, la réponse en unicast.' },
			{ q: 'Which protocol does ping use?', o: ['TCP', 'UDP', 'ICMP', 'ARP'], a: 2, why: 'Ping utilise ICMP echo request / echo reply.' }
		]
	},
	{
		day: 7,
		summary: 'An IPv4 address is 32 bits, written as 4 decimal numbers (octets). You must be fast at converting binary to decimal and back. The old classes are A, B and C. The prefix length (like /24) tells how many bits are the network part.',
		points: ['Bit values in one octet: 128 64 32 16 8 4 2 1.', 'Class A: 1–126 (/8). Class B: 128–191 (/16). Class C: 192–223 (/24).', '127.x.x.x is the loopback range.', 'Network part + host part = 32 bits.'],
		vocab: [['octet', 'octet (8 bits)'], ['binary / decimal', 'binaire / décimal'], ['prefix length', 'longueur de préfixe (/24…)'], ['network portion / host portion', 'partie réseau / partie hôte'], ['loopback', 'adresse de bouclage']],
		hint: 'Write "128 64 32 16 8 4 2 1" on your paper at the start of the exam. It makes every conversion faster.',
		fr: "Une adresse IPv4 = 32 bits découpés en 4 octets. Pour convertir 192 en binaire : 128+64 = 192 donc 11000000. Le /24 signifie que les 24 premiers bits sont la partie réseau, les 8 derniers la partie hôte. Les classes A/B/C ne sont plus utilisées pour le routage (on parle de CIDR) mais tombent encore à l'examen.",
		quiz: [
			{ q: 'What is 11000000 in decimal?', o: ['128', '192', '224', '240'], a: 1, why: '128 + 64 = 192.' },
			{ q: 'Which class does 172.20.1.1 belong to?', o: ['Class A', 'Class B', 'Class C', 'Class D'], a: 1, why: 'Le premier octet est entre 128 et 191 : classe B.' },
			{ q: 'How many bits are in an IPv4 address?', o: ['16', '32', '48', '128'], a: 1, why: 'IPv4 = 32 bits.' }
		]
	},
	{
		day: 8,
		summary: 'In each network, the first address is the network address and the last one is the broadcast address. They cannot be given to hosts. The number of usable hosts is 2^n − 2, where n is the number of host bits. You configure an IP on a router interface and then enable it with "no shutdown".',
		points: ['Network address = all host bits at 0. Broadcast = all host bits at 1.', 'Usable hosts = 2^(host bits) − 2.', 'Router interfaces are shut down by default.', 'Private ranges (RFC 1918): 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.'],
		vocab: [['network address', 'adresse réseau'], ['broadcast address', 'adresse de diffusion'], ['usable host', 'hôte utilisable'], ['to assign', 'attribuer'], ['administratively down', 'désactivée par l\'administrateur']],
		commands: ['interface g0/0', 'ip address 192.168.1.1 255.255.255.0', 'no shutdown', 'show ip interface brief'],
		hint: 'In "show ip interface brief", "administratively down" means you forgot "no shutdown".',
		fr: "Dans 192.168.1.0/24, l'adresse réseau est .0, le broadcast .255, et les hôtes vont de .1 à .254 : 2^8 − 2 = 254. Sur un router, les interfaces sont éteintes par défaut : il faut taper no shutdown. Les plages privées RFC 1918 ne sont pas routées sur Internet (il faut du NAT).",
		quiz: [
			{ q: 'How many usable hosts are in a /24 network?', o: ['256', '255', '254', '252'], a: 2, why: '2^8 − 2 = 254.' },
			{ q: 'Which command enables a router interface?', o: ['enable', 'no shutdown', 'interface up', 'ip enable'], a: 1, why: 'no shutdown active l\'interface.' },
			{ q: 'Which address is private?', o: ['172.32.0.1', '10.20.30.40', '192.169.1.1', '8.8.8.8'], a: 1, why: '10.0.0.0/8 est une plage privée.' }
		]
	},
	{
		day: 9,
		summary: 'Switch interfaces have speed and duplex settings. Full duplex means sending and receiving at the same time. Half duplex can cause collisions. Both sides must match, or you get a duplex mismatch. Interface counters help you find errors like CRC errors and late collisions.',
		points: ['Speed and duplex are auto-negotiated by default.', 'Duplex mismatch → late collisions and bad performance.', 'Runts = frames too small, giants = frames too big, CRC = damaged frames.', 'Unused ports should be shut down for security.'],
		vocab: [['full duplex / half duplex', 'bidirectionnel simultané / alterné'], ['duplex mismatch', 'incohérence de duplex'], ['collision', 'collision'], ['counter', 'compteur'], ['to negotiate', 'négocier']],
		commands: ['show interfaces status', 'show interfaces f0/1', 'speed 100', 'duplex full', 'description Link to R1'],
		hint: 'Late collisions on a link = check duplex first.',
		fr: "En full duplex, l'équipement envoie et reçoit en même temps : pas de collision possible. En half duplex, il faut attendre son tour (CSMA/CD). Si un côté est full et l'autre half (duplex mismatch), le côté half détecte des late collisions et le débit s'effondre. Les compteurs de show interfaces (CRC, runts, giants) aident au dépannage.",
		quiz: [
			{ q: 'What is the most likely cause of late collisions?', o: ['Wrong VLAN', 'Duplex mismatch', 'Bad IP address', 'STP loop'], a: 1, why: 'Les late collisions indiquent typiquement un duplex mismatch.' },
			{ q: 'In full duplex mode, a device can…', o: ['only send', 'send and receive at the same time', 'only receive', 'send only when the link is free'], a: 1, why: 'Full duplex = envoi et réception simultanés.' },
			{ q: 'Which command shows the speed and duplex of all switch ports?', o: ['show vlan', 'show interfaces status', 'show running-config', 'show cdp'], a: 1, why: 'show interfaces status affiche vitesse, duplex et VLAN de chaque port.' }
		]
	},
	{
		day: 10,
		summary: 'The IPv4 header has many fields. The most important for the CCNA are: version, TTL, protocol, source and destination address. The TTL is decreased by 1 at each router; when it reaches 0, the packet is dropped. This prevents packets from looping forever.',
		points: ['Version = 4 for IPv4. Header length is at least 20 bytes.', 'TTL (Time To Live): decreased by each router, packet dropped at 0.', 'Protocol field: 1 = ICMP, 6 = TCP, 17 = UDP.', 'DSCP field is used for QoS marking.'],
		vocab: [['header field', 'champ d\'en-tête'], ['TTL (Time To Live)', 'durée de vie'], ['to decrement', 'décrémenter'], ['to drop', 'jeter, supprimer'], ['fragmentation', 'fragmentation']],
		hint: 'Protocol numbers to memorize: ICMP 1, TCP 6, UDP 17, OSPF 89.',
		fr: "Le champ TTL empêche un paquet de tourner en boucle à l'infini : chaque router le diminue de 1 et jette le paquet à 0 (en envoyant un message ICMP « time exceeded », c'est ce qu'utilise traceroute). Le champ Protocol indique ce qu'il y a dans le paquet : 6 pour TCP, 17 pour UDP, 1 pour ICMP.",
		quiz: [
			{ q: 'What happens when the TTL of a packet reaches 0?', o: ['It is sent back', 'It is dropped', 'It is broadcast', 'It is fragmented'], a: 1, why: 'Le router jette le paquet quand le TTL arrive à 0.' },
			{ q: 'Which protocol number means TCP?', o: ['1', '6', '17', '89'], a: 1, why: 'TCP = 6, UDP = 17, ICMP = 1.' },
			{ q: 'What is the minimum size of the IPv4 header?', o: ['8 bytes', '20 bytes', '40 bytes', '64 bytes'], a: 1, why: 'L\'en-tête IPv4 fait 20 octets minimum.' }
		]
	},
	{
		day: 11,
		summary: 'A router uses its routing table to choose where to send each packet. Connected and local routes are added automatically when you configure an IP on an interface. You can add static routes by hand. The default route 0.0.0.0/0 matches every destination and is used when nothing more specific exists.',
		points: ['C = connected route (the network), L = local route (the /32 of the interface).', 'Static route: ip route <network> <mask> <next-hop or exit interface>.', 'The most specific match wins (longest prefix match).', 'Default route = "gateway of last resort".'],
		vocab: [['routing table', 'table de routage'], ['next hop', 'prochain saut'], ['static route', 'route statique'], ['default route', 'route par défaut'], ['gateway of last resort', 'passerelle de dernier recours']],
		commands: ['show ip route', 'ip route 10.2.0.0 255.255.255.0 192.168.12.2', 'ip route 0.0.0.0 0.0.0.0 203.0.113.1'],
		hint: 'Each router needs a route to the destination AND the return path must exist too.',
		fr: "Quand tu donnes une IP à une interface, le router ajoute deux routes : une C (le réseau connecté) et une L (sa propre adresse en /32). Pour joindre un réseau éloigné, il faut une route statique ou un protocole de routage. Attention : pour qu'un ping marche, il faut aussi la route du retour sur l'autre router.",
		quiz: [
			{ q: 'What does the code "L" mean in the routing table?', o: ['Learned by OSPF', 'Local route (the interface IP /32)', 'Last resort', 'Link-state'], a: 1, why: 'L = local route, l\'adresse de l\'interface en /32.' },
			{ q: 'Which route matches every destination?', o: ['0.0.0.0/0', '255.255.255.255/32', '127.0.0.1/8', '224.0.0.0/4'], a: 0, why: '0.0.0.0/0 est la route par défaut.' },
			{ q: 'A router has routes 10.0.0.0/8 and 10.1.0.0/16. A packet goes to 10.1.5.5. Which route is used?', o: ['10.0.0.0/8', '10.1.0.0/16', 'Both', 'The default route'], a: 1, why: 'Le préfixe le plus long (le plus précis) gagne.' }
		]
	},
	{
		day: 12,
		summary: 'This lesson follows one packet from PC1 to PC2 across two routers. The IP addresses stay the same from end to end. The MAC addresses change at each hop, because each router builds a new frame. ARP is used on each link to find the next MAC address.',
		points: ['Source and destination IP: unchanged along the path (without NAT).', 'Source and destination MAC: rewritten at every router.', 'The PC sends to the MAC of its default gateway when the destination is in another network.', 'Each router decreases the TTL.'],
		vocab: [['hop', 'saut (passage par un router)'], ['to rewrite', 'réécrire'], ['path', 'chemin'], ['end to end', 'de bout en bout'], ['default gateway', 'passerelle par défaut']],
		hint: 'IP = the final address on the envelope. MAC = the next stop of the delivery truck.',
		fr: "C'est une notion très testée. Quand PC1 envoie à PC2 dans un autre réseau, il met l'IP de PC2 en destination, mais la MAC de sa passerelle (le router). Le router enlève la frame, regarde l'IP, choisit la route, puis crée une nouvelle frame avec sa propre MAC en source et la MAC du prochain équipement en destination. Les IP ne changent pas, les MAC changent à chaque saut.",
		quiz: [
			{ q: 'Which addresses change at each router hop?', o: ['Source and destination IP', 'Source and destination MAC', 'Only the destination IP', 'None'], a: 1, why: 'Les MAC sont réécrites à chaque saut, les IP restent identiques.' },
			{ q: 'PC1 sends to a host in another network. What destination MAC does PC1 use?', o: ['The MAC of the final host', 'The MAC of its default gateway', 'FFFF.FFFF.FFFF', 'Its own MAC'], a: 1, why: 'Le PC envoie la frame à la MAC de sa passerelle.' },
			{ q: 'Which protocol finds the next-hop MAC address on each link?', o: ['DNS', 'DHCP', 'ARP', 'ICMP'], a: 2, why: 'ARP est utilisé sur chaque lien.' }
		]
	},
	{
		day: 13,
		summary: 'Subnetting means dividing a big network into smaller networks. You borrow host bits to create subnet bits. Each borrowed bit doubles the number of subnets and halves the number of hosts. Start with /24 networks and learn the masks by heart.',
		points: ['/25 = 255.255.255.128 (2 subnets, 126 hosts).', '/26 = .192 (64 addresses), /27 = .224 (32), /28 = .240 (16), /29 = .248 (8), /30 = .252 (4).', 'Block size = 256 − mask value in the interesting octet.', 'Subnets = 2^(borrowed bits). Hosts = 2^(host bits) − 2.'],
		vocab: [['subnet', 'sous-réseau'], ['to borrow bits', 'emprunter des bits'], ['subnet mask', 'masque de sous-réseau'], ['block size', 'taille de bloc (pas)'], ['interesting octet', 'octet intéressant']],
		hint: 'Mask values to know by heart: 128, 192, 224, 240, 248, 252, 254, 255.',
		fr: "Méthode rapide : trouve l'octet où le masque n'est ni 255 ni 0. Taille du bloc = 256 − cette valeur. Exemple /27 : masque .224, bloc de 32. Les réseaux commencent à 0, 32, 64, 96… L'hôte .77 est dans le réseau .64, broadcast .95, hôtes .65 à .94. Entraîne-toi dans l'onglet Subnetting tous les jours.",
		quiz: [
			{ q: 'What is the subnet mask for /27?', o: ['255.255.255.192', '255.255.255.224', '255.255.255.240', '255.255.255.248'], a: 1, why: '/27 = 255.255.255.224.' },
			{ q: 'How many usable hosts are in a /28?', o: ['14', '16', '30', '6'], a: 0, why: '2^4 − 2 = 14.' },
			{ q: 'What is the block size for /26?', o: ['32', '64', '128', '16'], a: 1, why: '256 − 192 = 64.' }
		]
	},
	{
		day: 14,
		summary: 'Now you practice subnetting with Class B and Class A networks. The method is the same, but the interesting octet can be the third or second octet. Always find the interesting octet first, then the block size.',
		points: ['/17 to /23: the interesting octet is the 3rd octet.', 'Example: 172.16.0.0/20 → mask 255.255.240.0, block size 16 in the 3rd octet.', 'Number of hosts in /20 = 2^12 − 2 = 4094.', 'Always check: network bits + host bits = 32.'],
		vocab: [['to divide', 'diviser'], ['range', 'plage'], ['first usable / last usable', 'premier / dernier hôte utilisable'], ['to calculate', 'calculer'], ['shortcut', 'raccourci']],
		hint: 'For /16 to /24, work in the 3rd octet, and the 4th octet goes from 0 to 255 inside each block.',
		fr: "Exemple : 172.16.77.10/20. Masque 255.255.240.0, octet intéressant = le 3e, bloc de 16. Les réseaux sont 172.16.0.0, .16.0, .32.0, .48.0, .64.0… 77 est entre 64 et 79, donc réseau 172.16.64.0, broadcast 172.16.79.255, premier hôte 172.16.64.1, dernier 172.16.79.254.",
		quiz: [
			{ q: 'What is the network address of 172.16.77.10/20?', o: ['172.16.64.0', '172.16.72.0', '172.16.77.0', '172.16.48.0'], a: 0, why: 'Bloc de 16 dans le 3e octet : 64 ≤ 77 < 80, réseau 172.16.64.0.' },
			{ q: 'What is the mask for /20?', o: ['255.255.224.0', '255.255.240.0', '255.255.248.0', '255.255.255.240'], a: 1, why: '/20 = 255.255.240.0.' },
			{ q: 'How many usable hosts are in a /22?', o: ['510', '1022', '1024', '2046'], a: 1, why: '10 bits d\'hôte : 2^10 − 2 = 1022.' }
		]
	},
	{
		day: 15,
		summary: 'VLSM (Variable Length Subnet Masking) lets you use different mask sizes in the same network. This saves addresses. Always start with the biggest subnet, then the next one, and so on. Point-to-point links between routers usually use a /30 (or /31).',
		points: ['Sort subnets from the largest to the smallest.', 'Give each subnet the smallest mask that fits its hosts.', 'Next subnet starts right after the previous broadcast address.', 'Router-to-router link: /30 = 2 usable addresses.'],
		vocab: [['to waste', 'gaspiller'], ['requirement', 'besoin, exigence'], ['point-to-point link', 'liaison point à point'], ['to fit', 'convenir, tenir dans'], ['largest / smallest', 'le plus grand / le plus petit']],
		hint: 'Biggest first. Always.',
		fr: "Avec VLSM, chaque sous-réseau a la taille adaptée. Exemple avec 192.168.1.0/24 : LAN de 100 hôtes → /25 (192.168.1.0–127), LAN de 50 → /26 (.128–.191), LAN de 20 → /27 (.192–.223), liens routers → /30 (.224, .228…). Si tu commences par les petits, les gros ne rentreront plus proprement.",
		quiz: [
			{ q: 'In VLSM, which subnet should you allocate first?', o: ['The smallest', 'The largest', 'The point-to-point links', 'Any order'], a: 1, why: 'On commence toujours par le plus grand besoin.' },
			{ q: 'Which mask is typical for a point-to-point link between two routers?', o: ['/24', '/28', '/30', '/32'], a: 2, why: '/30 donne exactement 2 adresses utilisables.' },
			{ q: 'Which mask fits 50 hosts with the least waste?', o: ['/25', '/26', '/27', '/28'], a: 1, why: '/26 = 62 hôtes utilisables ; /27 n\'en a que 30.' }
		]
	}
];
