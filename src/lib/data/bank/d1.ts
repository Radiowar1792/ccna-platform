// Banque de questions originales — Domaine 1.0 Network Fundamentals (20 % de l'examen).
import type { SeedQuestion } from '../questions';

const q = (key: string, topic: string, stem: string, options: string[], answer: number[], explanation: string): SeedQuestion => ({ key, topic, stem, options, answer, explanation });

export const BANK_D1: SeedQuestion[] = [
	// 1.1 Network components
	q('b1-001', '1.1', 'Which device makes forwarding decisions based on destination MAC addresses?', ['Router', 'Layer 2 switch', 'Firewall', 'Access point controller'], [1], 'Le switch L2 commute les trames selon la MAC de destination et sa MAC address table.'),
	q('b1-002', '1.1', 'Which two functions are typical of a next-generation firewall (NGFW)? (Choose two.)', ['Application visibility and control', 'Spanning Tree root election', 'Intrusion prevention (IPS)', 'DHCP relay only', 'Frame flooding'], [0, 2], 'Un NGFW ajoute au filtrage classique la reconnaissance des applications (AVC) et un IPS intégré.'),
	q('b1-003', '1.1', 'What is the main role of an IPS?', ['Assign IP addresses', 'Detect and block malicious traffic inline', 'Translate private addresses', 'Provide wireless access'], [1], 'L\'IPS est placé en coupure (inline) et bloque le trafic qui correspond à des signatures d\'attaque.'),
	q('b1-004', '1.1', 'Which device type is a Wireless LAN Controller (WLC)?', ['A device that centrally manages lightweight APs', 'A router that connects to the ISP', 'A firewall for wireless clients only', 'A PoE injector'], [0], 'Le WLC gère de façon centralisée les AP lightweight (configuration, roaming, sécurité).'),
	q('b1-005', '1.1', 'What does PoE allow a switch to do?', ['Route between VLANs', 'Provide electrical power over the Ethernet cable', 'Encrypt traffic', 'Increase link speed to 10 Gbps'], [1], 'Power over Ethernet : le switch (PSE) alimente l\'équipement (PD) par le câble réseau.'),
	q('b1-006', '1.1', 'Which devices are typically powered with PoE? (Choose two.)', ['IP phones', 'Core routers', 'Access points', 'Rack servers', 'Laptops on battery'], [0, 2], 'Téléphones IP, AP et caméras IP sont les équipements PoE classiques.'),
	q('b1-007', '1.1', 'What is an endpoint in a network?', ['A device that only forwards traffic', 'A device where data originates or is consumed, like a PC or phone', 'The last router before the Internet', 'A switch port in shutdown'], [1], 'Un endpoint est un équipement terminal qui produit ou consomme les données.'),
	q('b1-008', '1.1', 'A Layer 3 switch can do which two things? (Choose two.)', ['Switch frames inside a VLAN', 'Route packets between VLANs', 'Only connect to the WAN', 'Replace all firewalls', 'Work only as a hub'], [0, 1], 'Un switch L3 commute en couche 2 et route en couche 3 (SVI, routed ports).'),

	// 1.2 Topologies
	q('b1-009', '1.2', 'In a three-tier campus design, which layer connects the distribution blocks together at high speed?', ['Access', 'Distribution', 'Core', 'Edge'], [2], 'La couche cœur (core) relie rapidement les blocs de distribution.'),
	q('b1-010', '1.2', 'A small company merges the core and distribution layers. What is this design called?', ['Spine-leaf', 'Collapsed core (two-tier)', 'Full mesh WAN', 'Hub and spoke'], [1], 'Collapsed core = conception à deux niveaux.'),
	q('b1-011', '1.2', 'Which statement about a spine-leaf design is correct?', ['Leaf switches connect to all spine switches', 'Spine switches connect to end hosts', 'Leaf switches connect to each other in a ring', 'It is mainly used for SOHO networks'], [0], 'Chaque leaf est relié à chaque spine, ce qui donne un nombre de sauts constant entre serveurs.'),
	q('b1-012', '1.2', 'What is a typical characteristic of a SOHO network?', ['Many redundant core switches', 'One device that combines router, switch, firewall and AP', 'MPLS between hundreds of sites', 'Spine-leaf fabric'], [1], 'En SOHO, un seul boîtier (box) fait routeur, switch, pare-feu et Wi-Fi.'),
	q('b1-013', '1.2', 'Which is a benefit of an on-premises deployment compared to public cloud?', ['No hardware to buy', 'Full control over the hardware and data location', 'Unlimited instant scaling', 'No maintenance'], [1], 'On-premises : on contrôle le matériel et la localisation des données, mais on doit tout acheter et maintenir.'),
	q('b1-014', '1.2', 'In a hub-and-spoke WAN, how do two branch sites usually communicate?', ['Directly through a full mesh', 'Through the central hub site', 'Only through the Internet without routing', 'They cannot communicate'], [1], 'Dans un hub-and-spoke, le trafic entre sites passe par le hub central.'),

	// 1.3 Cabling
	q('b1-015', '1.3', 'Which fiber type is used for the longest distances?', ['Multimode fiber', 'Single-mode fiber', 'Cat 6 UTP', 'Coaxial'], [1], 'La fibre monomode (single-mode) a un cœur fin et un laser : elle va le plus loin.'),
	q('b1-016', '1.3', 'What is the maximum standard length of a 1000BASE-T copper link?', ['55 m', '100 m', '185 m', '550 m'], [1], 'Ethernet sur paire torsadée : 100 m maximum.'),
	q('b1-017', '1.3', 'Which two statements about multimode fiber are true? (Choose two.)', ['It has a larger core than single-mode', 'It reaches longer distances than single-mode', 'It often uses cheaper LED or VCSEL light sources', 'It carries electrical signals', 'It cannot be used in a LAN'], [0, 2], 'Multimode : cœur plus large, sources lumineuses moins chères, distances plus courtes.'),
	q('b1-018', '1.3', 'Which cable type should connect two switch ports if Auto MDI-X is disabled?', ['Straight-through', 'Crossover', 'Rollover', 'Console'], [1], 'Équipements similaires (switch-switch) sans Auto MDI-X : câble croisé.'),
	q('b1-019', '1.3', 'Which cable connects a PC serial/USB port to the console port of a Cisco switch?', ['Crossover', 'Straight-through', 'Rollover (console) cable', 'Fiber patch cable'], [2], 'Le câble console (rollover) sert à l\'accès console.'),
	q('b1-020', '1.3', 'What is the main difference between shared media and point-to-point Ethernet?', ['Shared media uses fiber only', 'On shared media, devices compete for the same medium and collisions can occur', 'Point-to-point links always use half duplex', 'Shared media is faster'], [1], 'Sur un média partagé (hub, Wi-Fi) les équipements se partagent le support : collisions possibles. En point à point full duplex, aucune.'),

	// 1.4 Interface and cable issues
	q('b1-021', '1.4', 'An interface counter shows many CRC errors. What is the most likely cause?', ['Wrong VLAN', 'Physical problem such as a bad cable or interference', 'Missing default route', 'Too many MAC addresses'], [1], 'Des erreurs CRC indiquent des trames abîmées : souvent câble, connecteur ou interférences.'),
	q('b1-022', '1.4', 'One side of a link is set to 100/full and the other to auto. The auto side cannot detect duplex. What duplex does it choose for 100 Mbps?', ['Full', 'Half', 'It shuts the port down', 'It copies the neighbor setting'], [1], 'Si l\'autonégociation échoue à 10 ou 100 Mb/s, le côté auto choisit half duplex : duplex mismatch.'),
	q('b1-023', '1.4', 'Refer to the exhibit.\n\nSW1# show interfaces g0/1\nGigabitEthernet0/1 is up, line protocol is up\n  Full-duplex, 1000Mb/s\n  0 runts, 0 giants\n  2381 input errors, 2381 CRC\n\nWhat should the engineer check first?', ['The VLAN configuration', 'The cable and connectors', 'The routing table', 'The STP root bridge'], [1], 'Erreurs CRC avec duplex correct : on vérifie d\'abord la couche physique (câble).'),
	q('b1-024', '1.4', 'What is a runt frame?', ['A frame larger than 1518 bytes', 'A frame smaller than 64 bytes', 'A frame with a VLAN tag', 'A broadcast frame'], [1], 'Runt = trame trop petite (< 64 octets), souvent liée aux collisions.'),
	q('b1-025', '1.4', 'Which interface status means the port was disabled with the "shutdown" command?', ['up/down', 'down/down', 'administratively down/down', 'up/up'], [2], 'administratively down = shutdown configuré.'),
	q('b1-026', '1.4', 'An interface is "up/down". Which is a likely cause?', ['The interface is shut down', 'Layer 1 is fine but a Layer 2 problem exists, such as keepalive or encapsulation mismatch', 'The cable is unplugged', 'The interface has no IP address'], [1], 'up/down : le physique fonctionne mais le protocole de ligne non (encapsulation, keepalives…). Câble débranché = down/down.'),

	// 1.5 TCP vs UDP
	q('b1-027', '1.5', 'Which TCP flags are used to start a connection?', ['FIN, ACK', 'SYN, SYN-ACK, ACK', 'RST, ACK', 'PSH, URG'], [1], 'Three-way handshake : SYN, SYN-ACK, ACK.'),
	q('b1-028', '1.5', 'What does TCP windowing provide?', ['Encryption', 'Flow control', 'Name resolution', 'Address translation'], [1], 'Le fenêtrage TCP contrôle la quantité de données envoyées avant un accusé : flow control.'),
	q('b1-029', '1.5', 'Which application commonly uses UDP?', ['HTTPS web browsing', 'SSH', 'VoIP voice (RTP)', 'FTP file transfer'], [2], 'La voix (RTP) utilise UDP : un paquet en retard est inutile, mieux vaut ne pas le renvoyer.'),
	q('b1-030', '1.5', 'What is the size of the UDP header?', ['8 bytes', '20 bytes', '32 bytes', '64 bytes'], [0], 'En-tête UDP = 8 octets (TCP = 20 minimum).'),
	q('b1-031', '1.5', 'Which port numbers are well-known ports?', ['0 to 1023', '1024 to 49151', '49152 to 65535', '1 to 255'], [0], 'Well-known : 0–1023. Registered : 1024–49151. Dynamic/ephemeral : 49152–65535.'),
	q('b1-032', '1.5', 'A client opens a web session to a server. Which source port does the client usually use?', ['80', '443', 'A random ephemeral port', '53'], [2], 'Le client utilise un port source éphémère aléatoire ; le port de destination est 80 ou 443.'),

	// 1.6 IPv4 and subnetting
	q('b1-033', '1.6', 'What is the network address of host 192.168.20.130/26?', ['192.168.20.64', '192.168.20.128', '192.168.20.130', '192.168.20.192'], [1], '/26 = blocs de 64 : 128–191. Réseau 192.168.20.128.'),
	q('b1-034', '1.6', 'What is the last usable host in 10.4.8.0/22?', ['10.4.8.254', '10.4.11.254', '10.4.11.255', '10.4.12.254'], [1], '/22 = blocs de 4 dans le 3e octet : 8–11. Broadcast 10.4.11.255, dernier hôte 10.4.11.254.'),
	q('b1-035', '1.6', 'Which mask gives at least 500 hosts per subnet with the least waste?', ['255.255.254.0', '255.255.252.0', '255.255.255.0', '255.255.248.0'], [0], '/23 = 2^9 − 2 = 510 hôtes. /24 n\'en a que 254.'),
	q('b1-036', '1.6', 'How many /28 subnets can be created from 192.168.1.0/24?', ['8', '14', '16', '32'], [2], '4 bits empruntés (24 → 28) : 2^4 = 16 sous-réseaux.'),
	q('b1-037', '1.6', 'Which two addresses are usable host addresses in the same subnet as 172.16.45.67/27? (Choose two.)', ['172.16.45.64', '172.16.45.70', '172.16.45.94', '172.16.45.96', '172.16.45.31'], [1, 2], '/27 = blocs de 32 : sous-réseau .64 à .95. Hôtes utilisables .65 à .94. .64 est l\'adresse réseau, .96 et .31 sont dans d\'autres sous-réseaux.'),
	q('b1-038', '1.6', 'What is the broadcast address of 10.10.10.10/29?', ['10.10.10.7', '10.10.10.15', '10.10.10.16', '10.10.10.255'], [1], '/29 = blocs de 8 : 8–15. Broadcast 10.10.10.15.'),
	q('b1-039', '1.6', 'A host has IP 192.168.5.40/28. The default gateway uses the first usable address of the subnet. What is the gateway address?', ['192.168.5.1', '192.168.5.32', '192.168.5.33', '192.168.5.47'], [2], '/28 = blocs de 16 : sous-réseau .32 à .47. Premier hôte .33.'),
	q('b1-040', '1.6', 'Which prefix length corresponds to the mask 255.255.255.248?', ['/27', '/28', '/29', '/30'], [2], '248 = 11111000 : 24 + 5 = /29.'),
	q('b1-041', '1.6', 'How many usable host addresses does a /31 point-to-point link provide (RFC 3021)?', ['0', '1', '2', '4'], [2], 'En /31 sur lien point à point, les 2 adresses sont utilisables (pas de réseau ni broadcast).'),

	// 1.7 Private IPv4
	q('b1-042', '1.7', 'Which address range is private according to RFC 1918?', ['172.15.0.0/16', '172.16.0.0/12', '192.0.2.0/24', '100.64.0.0/10'], [1], 'RFC 1918 : 10/8, 172.16/12, 192.168/16. 100.64/10 est le CGNAT (RFC 6598), 192.0.2.0/24 la documentation.'),
	q('b1-043', '1.7', 'Why do companies use private IPv4 addresses?', ['They are faster', 'They save public IPv4 addresses, with NAT for Internet access', 'They are required for IPv6', 'They encrypt traffic'], [1], 'Les adresses privées économisent les IPv4 publiques ; le NAT permet de sortir sur Internet.'),
	q('b1-044', '1.7', 'Which address is NOT private?', ['10.255.1.1', '172.31.200.1', '192.168.100.1', '172.32.1.1'], [3], '172.16.0.0/12 s\'arrête à 172.31.255.255 : 172.32.1.1 est public.'),
	q('b1-045', '1.7', 'A host gets the address 169.254.12.34. What does this usually mean?', ['It got an address from DHCP', 'It could not reach a DHCP server and used APIPA', 'It is a loopback address', 'It is a private RFC 1918 address'], [1], '169.254.0.0/16 = APIPA (link-local IPv4) : le DHCP n\'a pas répondu.'),

	// 1.8 / 1.9 IPv6
	q('b1-046', '1.8', 'What is the shortest valid form of 2001:0db8:0000:0000:0000:0000:0000:0100?', ['2001:db8::100', '2001:db8::1', '2001:db8:0:0::0100', '2001:db8::0:100'], [0], 'On retire les zéros de tête et on remplace la plus longue suite de zéros par :: → 2001:db8::100.'),
	q('b1-047', '1.8', 'What is the standard prefix length for an IPv6 LAN subnet?', ['/48', '/56', '/64', '/128'], [2], 'Un LAN IPv6 est un /64 (nécessaire pour SLAAC).'),
	q('b1-048', '1.8', 'A company receives 2001:db8:abcd::/48. How many /64 subnets can it create?', ['256', '4096', '65,536', '16 million'], [2], '64 − 48 = 16 bits de sous-réseau : 2^16 = 65 536.'),
	q('b1-049', '1.9', 'Which IPv6 address type begins with FE80?', ['Global unicast', 'Link-local', 'Unique local', 'Multicast'], [1], 'FE80::/10 = link-local.'),
	q('b1-050', '1.9', 'Which multicast address represents all IPv6 routers on a link?', ['FF02::1', 'FF02::2', 'FF02::5', 'FF02::A'], [1], 'FF02::1 = tous les nœuds, FF02::2 = tous les routeurs, FF02::5 = routeurs OSPFv3.'),
	q('b1-051', '1.9', 'What is the modified EUI-64 interface ID for MAC 00AA.BBCC.DDEE?', ['02AA:BBFF:FECC:DDEE', '00AA:BBFF:FECC:DDEE', '02AA:BBCC:FFFE:DDEE', 'FEAA:BBFF:FFCC:DDEE'], [0], 'On coupe la MAC, on insère FFFE, on inverse le 7e bit : 00 → 02.'),
	q('b1-052', '1.9', 'What is an anycast address?', ['An address shared by all hosts on a link', 'A unicast address assigned to several devices; packets go to the nearest one', 'A link-local address', 'An IPv4-mapped address'], [1], 'Anycast : la même adresse sur plusieurs équipements, le routage envoie au plus proche.'),
	q('b1-053', '1.9', 'Which prefix identifies IPv6 unique local addresses?', ['FC00::/7', 'FE80::/10', '2000::/3', 'FF00::/8'], [0], 'Unique local = FC00::/7 (FD00::/8 en pratique).'),

	// 1.10 Client OS IP parameters
	q('b1-054', '1.10', 'Which Windows command shows the IP address, mask, default gateway and DNS servers?', ['ipconfig', 'ipconfig /all', 'netstat -r', 'arp -a'], [1], 'ipconfig /all affiche aussi les serveurs DNS et l\'adresse MAC.'),
	q('b1-055', '1.10', 'Which command shows the IP addresses on a modern Linux host?', ['ip address', 'ipconfig /all', 'show ip interface brief', 'getmac'], [0], 'Sous Linux : ip address (ou ip a). ifconfig est l\'ancienne commande.'),
	q('b1-056', '1.10', 'On macOS, which command displays interface IP settings in the terminal?', ['ifconfig', 'ipconfig /all', 'show interfaces', 'nslookup'], [0], 'macOS utilise ifconfig (et networksetup).'),
	q('b1-057', '1.10', 'A PC can ping its default gateway but cannot ping 8.8.8.8. Its IP, mask and DNS settings are correct. Where is the problem most likely?', ['PC DNS settings', 'Routing or NAT beyond the default gateway', 'PC subnet mask', 'PC MAC address'], [1], 'La passerelle répond mais pas Internet, même par IP : le problème est après la passerelle (routage, NAT, FAI).'),
	q('b1-058', '1.10', 'A PC can ping 8.8.8.8 but cannot open www.cisco.com. Which setting should you check first?', ['Default gateway', 'DNS server', 'Subnet mask', 'Duplex'], [1], 'Le ping par IP marche, la résolution de nom non : DNS.'),

	// 1.11 Wireless principles
	q('b1-059', '1.11', 'Which frequency band offers the most non-overlapping channels?', ['2.4 GHz', '5 GHz', '900 MHz', 'They all have 3'], [1], 'La bande 5 GHz offre beaucoup plus de canaux sans chevauchement que la 2,4 GHz (1, 6, 11).'),
	q('b1-060', '1.11', 'What does the SSID identify?', ['The AP\'s MAC address', 'The name of the wireless LAN', 'The encryption key', 'The channel'], [1], 'Le SSID est le nom du réseau sans fil.'),
	q('b1-061', '1.11', 'Why does 2.4 GHz usually have a longer range than 5 GHz?', ['It uses more power', 'Lower frequencies go through walls and obstacles better', 'It uses wider channels', 'It is full duplex'], [1], 'Les fréquences plus basses s\'atténuent moins et traversent mieux les obstacles.'),
	q('b1-062', '1.11', 'What is the BSSID?', ['The network name', 'The MAC address of the AP radio for a BSS', 'The VLAN of the WLAN', 'The RADIUS server address'], [1], 'BSSID = adresse MAC de la radio de l\'AP qui identifie le BSS.'),

	// 1.12 Virtualization
	q('b1-063', '1.12', 'What does a hypervisor do?', ['Routes packets between VLANs', 'Creates and runs virtual machines on physical hardware', 'Encrypts disks', 'Provides DHCP'], [1], 'L\'hyperviseur partage le matériel entre plusieurs VM.'),
	q('b1-064', '1.12', 'Which statement best describes containers compared with VMs?', ['Each container includes a full guest OS kernel', 'Containers share the host OS kernel and are lighter', 'Containers need a Type 2 hypervisor', 'Containers cannot run applications'], [1], 'Les conteneurs partagent le noyau de l\'hôte : démarrage rapide, faible empreinte.'),
	q('b1-065', '1.12', 'Which feature lets two customers use the same IP subnet on one router without conflict?', ['VLAN', 'VRF', 'HSRP', 'NAT64'], [1], 'Chaque VRF a sa propre table de routage : les adresses peuvent se chevaucher.'),
	q('b1-066', '1.12', 'In a virtualized server, how do VMs usually connect to the physical network?', ['Directly to the router', 'Through a virtual switch in the hypervisor', 'Through the console port', 'They cannot use the network'], [1], 'Les vNIC des VM se branchent sur un vSwitch de l\'hyperviseur, relié aux cartes physiques.'),

	// 1.13 Switching concepts
	q('b1-067', '1.13', 'What is the default MAC address aging time on Cisco switches?', ['60 seconds', '300 seconds', '600 seconds', '3600 seconds'], [1], 'Les entrées dynamiques expirent après 300 s sans trafic.'),
	q('b1-068', '1.13', 'A switch receives a broadcast frame on port Fa0/1 in VLAN 10. What does it do?', ['Drops it', 'Sends it out all ports in VLAN 10 except Fa0/1', 'Sends it to the router only', 'Sends it out all ports in all VLANs'], [1], 'Le broadcast est inondé dans le VLAN, sauf sur le port d\'entrée.'),
	q('b1-069', '1.13', 'A switch receives a frame whose destination MAC is on the same port the frame came in. What does it do?', ['Floods it', 'Forwards it back on the same port', 'Filters (drops) it', 'Sends it to the CPU'], [2], 'Destination connue sur le port d\'entrée : le switch filtre la trame.'),
	q('b1-070', '1.13', 'Which command displays the MAC addresses learned by a switch?', ['show arp', 'show mac address-table', 'show ip route', 'show interfaces status'], [1], 'show mac address-table.')
];
