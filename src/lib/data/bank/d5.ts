// Banque de questions originales — Domaine 5.0 Security Fundamentals (15 % de l'examen).
import type { SeedQuestion } from '../questions';

const q = (key: string, topic: string, stem: string, options: string[], answer: number[], explanation: string): SeedQuestion => ({ key, topic, stem, options, answer, explanation });

export const BANK_D5: SeedQuestion[] = [
	// 5.1 Key concepts
	q('b5-001', '5.1', 'What is a vulnerability?', ['A weakness that could be used to compromise a system', 'A tool used to attack a system', 'The person who attacks', 'A security control'], [0], 'Vulnérabilité = faiblesse. Exploit = moyen de l\'utiliser. Menace = danger potentiel.'),
	q('b5-002', '5.1', 'An attacker sends small requests with a spoofed source IP to many servers, and the large replies flood the victim. What is this attack?', ['Reflection and amplification', 'MAC flooding', 'Phishing', 'Brute force'], [0], 'Réflexion (IP source usurpée = victime) + amplification (réponses bien plus grosses), ex. DNS ou NTP.'),
	q('b5-003', '5.1', 'Which attack sends emails that look legitimate to trick users into giving their password?', ['Vishing', 'Phishing', 'Tailgating', 'Smishing'], [1], 'Phishing par e-mail ; vishing par téléphone ; smishing par SMS.'),
	q('b5-004', '5.1', 'Which attack fills a switch MAC address table so that it floods all frames?', ['ARP spoofing', 'MAC flooding', 'DHCP starvation', 'VLAN hopping'], [1], 'MAC flooding : la table CAM pleine, le switch inonde tout (comme un hub). Contre-mesure : port security.'),
	q('b5-005', '5.1', 'What is a man-in-the-middle attack?', ['An attacker intercepts and possibly changes traffic between two parties', 'An attacker floods a server', 'An attacker guesses passwords', 'A virus that spreads by USB'], [0], 'L\'attaquant se place entre deux équipements (ARP spoofing, faux DHCP…).'),
	q('b5-006', '5.1', 'Which type of malware spreads by itself through the network without user action?', ['Virus', 'Worm', 'Trojan horse', 'Spyware'], [1], 'Le ver (worm) se propage seul ; le virus a besoin d\'un fichier hôte et d\'une action.'),
	q('b5-007', '5.1', 'What is the goal of a DoS attack?', ['Steal data', 'Make a service unavailable', 'Read encrypted traffic', 'Change routing tables only'], [1], 'DoS vise la disponibilité (le A de la triade CIA).'),

	// 5.2 Security programs
	q('b5-008', '5.2', 'Which is an example of a user awareness program?', ['Installing a firewall', 'Sending fake phishing emails to test employees', 'Configuring port security', 'Encrypting disks'], [1], 'Les campagnes de phishing simulé sensibilisent les utilisateurs.'),
	q('b5-009', '5.2', 'Which is a physical access control?', ['Badge readers on the server room door', 'ACL on the router', 'SSH on VTY lines', 'WPA3'], [0], 'Contrôle d\'accès physique : badges, serrures, caméras.'),
	q('b5-010', '5.2', 'What is the main goal of security training for IT staff?', ['Teaching them specific skills to secure systems', 'Reducing salaries', 'Replacing firewalls', 'Making users click faster'], [0], 'La formation (training) apporte des compétences ; la sensibilisation (awareness) change les comportements.'),

	// 5.3 Local passwords
	q('b5-011', '5.3', 'Which command protects privileged EXEC mode with the strongest hashing by default on modern IOS?', ['enable password', 'enable secret', 'service password-encryption', 'line password'], [1], 'enable secret utilise un hash fort (MD5, ou SHA-256/scrypt avec algorithm-type).'),
	q('b5-012', '5.3', 'What does "service password-encryption" do?', ['Hashes all passwords with SHA-256', 'Applies weak type 7 encryption to plain-text passwords in the config', 'Encrypts SSH sessions', 'Enables AAA'], [1], 'Type 7 : chiffrement faible, réversible. Il cache seulement les mots de passe à l\'écran.'),
	q('b5-013', '5.3', 'Both "enable password cisco" and "enable secret class" are configured. Which password works for enable mode?', ['cisco', 'class', 'Both', 'Neither'], [1], 'enable secret est prioritaire sur enable password.'),
	q('b5-014', '5.3', 'Which command protects the console line with a password?', ['line console 0 → password X → login', 'console password X', 'enable console X', 'line vty 0 4 → password X'], [0], 'Sous line console 0 : password <mdp> puis login.'),
	q('b5-015', '5.3', 'Which command disconnects an idle console session after 5 minutes?', ['exec-timeout 5 0', 'session-timeout 5', 'idle 5', 'logout 300'], [0], 'exec-timeout <minutes> <secondes> sur la ligne.'),

	// 5.4 Password policies, MFA, certificates
	q('b5-016', '5.4', 'Which combination is multi-factor authentication?', ['Password + security question', 'Fingerprint + PIN', 'Two different passwords', 'Username + password'], [1], 'Empreinte (ce que je suis) + PIN (ce que je sais) = deux catégories.'),
	q('b5-017', '5.4', 'What does a digital certificate prove?', ['That a public key belongs to a specific identity, signed by a CA', 'That a password is strong', 'That a device has PoE', 'That traffic is compressed'], [0], 'Le certificat lie une clé publique à une identité, signé par une autorité de certification (CA).'),
	q('b5-018', '5.4', 'Which is a good password policy practice?', ['Short passwords changed daily', 'Long passphrases, no reuse, MFA where possible', 'Same password on all devices', 'Passwords written on the device'], [1], 'Longueur, pas de réutilisation et MFA sont les recommandations actuelles.'),
	q('b5-019', '5.4', 'Which is an example of biometric authentication?', ['Smart card', 'Face recognition', 'One-time code', 'Password'], [1], 'Biométrie = ce que je suis (visage, empreinte).'),

	// 5.5 VPN
	q('b5-020', '5.5', 'Which IPsec protocol provides encryption?', ['AH', 'ESP', 'GRE', 'IKE only'], [1], 'ESP chiffre et authentifie ; AH authentifie seulement.'),
	q('b5-021', '5.5', 'Which VPN type is typically used by a teleworker with a client on a laptop?', ['Site-to-site', 'Remote-access', 'MPLS', 'DMVPN hub only'], [1], 'Le télétravailleur utilise un VPN d\'accès distant (client AnyConnect, TLS ou IPsec).'),
	q('b5-022', '5.5', 'Why is GRE often combined with IPsec?', ['GRE encrypts and IPsec routes', 'GRE carries multicast and routing protocols, IPsec adds encryption', 'GRE is faster than IPsec alone', 'IPsec cannot use the Internet'], [1], 'GRE transporte le multicast (protocoles de routage), IPsec chiffre.'),
	q('b5-023', '5.5', 'In a site-to-site VPN, which devices create the tunnel?', ['The end hosts', 'The VPN gateways (routers or firewalls) at each site', 'The DNS servers', 'The switches'], [1], 'Ce sont les passerelles des deux sites ; les hôtes n\'ont rien à configurer.'),

	// 5.6 ACL
	q('b5-024', '5.6', 'Refer to the exhibit.\n\naccess-list 10 permit 192.168.1.0 0.0.0.255\naccess-list 10 deny 192.168.1.50\n\nWhat happens to traffic from 192.168.1.50?', ['It is denied', 'It is permitted by the first line', 'It is denied by the implicit deny', 'The ACL is rejected'], [1], 'Première correspondance gagnante : la ligne 1 autorise déjà .50 ; la ligne 2 ne sert à rien. L\'ordre compte.'),
	q('b5-025', '5.6', 'Which wildcard mask matches all hosts in 10.0.0.0/8?', ['0.0.0.255', '0.255.255.255', '255.0.0.0', '0.0.255.255'], [1], 'Inverse de 255.0.0.0 = 0.255.255.255.'),
	q('b5-026', '5.6', 'Which extended ACL line permits only HTTPS from any host to server 10.1.1.10?', ['access-list 101 permit tcp any host 10.1.1.10 eq 443', 'access-list 101 permit udp any host 10.1.1.10 eq 443', 'access-list 101 permit tcp host 10.1.1.10 any eq 443', 'access-list 10 permit tcp any host 10.1.1.10 eq 443'], [0], 'protocole tcp, source any, destination host 10.1.1.10, port 443. Une ACL numéro 10 serait standard.'),
	q('b5-027', '5.6', 'How many ACLs can be applied to one interface?', ['One per interface', 'One per protocol, per direction, per interface', 'Unlimited', 'Two per router'], [1], 'Règle des 3 P : une ACL par protocole, par direction, par interface.'),
	q('b5-028', '5.6', 'Which feature of named ACLs makes editing easier?', ['They are faster', 'You can delete or insert a single line using sequence numbers', 'They do not need an implicit deny', 'They work only outbound'], [1], 'Les numéros de séquence permettent d\'insérer ou supprimer une entrée.'),
	q('b5-029', '5.6', 'Which wildcard matches the odd-numbered hosts 192.168.1.1, .3, .5 … .255?', ['192.168.1.1 0.0.0.254', '192.168.1.0 0.0.0.255', '192.168.1.1 0.0.0.1', '192.168.1.1 255.255.255.254'], [0], 'Le bit de poids faible doit valoir 1 (bit à 0 dans le wildcard), les autres sont libres : 0.0.0.254.'),
	q('b5-030', '5.6', 'An inbound extended ACL on R1 G0/0 has only "deny tcp any any eq 23". What happens to web traffic?', ['It is permitted', 'It is denied by the implicit deny any', 'It is permitted because it is not Telnet', 'It is logged'], [1], 'Il manque permit ip any any : tout le reste est bloqué par le deny implicite.'),
	q('b5-031', '5.6', 'Which command applies ACL 100 to filter traffic entering interface G0/1?', ['access-class 100 in', 'ip access-group 100 in', 'ip access-list 100 in', 'access-group 100 inbound'], [1], 'Sur une interface : ip access-group <ACL> in|out. access-class est pour les lignes VTY.'),

	// 5.7 Layer 2 security
	q('b5-032', '5.7', 'Refer to the exhibit.\n\nSW1# show port-security interface f0/5\nPort Security              : Enabled\nPort Status                : Secure-shutdown\nViolation Mode             : Shutdown\nMaximum MAC Addresses      : 1\nSecurity Violation Count   : 1\n\nWhat is the state of F0/5?', ['Forwarding normally', 'Err-disabled after a violation', 'In restrict mode', 'Waiting for a sticky MAC'], [1], 'Secure-shutdown : violation en mode shutdown, le port est err-disabled.'),
	q('b5-033', '5.7', 'How do you manually recover an err-disabled port after fixing the cause?', ['clear port-security', 'shutdown then no shutdown on the interface', 'reload the VLAN', 'no switchport port-security'], [1], 'shutdown puis no shutdown (ou errdisable recovery automatique).'),
	q('b5-034', '5.7', 'Which DHCP messages does DHCP snooping drop when they arrive on an untrusted port?', ['DHCPDISCOVER', 'DHCPOFFER and DHCPACK', 'DHCPREQUEST', 'All DHCP messages'], [1], 'Les messages de serveur (OFFER, ACK, NAK) sont refusés sur les ports untrusted.'),
	q('b5-035', '5.7', 'DAI is enabled for VLAN 10 but hosts with static IP addresses lose connectivity. Why?', ['DAI needs PortFast', 'Their IP/MAC bindings are not in the DHCP snooping table', 'DAI blocks all ARP', 'Their VLAN is wrong'], [1], 'Sans binding DHCP, DAI rejette leurs ARP : il faut une ARP ACL ou passer leurs ports en trust.'),
	q('b5-036', '5.7', 'Which feature limits the number of DHCP messages per second on an untrusted port?', ['ip dhcp snooping limit rate', 'storm-control', 'port-security maximum', 'ip arp inspection limit'], [0], 'ip dhcp snooping limit rate <pps>, contre la DHCP starvation.'),
	q('b5-037', '5.7', 'Which port security violation mode drops traffic silently, without a log or counter increase?', ['Shutdown', 'Restrict', 'Protect', 'Sticky'], [2], 'Protect : rejet silencieux.'),
	q('b5-038', '5.7', 'What must be configured before enabling port security on a port?', ['switchport mode access (or trunk) set statically', 'spanning-tree portfast', 'ip dhcp snooping trust', 'A VLAN SVI'], [0], 'Port security refuse les ports en mode dynamique (DTP).'),

	// 5.8 AAA
	q('b5-039', '5.8', 'In AAA, what does "authorization" control?', ['Who the user is', 'What the user is allowed to do', 'What the user did', 'How the user connects'], [1], 'Authentication = qui ; Authorization = quels droits ; Accounting = traçabilité.'),
	q('b5-040', '5.8', 'Which AAA protocol combines authentication and authorization and uses UDP?', ['TACACS+', 'RADIUS', 'Kerberos', 'SSH'], [1], 'RADIUS (UDP 1812/1813) combine authentification et autorisation ; TACACS+ les sépare.'),
	q('b5-041', '5.8', 'Which component of 802.1X is the switch in a wired network?', ['Supplicant', 'Authenticator', 'Authentication server', 'Certificate authority'], [1], 'Le switch est l\'authenticator ; le PC est le supplicant ; RADIUS est le serveur.'),
	q('b5-042', '5.8', 'What does "accounting" provide?', ['Encryption', 'Records of what users did and when', 'IP addressing', 'Load balancing'], [1], 'Accounting enregistre les actions (commandes, durée de session).'),

	// 5.9 / 5.10 Wireless security
	q('b5-043', '5.9', 'Which wireless security protocol is broken and must never be used?', ['WPA3', 'WPA2', 'WEP', 'WPA2-Enterprise'], [2], 'WEP est cassé depuis longtemps.'),
	q('b5-044', '5.9', 'Which WPA3 feature protects against offline dictionary attacks on the passphrase?', ['TKIP', 'SAE', 'WEP', 'MAC filtering'], [1], 'SAE remplace l\'échange PSK et résiste aux attaques par dictionnaire hors ligne.'),
	q('b5-045', '5.9', 'Which mode should a company with a RADIUS server use for employee Wi-Fi?', ['WPA2/WPA3-Personal', 'WPA2/WPA3-Enterprise (802.1X)', 'Open network', 'WEP'], [1], 'Enterprise : chaque utilisateur a ses identifiants, vérifiés par RADIUS.'),
	q('b5-046', '5.9', 'Which feature is mandatory in WPA3 and protects management frames?', ['PMF (Protected Management Frames)', 'WPS', 'TKIP', 'Hidden SSID'], [0], 'WPA3 rend PMF obligatoire (802.11w).'),
	q('b5-047', '5.10', 'When configuring WPA2 PSK on a WLC WLAN, which two settings are needed? (Choose two.)', ['WPA2 policy with AES', 'PSK authentication key management', 'An 802.1X RADIUS server', 'Static WEP key', 'TKIP only'], [0, 1], 'WPA2 Policy + AES, puis gestion de clé PSK avec la passphrase.'),
	q('b5-048', '5.10', 'What is the minimum length of a WPA2 ASCII passphrase?', ['6 characters', '8 characters', '12 characters', '64 characters'], [1], 'Passphrase ASCII de 8 à 63 caractères.')
];
