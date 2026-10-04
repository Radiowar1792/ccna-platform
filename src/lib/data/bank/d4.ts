// Banque de questions originales — Domaine 4.0 IP Services (10 % de l'examen).
import type { SeedQuestion } from '../questions';

const q = (key: string, topic: string, stem: string, options: string[], answer: number[], explanation: string): SeedQuestion => ({ key, topic, stem, options, answer, explanation });

export const BANK_D4: SeedQuestion[] = [
	// 4.1 NAT
	q('b4-001', '4.1', 'Refer to the exhibit.\n\nR1# show ip nat translations\nPro  Inside global       Inside local        Outside local      Outside global\ntcp  203.0.113.5:1025   192.168.1.10:51000  8.8.8.8:443        8.8.8.8:443\ntcp  203.0.113.5:1026   192.168.1.11:51000  8.8.8.8:443        8.8.8.8:443\n\nWhich type of NAT is used?', ['Static NAT', 'Dynamic NAT with a pool', 'PAT (NAT overload)', 'NAT64'], [2], 'Plusieurs adresses internes partagent la même IP publique avec des ports différents : PAT.'),
	q('b4-002', '4.1', 'In the same exhibit, which is the inside local address of the first host?', ['203.0.113.5', '192.168.1.10', '8.8.8.8', '192.168.1.11'], [1], 'Inside local = l\'adresse privée réelle de l\'hôte interne.'),
	q('b4-003', '4.1', 'Which two interface commands are required for NAT to work? (Choose two.)', ['ip nat inside', 'ip nat outside', 'ip nat pool', 'ip nat enable', 'ip nat translate'], [0, 1], 'On marque l\'interface côté LAN inside et l\'interface côté Internet outside.'),
	q('b4-004', '4.1', 'Dynamic NAT is configured with a pool of 4 public addresses. A fifth inside host tries to reach the Internet while 4 translations are active. What happens?', ['It shares an address using ports', 'Its traffic is dropped until an address is free', 'It uses the interface address', 'It is routed without NAT'], [1], 'NAT dynamique sans overload : 1 IP publique par hôte ; pool épuisé = trafic bloqué.'),
	q('b4-005', '4.1', 'Which command clears all dynamic NAT translations?', ['clear ip nat translation *', 'no ip nat', 'reset nat', 'clear nat all'], [0], 'clear ip nat translation *.'),
	q('b4-006', '4.1', 'What is the "outside global" address?', ['The public IP of the inside host', 'The real IP of the outside host as seen on the Internet', 'The private IP of the outside host', 'The router loopback'], [1], 'Outside global = l\'adresse réelle de l\'hôte externe (le serveur Internet).'),
	q('b4-007', '4.1', 'Which command configures PAT using the IP address of interface G0/1?', ['ip nat inside source list 1 pool G0/1', 'ip nat inside source list 1 interface g0/1 overload', 'ip nat outside source list 1 interface g0/1', 'ip nat overload g0/1'], [1], 'ip nat inside source list <ACL> interface <int> overload.'),

	// 4.2 NTP
	q('b4-008', '4.2', 'Which command makes a router act as an authoritative NTP source without an external server?', ['ntp server 127.0.0.1', 'ntp master', 'ntp source loopback0', 'clock set'], [1], 'ntp master fait du routeur une source d\'heure de référence (stratum 8 par défaut).'),
	q('b4-009', '4.2', 'A router is configured with "ntp server 10.1.1.1", and 10.1.1.1 is stratum 2. What stratum will the router have?', ['1', '2', '3', '16'], [2], 'Le client a le stratum du serveur + 1.'),
	q('b4-010', '4.2', 'What does stratum 16 mean?', ['Very accurate', 'Unsynchronized', 'GPS reference', 'Peer mode'], [1], 'Stratum 16 = non synchronisé.'),
	q('b4-011', '4.2', 'Which command verifies whether a router is synchronized with NTP?', ['show ntp status', 'show clock detail only', 'show ntp server', 'debug ntp all'], [0], 'show ntp status indique « Clock is synchronized » et le stratum ; show ntp associations liste les serveurs.'),
	q('b4-012', '4.2', 'Why is accurate time important on network devices? (Choose two.)', ['Correlating log messages', 'Increasing bandwidth', 'Validating certificates', 'Electing the STP root', 'Assigning VLANs'], [0, 2], 'Horodatage des logs et validité des certificats.'),

	// 4.3 DHCP and DNS
	q('b4-013', '4.3', 'Which DHCP message does the client send as a broadcast to find servers?', ['DHCPOFFER', 'DHCPDISCOVER', 'DHCPACK', 'DHCPRELEASE'], [1], 'Le client sans adresse envoie un DHCPDISCOVER en broadcast.'),
	q('b4-014', '4.3', 'Which command prevents a Cisco DHCP server from handing out 10.1.1.1 to 10.1.1.20?', ['ip dhcp pool exclude 10.1.1.1 10.1.1.20', 'ip dhcp excluded-address 10.1.1.1 10.1.1.20', 'no ip dhcp 10.1.1.1 10.1.1.20', 'network 10.1.1.21 255.255.255.0'], [1], 'ip dhcp excluded-address <début> <fin>, en configuration globale.'),
	q('b4-015', '4.3', 'Which DNS record type maps an IP address back to a name?', ['A', 'CNAME', 'PTR', 'MX'], [2], 'PTR = résolution inverse (IP → nom).'),
	q('b4-016', '4.3', 'Which DNS record identifies the mail server for a domain?', ['A', 'MX', 'NS', 'TXT'], [1], 'MX = Mail Exchanger.'),
	q('b4-017', '4.3', 'A host resolves names correctly but very slowly. The first DNS server in its list is down. What happens?', ['The host never resolves names', 'The host waits for a timeout, then queries the second server', 'The host uses the default gateway as DNS', 'The host broadcasts DNS queries'], [1], 'Le client attend l\'expiration puis essaie le serveur suivant : lenteur.'),
	q('b4-018', '4.3', 'Which command shows the DHCP leases given by a Cisco router?', ['show ip dhcp binding', 'show dhcp lease', 'show ip dhcp pool only', 'show ip interface dhcp'], [0], 'show ip dhcp binding liste les adresses attribuées.'),
	q('b4-019', '4.3', 'Which DHCP pool command sets the default gateway for clients?', ['default-gateway', 'default-router', 'ip default-gateway', 'gateway'], [1], 'Dans le pool : default-router <IP>.'),

	// 4.4 SNMP
	q('b4-020', '4.4', 'Which SNMP operation does the manager use to change a value on the agent?', ['Get', 'Set', 'Trap', 'Inform'], [1], 'Set modifie une valeur ; Get la lit.'),
	q('b4-021', '4.4', 'What identifies each variable in a MIB?', ['A VLAN ID', 'An OID (Object Identifier)', 'A MAC address', 'A community string'], [1], 'Chaque objet de la MIB a un OID unique.'),
	q('b4-022', '4.4', 'Which SNMPv3 security level provides authentication and encryption?', ['noAuthNoPriv', 'authNoPriv', 'authPriv', 'community'], [2], 'authPriv = authentification + chiffrement.'),
	q('b4-023', '4.4', 'What is a weakness of SNMPv2c?', ['It cannot send traps', 'The community string is sent in clear text', 'It uses TCP only', 'It has no Get operation'], [1], 'v1/v2c : community string en clair.'),

	// 4.5 Syslog
	q('b4-024', '4.5', 'Refer to the exhibit.\n\n*Oct  5 08:12:44: %LINEPROTO-5-UPDOWN: Line protocol on Interface Gi0/1, changed state to down\n\nWhat is the severity level of this message?', ['1 – Alert', '3 – Error', '5 – Notification', '7 – Debugging'], [2], 'Le chiffre après le nom de la facility (LINEPROTO-5) est la sévérité : 5 = notification.'),
	q('b4-025', '4.5', 'Which logging destination keeps messages in the router\'s RAM?', ['logging console', 'logging buffered', 'logging host', 'logging monitor'], [1], 'logging buffered stocke en mémoire (show logging).'),
	q('b4-026', '4.5', 'An admin connected with SSH does not see log messages. Which command shows them in the current session?', ['logging console', 'terminal monitor', 'logging synchronous', 'show logging console'], [1], 'Les sessions VTY ne voient les logs qu\'après terminal monitor.'),
	q('b4-027', '4.5', 'Which severity level is "critical"?', ['0', '1', '2', '3'], [2], '0 emergency, 1 alert, 2 critical, 3 error.'),
	q('b4-028', '4.5', 'Which command adds timestamps with milliseconds to log messages?', ['service timestamps log datetime msec', 'logging timestamps', 'clock timestamps msec', 'logging datetime'], [0], 'service timestamps log datetime msec.'),

	// 4.6 DHCP client and relay
	q('b4-029', '4.6', 'Which command makes a router interface get its IP address from a DHCP server?', ['ip address dhcp', 'ip dhcp client', 'dhcp enable', 'ip address auto'], [0], 'ip address dhcp sur l\'interface (souvent côté FAI).'),
	q('b4-030', '4.6', 'On which interface should "ip helper-address" be configured?', ['The interface facing the DHCP server', 'The interface where the DHCP clients are', 'Any loopback', 'The console line'], [1], 'Sur l\'interface (ou SVI) qui reçoit les broadcasts des clients.'),
	q('b4-031', '4.6', 'When a router relays a DHCP request, which address does it put in the giaddr field?', ['The DHCP server IP', 'The IP of the interface that received the client request', 'The client MAC', '0.0.0.0'], [1], 'giaddr = IP de l\'interface côté clients : le serveur sait ainsi dans quel pool choisir.'),

	// 4.7 QoS
	q('b4-032', '4.7', 'Which QoS tool assigns traffic to classes based on criteria such as ACLs or NBAR?', ['Marking', 'Classification', 'Policing', 'Shaping'], [1], 'La classification identifie le trafic ; le marking écrit ensuite une valeur.'),
	q('b4-033', '4.7', 'Which queuing method gives voice a strict-priority queue while other classes share bandwidth?', ['FIFO', 'Round robin', 'LLQ (Low Latency Queuing)', 'WRED'], [2], 'LLQ = CBWFQ + une file prioritaire stricte pour la voix.'),
	q('b4-034', '4.7', 'What does WRED do?', ['Drops some lower-priority packets early to avoid queue overflow', 'Encrypts queues', 'Marks voice packets EF', 'Shapes traffic to the CIR'], [0], 'WRED jette aléatoirement certains paquets avant que la file soit pleine (congestion avoidance).'),
	q('b4-035', '4.7', 'How many bits is the DSCP field?', ['3', '6', '8', '12'], [1], 'DSCP = 6 bits (64 valeurs). CoS = 3 bits.'),
	q('b4-036', '4.7', 'Which AF class has the highest drop probability?', ['AF41', 'AF43', 'AF11', 'AF21'], [1], 'AFxy : x = classe, y = probabilité de rejet (3 = la plus forte).'),
	q('b4-037', '4.7', 'Where is the trust boundary usually placed in a network with Cisco IP phones?', ['At the core router', 'At the IP phone', 'At the Internet edge', 'At the DHCP server'], [1], 'On fait confiance au marquage du téléphone IP, pas à celui du PC derrière.'),

	// 4.8 SSH
	q('b4-038', '4.8', 'Which minimum RSA key size is required for SSH version 2 on Cisco IOS?', ['512 bits', '768 bits', '1024 bits', '4096 bits'], [1], 'SSHv2 exige au moins 768 bits ; on utilise 2048 en pratique.'),
	q('b4-039', '4.8', 'Which command shows active SSH sessions on the device?', ['show ssh', 'show ip ssh', 'show users', 'show line ssh'], [0], 'show ssh liste les sessions ; show ip ssh affiche version et paramètres.'),

	// 4.9 TFTP / FTP
	q('b4-040', '4.9', 'Which two statements about FTP are true? (Choose two.)', ['It uses TCP', 'It uses separate control and data connections', 'It uses UDP port 69', 'It has no authentication', 'It is used only for IPv6'], [0, 1], 'FTP : TCP, connexion de contrôle (21) et de données (20 en actif).'),
	q('b4-041', '4.9', 'Which command copies the running configuration to a TFTP server?', ['copy running-config tftp:', 'copy tftp: running-config', 'write tftp', 'save tftp running'], [0], 'copy <source> <destination> : copy running-config tftp:.'),
	q('b4-042', '4.9', 'Why is TFTP considered insecure?', ['It uses TCP', 'It has no authentication or encryption', 'It needs a password', 'It uses port 22'], [1], 'TFTP : aucune authentification ni chiffrement.')
];
