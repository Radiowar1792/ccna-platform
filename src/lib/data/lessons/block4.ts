import type { Lesson } from './types';

// Block 4 — Security and services (Days 34 to 51)
export const BLOCK4: Lesson[] = [
	{
		day: 34,
		summary: 'An ACL (Access Control List) is a list of permit and deny rules. The router reads the rules from top to bottom and stops at the first match. Every ACL ends with an invisible "deny any". Standard ACLs only check the source IP, so you place them close to the destination.',
		points: ['Standard ACL numbers: 1–99 and 1300–1999.', 'First match wins; implicit deny at the end.', 'Apply with "ip access-group <ACL> in|out" on an interface.', 'Wildcard mask = inverse of the subnet mask (0 = must match).'],
		vocab: [['access control list', 'liste de contrôle d\'accès'], ['to permit / to deny', 'autoriser / refuser'], ['implicit deny', 'refus implicite'], ['inbound / outbound', 'en entrée / en sortie'], ['wildcard mask', 'masque générique']],
		commands: ['access-list 1 deny 192.168.10.0 0.0.0.255', 'access-list 1 permit any', 'interface g0/1', 'ip access-group 1 out', 'show access-lists'],
		hint: 'An ACL with only deny lines blocks everything. Add a permit line at the end.',
		fr: "Le router lit l'ACL ligne par ligne et applique la première règle qui correspond, puis s'arrête. À la fin il y a toujours un deny any invisible. Une ACL standard ne regarde que l'IP source : si tu la places près de la source, tu bloquerais l'accès à toutes les destinations. On la place donc près de la destination.",
		quiz: [
			{ q: 'What does a standard ACL check?', o: ['Source and destination IP', 'Only the source IP', 'Port numbers', 'MAC addresses'], a: 1, why: 'Une ACL standard ne vérifie que l\'IP source.' },
			{ q: 'What is at the end of every ACL?', o: ['permit any', 'An implicit deny any', 'A log entry', 'Nothing'], a: 1, why: 'Un deny any implicite.' },
			{ q: 'What is the wildcard mask for a /24?', o: ['255.255.255.0', '0.0.0.255', '0.0.0.0', '255.0.0.0'], a: 1, why: 'Inverse de 255.255.255.0 = 0.0.0.255.' }
		]
	},
	{
		day: 35,
		summary: 'Extended ACLs can check the protocol, the source IP, the destination IP and the port numbers. This makes them very precise, so you place them close to the source. Named ACLs are easier to read and edit because you can insert or delete single lines.',
		points: ['Extended ACL numbers: 100–199 and 2000–2699.', 'Syntax: permit|deny <protocol> <src> <dst> [eq <port>].', 'Place extended ACLs close to the source.', 'Named ACL: "ip access-list extended NAME", with sequence numbers.'],
		vocab: [['extended', 'étendu'], ['sequence number', 'numéro de séquence'], ['named ACL', 'ACL nommée'], ['host keyword', 'mot-clé host (une seule IP)'], ['eq (equal)', 'égal à (port)']],
		commands: ['ip access-list extended WEB', 'deny tcp 10.1.1.0 0.0.0.255 host 10.2.2.2 eq 443', 'permit ip any any', 'ip access-group WEB in'],
		hint: '"host 10.2.2.2" is the same as "10.2.2.2 0.0.0.0".',
		fr: "Une ACL étendue filtre précisément : protocole (ip, tcp, udp, icmp), source, destination et port. Comme elle est précise, on la place près de la source pour jeter le trafic indésirable le plus tôt possible. Les ACL nommées permettent de supprimer ou d'insérer une ligne grâce aux numéros de séquence (10, 20, 30…).",
		quiz: [
			{ q: 'Where should an extended ACL be placed?', o: ['Close to the destination', 'Close to the source', 'On every router', 'Only on the Internet router'], a: 1, why: 'Près de la source.' },
			{ q: 'Which range is for extended numbered ACLs?', o: ['1–99', '100–199', '200–299', '1300–1999'], a: 1, why: '100–199 (et 2000–2699).' },
			{ q: 'Which keyword matches a single IP address?', o: ['any', 'host', 'eq', 'single'], a: 1, why: 'host x.x.x.x = une seule adresse.' }
		]
	},
	{
		day: 36,
		summary: 'CDP and LLDP are discovery protocols: devices send messages to their directly connected neighbors with their name, model, IP and port. CDP is Cisco proprietary and enabled by default. LLDP is an open standard and often disabled by default on Cisco devices.',
		points: ['CDP timer 60 s, holdtime 180 s. LLDP timer 30 s, holdtime 120 s.', 'They only see directly connected neighbors.', 'Useful for troubleshooting and mapping the network.', 'Disable them on ports facing untrusted networks.'],
		vocab: [['discovery protocol', 'protocole de découverte'], ['neighbor', 'voisin'], ['holdtime', 'durée de conservation'], ['proprietary', 'propriétaire'], ['to map', 'cartographier']],
		commands: ['show cdp neighbors', 'show cdp neighbors detail', 'lldp run', 'lldp transmit / lldp receive', 'no cdp enable'],
		hint: '"show cdp neighbors detail" shows the IP address of the neighbor.',
		fr: "CDP (Cisco) et LLDP (standard IEEE 802.1AB) annoncent l'identité de l'équipement à ses voisins directs : nom, modèle, IP de gestion, port utilisé. C'est très pratique pour dessiner la topologie ou vérifier un câblage. Comme ces informations aident aussi un attaquant, on les désactive sur les ports vers Internet ou vers les utilisateurs.",
		quiz: [
			{ q: 'Which discovery protocol is an open standard?', o: ['CDP', 'LLDP', 'DTP', 'VTP'], a: 1, why: 'LLDP est le standard.' },
			{ q: 'Which command shows the IP address of a CDP neighbor?', o: ['show cdp', 'show cdp neighbors', 'show cdp neighbors detail', 'show ip interface brief'], a: 2, why: 'La version detail affiche l\'IP.' },
			{ q: 'Which command enables LLDP globally?', o: ['lldp enable', 'lldp run', 'cdp run', 'lldp start'], a: 1, why: 'lldp run.' }
		]
	},
	{
		day: 37,
		summary: 'NTP (Network Time Protocol) synchronizes the clocks of all devices. Correct time is essential for logs, certificates and troubleshooting. Stratum shows the distance from the reference clock: stratum 0 is the atomic or GPS clock, stratum 1 is directly connected to it. NTP uses UDP 123.',
		points: ['Lower stratum = more accurate. Stratum 16 = not synchronized.', 'A router can be an NTP client and server at the same time.', '"ntp master" makes a router an authoritative time source.', 'Set the time zone with "clock timezone".'],
		vocab: [['to synchronize', 'synchroniser'], ['clock', 'horloge'], ['stratum', 'strate (niveau)'], ['accurate', 'précis'], ['time zone', 'fuseau horaire']],
		commands: ['ntp server 10.0.0.1', 'ntp master 3', 'clock timezone CET 1', 'show ntp associations', 'show clock'],
		hint: 'Logs from devices with different times are useless for troubleshooting.',
		fr: "Sans heure synchronisée, impossible de corréler les logs de plusieurs équipements ou de valider un certificat. NTP fonctionne en hiérarchie : stratum 0 = horloge de référence (GPS, atomique), stratum 1 = serveur relié dessus, et ainsi de suite. Un router configuré avec ntp server devient client ; il peut aussi servir l'heure aux autres.",
		quiz: [
			{ q: 'Which port does NTP use?', o: ['UDP 69', 'UDP 123', 'TCP 123', 'UDP 161'], a: 1, why: 'NTP = UDP 123.' },
			{ q: 'What stratum is a server directly connected to a GPS clock?', o: ['0', '1', '2', '16'], a: 1, why: 'Le GPS est stratum 0, le serveur relié dessus stratum 1.' },
			{ q: 'Why is NTP important?', o: ['It speeds up routing', 'It gives correct timestamps to logs and certificates', 'It assigns IPs', 'It encrypts traffic'], a: 1, why: 'Horodatage correct des logs et validité des certificats.' }
		]
	},
	{
		day: 38,
		summary: 'DNS translates names like www.cisco.com into IP addresses. Clients send queries to a DNS server, usually over UDP port 53. An A record gives an IPv4 address, an AAAA record gives an IPv6 address. A Cisco router can act as a DNS client or a simple DNS server.',
		points: ['DNS uses UDP 53 for queries, TCP 53 for big replies and zone transfers.', 'Records: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail).', 'Windows: "nslookup" and "ipconfig /displaydns".', 'Router: "ip name-server" and "ip domain lookup".'],
		vocab: [['name resolution', 'résolution de noms'], ['query', 'requête'], ['record', 'enregistrement'], ['alias', 'alias'], ['cache', 'cache (mémoire temporaire)']],
		commands: ['ip name-server 8.8.8.8', 'ip domain lookup', 'ip host R2 10.0.12.2', 'nslookup www.cisco.com'],
		hint: 'Mistyped command on a router, then a long wait? It is trying DNS. Use "no ip domain lookup" in the lab.',
		fr: "DNS fait la traduction nom → adresse IP. Le client interroge un serveur DNS (UDP 53), qui répond ou demande à d'autres serveurs. Retiens les enregistrements A (IPv4), AAAA (IPv6), CNAME (alias) et MX (serveur mail). Sur un router de lab, no ip domain lookup évite d'attendre quand tu tapes une commande inconnue.",
		quiz: [
			{ q: 'Which DNS record maps a name to an IPv6 address?', o: ['A', 'AAAA', 'MX', 'PTR'], a: 1, why: 'AAAA = IPv6.' },
			{ q: 'Which port do DNS queries usually use?', o: ['UDP 53', 'TCP 80', 'UDP 67', 'TCP 25'], a: 0, why: 'UDP 53 en général.' },
			{ q: 'Which command sets a DNS server on a Cisco router?', o: ['ip dns server', 'ip name-server', 'dns server', 'ip domain-name'], a: 1, why: 'ip name-server <IP>.' }
		]
	},
	{
		day: 39,
		summary: 'DHCP gives IP settings to hosts automatically: IP address, mask, default gateway and DNS server. The exchange has four messages: Discover, Offer, Request, Ack (DORA). If the server is in another subnet, the router must relay the messages with "ip helper-address".',
		points: ['DORA: Discover (broadcast), Offer, Request (broadcast), Ack.', 'Server port UDP 67, client port UDP 68.', 'Exclude static addresses (gateway, servers) from the pool.', 'DHCP relay: "ip helper-address <server>" on the client-side interface.'],
		vocab: [['lease', 'bail'], ['pool', 'plage d\'adresses'], ['to exclude', 'exclure'], ['relay agent', 'agent relais'], ['to renew', 'renouveler']],
		commands: ['ip dhcp excluded-address 192.168.1.1 192.168.1.10', 'ip dhcp pool LAN', 'network 192.168.1.0 255.255.255.0', 'default-router 192.168.1.1', 'dns-server 8.8.8.8', 'ip helper-address 10.0.0.10', 'ipconfig /release · ipconfig /renew'],
		hint: 'The helper-address goes on the interface where the CLIENTS are, not on the server side.',
		fr: "Le client n'a pas encore d'IP, donc il envoie un Discover en broadcast. Le serveur répond par un Offer, le client confirme par un Request, et le serveur valide par un Ack. Les broadcasts ne traversent pas les routers : si le serveur DHCP est dans un autre réseau, l'interface du router côté clients doit avoir ip helper-address pour transformer le broadcast en unicast vers le serveur.",
		quiz: [
			{ q: 'What is the correct order of DHCP messages?', o: ['Offer, Discover, Ack, Request', 'Discover, Offer, Request, Ack', 'Request, Offer, Discover, Ack', 'Discover, Request, Offer, Ack'], a: 1, why: 'DORA : Discover, Offer, Request, Ack.' },
			{ q: 'What does "ip helper-address" do?', o: ['Creates a DHCP pool', 'Relays DHCP broadcasts to a server in another subnet', 'Sets the DNS server', 'Excludes addresses'], a: 1, why: 'C\'est le DHCP relay.' },
			{ q: 'Which UDP port does the DHCP server listen on?', o: ['53', '67', '68', '69'], a: 1, why: 'Serveur 67, client 68.' }
		]
	},
	{
		day: 40,
		summary: 'SNMP lets a central server (the NMS, or manager) monitor and configure network devices. Each device runs an SNMP agent and has a MIB, a database of variables identified by OIDs. The manager uses Get and Set; the agent sends Trap or Inform messages when something happens.',
		points: ['Manager → agent: Get, GetNext, GetBulk, Set. Agent → manager: Trap, Inform.', 'Inform is acknowledged, Trap is not.', 'Agent listens on UDP 161, manager receives traps on UDP 162.', 'SNMPv3 adds authentication and encryption. v1/v2c use community strings.'],
		vocab: [['network management station (NMS)', 'station de supervision'], ['agent', 'agent'], ['MIB / OID', 'base d\'informations / identifiant d\'objet'], ['community string', 'chaîne de communauté (mot de passe)'], ['to monitor', 'superviser']],
		commands: ['snmp-server community LabRO ro', 'snmp-server host 10.0.0.50 version 2c LabRO', 'snmp-server group ADMINS v3 priv'],
		hint: 'Choose SNMPv3 with "priv" for real security: v1 and v2c send the community string in clear text.',
		fr: "Le serveur de supervision (manager) interroge les équipements (agents) avec Get et peut modifier une valeur avec Set. Les agents préviennent le manager d'un événement par un Trap (sans accusé) ou un Inform (avec accusé). Les valeurs sont rangées dans la MIB et identifiées par des OID. SNMPv3 est la seule version vraiment sécurisée (authentification + chiffrement).",
		quiz: [
			{ q: 'Which SNMP message is acknowledged by the manager?', o: ['Trap', 'Inform', 'Get', 'Set'], a: 1, why: 'Inform est acquitté, Trap non.' },
			{ q: 'Which SNMP version supports encryption?', o: ['v1', 'v2c', 'v3', 'All of them'], a: 2, why: 'Seul SNMPv3 chiffre.' },
			{ q: 'Which port does the SNMP agent listen on?', o: ['UDP 161', 'UDP 162', 'TCP 161', 'UDP 514'], a: 0, why: 'Agent = UDP 161, traps vers le manager = UDP 162.' }
		]
	},
	{
		day: 41,
		summary: 'Syslog is the standard for logging messages. Cisco devices can show logs on the console, keep them in a buffer, or send them to a syslog server on UDP 514. Each message has a severity level from 0 (emergency) to 7 (debugging). Choosing a level includes all the more severe levels.',
		points: ['0 Emergency, 1 Alert, 2 Critical, 3 Error, 4 Warning, 5 Notice, 6 Informational, 7 Debugging.', '"logging trap 4" sends levels 0 to 4 to the server.', 'Console logs can interrupt your typing: "logging synchronous" fixes this.', 'Use NTP and "service timestamps" so logs have correct times.'],
		vocab: [['severity level', 'niveau de gravité'], ['log message', 'message de journal'], ['buffer', 'mémoire tampon'], ['facility', 'catégorie (source) du message'], ['timestamp', 'horodatage']],
		commands: ['logging host 10.0.0.50', 'logging trap warnings', 'logging buffered 16384', 'logging synchronous', 'show logging'],
		hint: 'Mnemonic 0→7: "Every Awesome Cisco Engineer Will Need Ice cream Daily".',
		fr: "Syslog centralise les journaux. Chaque message a un niveau : plus le chiffre est petit, plus c'est grave. Quand tu choisis un niveau (par exemple 4 = warning), tu reçois ce niveau ET tous les plus graves (0 à 4). logging synchronous évite que les messages coupent la commande que tu es en train de taper sur la console.",
		quiz: [
			{ q: 'Which severity level is "Error"?', o: ['2', '3', '4', '5'], a: 1, why: '3 = Error.' },
			{ q: 'With "logging trap 4", which levels are sent?', o: ['Only 4', '4 to 7', '0 to 4', '0 to 7'], a: 2, why: 'Le niveau choisi et tous les plus graves : 0 à 4.' },
			{ q: 'Which port does Syslog use?', o: ['UDP 514', 'UDP 161', 'TCP 22', 'UDP 123'], a: 0, why: 'Syslog = UDP 514.' }
		]
	},
	{
		day: 42,
		summary: 'SSH gives secure, encrypted remote access to the CLI, unlike Telnet which sends everything in clear text. To enable SSH you need a hostname, a domain name, RSA keys, a local user and VTY lines configured for SSH. Use SSH version 2.',
		points: ['Telnet = TCP 23, clear text. SSH = TCP 22, encrypted.', 'Requirements: hostname, ip domain name, crypto key (≥ 768 bits for v2, use 2048).', '"login local" uses the local username database.', '"transport input ssh" blocks Telnet on VTY lines.'],
		vocab: [['remote access', 'accès à distance'], ['encrypted', 'chiffré'], ['key pair', 'paire de clés'], ['VTY lines', 'lignes virtuelles (accès distant)'], ['console port', 'port console']],
		commands: ['ip domain name lab.local', 'crypto key generate rsa modulus 2048', 'username admin secret Str0ng!', 'ip ssh version 2', 'line vty 0 15', 'login local', 'transport input ssh'],
		hint: 'No domain name = the router refuses to generate RSA keys.',
		fr: "Telnet envoie tout en clair, y compris le mot de passe : à bannir. Pour SSH, il faut un hostname et un domain name (ils servent à nommer la clé RSA), générer la paire de clés, créer un utilisateur local, puis configurer les lignes VTY avec login local et transport input ssh. Pense aussi à une ACL sur les VTY (access-class) pour limiter qui peut se connecter.",
		quiz: [
			{ q: 'Which port does SSH use?', o: ['TCP 22', 'TCP 23', 'UDP 22', 'TCP 443'], a: 0, why: 'SSH = TCP 22.' },
			{ q: 'What is required before generating RSA keys?', o: ['A DHCP pool', 'A hostname and a domain name', 'An enable password', 'NTP'], a: 1, why: 'Hostname + domain name.' },
			{ q: 'Which command allows only SSH on VTY lines?', o: ['transport input ssh', 'login local', 'ip ssh enable', 'no telnet'], a: 0, why: 'transport input ssh.' }
		]
	},
	{
		day: 43,
		summary: 'FTP and TFTP transfer files, for example IOS images and configuration backups. FTP uses TCP, needs a username and password and has two connections (control on port 21, data on port 20). TFTP is very simple: UDP 69, no authentication, no directory listing.',
		points: ['FTP: TCP 20 (data) and 21 (control), authentication, reliable.', 'TFTP: UDP 69, no authentication, lightweight.', 'Active vs passive FTP: who opens the data connection.', 'Copy IOS: "copy tftp flash", then "boot system flash:<file>".'],
		vocab: [['file transfer', 'transfert de fichiers'], ['control connection', 'connexion de contrôle'], ['data connection', 'connexion de données'], ['lightweight', 'léger'], ['to upgrade', 'mettre à jour']],
		commands: ['copy running-config tftp:', 'copy tftp: flash:', 'boot system flash:c2900-universalk9-mz.SPA.157-3.M.bin', 'show flash:'],
		hint: 'TFTP = "Trivial" FTP: no login, no list, just get or put a file.',
		fr: "FTP (TCP) est fiable et demande une authentification ; il utilise une connexion de contrôle (21) et une connexion de données (20 en mode actif). TFTP (UDP 69) est minimaliste : pas de login, pas de listing, utilisé pour sauvegarder des configs ou charger une image IOS en lab. Pour mettre à jour l'IOS : copie vers la flash, boot system, puis reload.",
		quiz: [
			{ q: 'Which port does TFTP use?', o: ['UDP 69', 'TCP 21', 'TCP 20', 'UDP 53'], a: 0, why: 'TFTP = UDP 69.' },
			{ q: 'Which protocol requires a username and password?', o: ['TFTP', 'FTP', 'Both', 'Neither'], a: 1, why: 'FTP demande une authentification, TFTP non.' },
			{ q: 'Which FTP port is the control connection?', o: ['20', '21', '22', '69'], a: 1, why: '21 = contrôle, 20 = données.' }
		]
	},
	{
		day: 44,
		summary: 'Private IPv4 addresses cannot be used on the Internet, so routers use NAT to translate them into public addresses. Static NAT maps one private address to one public address, which is useful for servers. You must mark the inside and outside interfaces.',
		points: ['Inside local = private IP of the host. Inside global = public IP that represents it.', 'Static NAT: one-to-one, permanent.', '"ip nat inside" and "ip nat outside" on the interfaces.', 'NAT saves IPv4 addresses.'],
		vocab: [['translation', 'traduction'], ['inside local / inside global', 'adresse privée / publique de l\'hôte interne'], ['outside global', 'adresse publique de l\'hôte externe'], ['one-to-one', 'un pour un'], ['to map', 'associer']],
		commands: ['ip nat inside source static 192.168.1.10 203.0.113.10', 'interface g0/0', 'ip nat inside', 'interface g0/1', 'ip nat outside', 'show ip nat translations'],
		hint: '"Local" = as seen from inside. "Global" = as seen from the Internet.',
		fr: "Le NAT remplace l'adresse privée d'un hôte par une adresse publique quand le paquet sort vers Internet. Vocabulaire Cisco : inside local = l'IP privée du PC, inside global = l'IP publique qui le représente. Le NAT statique associe en permanence une IP privée à une IP publique : idéal pour rendre un serveur interne joignable depuis Internet.",
		quiz: [
			{ q: 'What is the inside local address?', o: ['The public IP of the inside host', 'The private IP of the inside host', 'The IP of the Internet server', 'The router loopback'], a: 1, why: 'Inside local = IP privée de l\'hôte interne.' },
			{ q: 'Which NAT type is best for making an internal web server reachable?', o: ['Static NAT', 'PAT', 'Dynamic NAT', 'No NAT'], a: 0, why: 'Le NAT statique offre une IP publique fixe.' },
			{ q: 'Which command shows the active translations?', o: ['show nat', 'show ip nat translations', 'show ip route nat', 'debug nat'], a: 1, why: 'show ip nat translations.' }
		]
	},
	{
		day: 45,
		summary: 'Dynamic NAT uses a pool of public addresses, given to inside hosts when they need one. PAT (Port Address Translation, also called NAT overload) lets many hosts share one public IP by using different port numbers. PAT is what your home router does.',
		points: ['Dynamic NAT: ACL (who) + pool (which public IPs).', 'If the pool is empty, new hosts cannot get out.', 'PAT: "overload" keyword, uses source ports to track sessions.', 'Most common: PAT on the outside interface IP.'],
		vocab: [['pool', 'groupe d\'adresses'], ['overload', 'surcharge (PAT)'], ['to share', 'partager'], ['session', 'session'], ['to run out of', 'manquer de, épuiser']],
		commands: ['access-list 1 permit 192.168.1.0 0.0.0.255', 'ip nat pool PUB 203.0.113.10 203.0.113.20 netmask 255.255.255.0', 'ip nat inside source list 1 pool PUB', 'ip nat inside source list 1 interface g0/1 overload'],
		hint: 'The ACL in NAT does not filter traffic: it only selects which addresses are translated.',
		fr: "Le NAT dynamique attribue une IP publique libre du pool à chaque hôte qui sort ; s'il n'en reste plus, les suivants sont bloqués. Le PAT (overload) résout ce problème : tous les hôtes partagent une seule IP publique et le router distingue les sessions grâce aux numéros de port source. C'est exactement ce que fait ta box à la maison.",
		quiz: [
			{ q: 'Which keyword enables PAT?', o: ['pool', 'overload', 'static', 'extendable'], a: 1, why: 'overload = PAT.' },
			{ q: 'How does PAT tell sessions apart?', o: ['By MAC address', 'By port number', 'By VLAN', 'By TTL'], a: 1, why: 'Grâce aux numéros de port.' },
			{ q: 'In NAT configuration, the ACL is used to…', o: ['block traffic', 'select which inside addresses are translated', 'log translations', 'define the public IPs'], a: 1, why: 'L\'ACL désigne les adresses à traduire.' }
		]
	},
	{
		day: 46,
		summary: 'QoS (Quality of Service) manages bandwidth, delay, jitter and loss so that important traffic like voice gets priority. Voice needs low delay (under 150 ms one way), low jitter and very little loss. Phones and PCs often share the same switch port using a voice VLAN.',
		points: ['Four characteristics: bandwidth, delay (latency), jitter, loss.', 'Voice targets: delay ≤ 150 ms, jitter ≤ 30 ms, loss ≤ 1 %.', 'Congestion happens when more traffic arrives than the link can send.', 'Voice VLAN: the phone tags voice frames, the PC traffic stays untagged.'],
		vocab: [['delay / latency', 'délai / latence'], ['jitter', 'gigue'], ['packet loss', 'perte de paquets'], ['congestion', 'congestion'], ['priority', 'priorité']],
		commands: ['interface f0/5', 'switchport access vlan 10', 'switchport voice vlan 50', 'mls qos trust cos'],
		hint: 'QoS only helps when there is congestion. On an empty link, everything is fast.',
		fr: "La QoS sert à traiter différemment les flux quand le lien est saturé (congestion). La voix est très sensible : au-delà d'environ 150 ms de délai, une gigue de 30 ms ou 1 % de pertes, la conversation devient mauvaise. On donne donc la priorité à la voix. Sur un switch, le téléphone IP et le PC partagent le même port grâce au voice VLAN.",
		quiz: [
			{ q: 'What is jitter?', o: ['Total bandwidth', 'Variation in delay', 'Lost packets', 'Packet size'], a: 1, why: 'La gigue est la variation du délai.' },
			{ q: 'What is the recommended maximum one-way delay for voice?', o: ['50 ms', '150 ms', '500 ms', '1 s'], a: 1, why: 'Environ 150 ms.' },
			{ q: 'When does QoS really matter?', o: ['When there is congestion', 'Only on Wi-Fi', 'Only for DNS', 'Never on LANs'], a: 0, why: 'La QoS agit quand le lien est saturé.' }
		]
	},
	{
		day: 47,
		summary: 'QoS works in steps: classification (identify the traffic), marking (write a value in the header), queuing (put packets in different queues) and then scheduling. Common markings are CoS at Layer 2 and DSCP at Layer 3. Policing drops extra traffic, shaping delays it.',
		points: ['Marking: CoS (802.1Q, 3 bits), DSCP (IP header, 6 bits).', 'Voice = DSCP EF (46). AF classes (AF11–AF43) for other important data.', 'Trust boundary: where markings start to be trusted (often the IP phone).', 'Policing drops or re-marks; shaping buffers. LLQ gives voice a strict priority queue.'],
		vocab: [['classification', 'classification'], ['marking', 'marquage'], ['queue', 'file d\'attente'], ['trust boundary', 'frontière de confiance'], ['policing / shaping', 'limitation par rejet / lissage']],
		hint: 'EF = Expedited Forwarding = voice. Remember "EF 46".',
		fr: "Étapes : on reconnaît le trafic (classification), on écrit une valeur dans l'en-tête (marking : CoS en couche 2, DSCP en couche 3), puis on le place dans une file adaptée (queuing). La voix est marquée EF (DSCP 46) et passe dans une file prioritaire (LLQ). Le policing jette ce qui dépasse, le shaping met en attente pour lisser le débit (souvent côté WAN).",
		quiz: [
			{ q: 'Which DSCP value is used for voice?', o: ['AF41', 'CS1', 'EF (46)', 'DF (0)'], a: 2, why: 'EF = 46 pour la voix.' },
			{ q: 'What does shaping do with excess traffic?', o: ['Drops it', 'Buffers and delays it', 'Marks it as EF', 'Sends it on another link'], a: 1, why: 'Le shaping met en tampon.' },
			{ q: 'Where is CoS marking carried?', o: ['In the IP header', 'In the 802.1Q tag', 'In the TCP header', 'In the FCS'], a: 1, why: 'CoS est dans le tag 802.1Q (couche 2).' }
		]
	},
	{
		day: 48,
		summary: 'Security starts with key concepts: a vulnerability is a weakness, an exploit uses it, a threat is the danger, and mitigation reduces the risk. Common attacks include DoS, spoofing, reflection, man-in-the-middle, phishing and password attacks. AAA, MFA and user training are key defenses.',
		points: ['CIA triad: Confidentiality, Integrity, Availability.', 'Attacks: DoS/DDoS, spoofing, reflection/amplification, MITM, malware, social engineering.', 'MFA = two different factors: something you know, have, or are.', 'AAA: Authentication, Authorization, Accounting (RADIUS, TACACS+).'],
		vocab: [['vulnerability / exploit', 'vulnérabilité / exploit'], ['threat', 'menace'], ['mitigation', 'atténuation'], ['social engineering', 'ingénierie sociale'], ['multi-factor authentication', 'authentification multifacteur']],
		hint: 'Password + PIN is NOT MFA: both are "something you know".',
		fr: "La triade CIA résume les objectifs : confidentialité, intégrité, disponibilité. Une vulnérabilité est une faiblesse, un exploit est la façon de l'utiliser, la menace est le risque qu'elle soit utilisée. Le MFA combine deux catégories différentes (savoir + posséder, par exemple). AAA centralise l'authentification avec RADIUS (UDP, standard) ou TACACS+ (TCP 49, Cisco, chiffre tout).",
		quiz: [
			{ q: 'Which is a real example of MFA?', o: ['Password and PIN', 'Password and code from a phone app', 'Two passwords', 'Username and password'], a: 1, why: 'Savoir (mot de passe) + posséder (téléphone).' },
			{ q: 'Which AAA protocol uses TCP and encrypts the whole payload?', o: ['RADIUS', 'TACACS+', 'SNMP', 'LDAP'], a: 1, why: 'TACACS+ (TCP 49).' },
			{ q: 'What does the "A" for Availability protect against?', o: ['Data theft', 'Data modification', 'Service outages like DoS', 'Spoofing'], a: 2, why: 'La disponibilité est visée par les DoS.' }
		]
	},
	{
		day: 49,
		summary: 'Port security limits which MAC addresses can use a switch port. You set a maximum number of MAC addresses. If a new device breaks the rule, the port reacts according to the violation mode: shutdown (default), restrict or protect. Sticky learning saves learned MACs in the config.',
		points: ['Default: max 1 MAC, violation mode shutdown (port goes err-disabled).', 'Restrict: drops + logs + increments counter. Protect: drops silently.', 'Sticky: learned MACs are added to the running-config.', 'Recover err-disabled: shutdown then no shutdown (or errdisable recovery).'],
		vocab: [['violation', 'violation (infraction)'], ['sticky', 'collant (mémorisé)'], ['to recover', 'récupérer, réactiver'], ['silently', 'sans rien signaler'], ['counter', 'compteur']],
		commands: ['switchport mode access', 'switchport port-security', 'switchport port-security maximum 2', 'switchport port-security mac-address sticky', 'switchport port-security violation restrict', 'show port-security interface f0/1'],
		hint: 'Port security only works on access (or trunk) ports set statically, not on dynamic ports.',
		fr: "Port security protège contre le branchement d'un appareil non autorisé et contre le MAC flooding. Par défaut, une seule MAC est autorisée et une violation met le port en err-disabled. Restrict jette le trafic interdit et le journalise, protect le jette sans rien dire. Avec sticky, les MAC apprises sont écrites dans la config (pense à sauvegarder).",
		quiz: [
			{ q: 'What is the default violation mode?', o: ['Protect', 'Restrict', 'Shutdown', 'Log'], a: 2, why: 'Shutdown par défaut.' },
			{ q: 'Which mode drops traffic and increments the counter without shutting down the port?', o: ['Protect', 'Restrict', 'Shutdown', 'Sticky'], a: 1, why: 'Restrict.' },
			{ q: 'What does "sticky" do?', o: ['Blocks all MACs', 'Saves learned MACs into the running-config', 'Disables the port', 'Allows unlimited MACs'], a: 1, why: 'Les MAC apprises sont écrites dans la config.' }
		]
	},
	{
		day: 50,
		summary: 'DHCP snooping protects the network from rogue DHCP servers and DHCP starvation attacks. Ports toward the real DHCP server are trusted; all other ports are untrusted. DHCP server messages arriving on untrusted ports are dropped. Snooping builds a binding table of MAC, IP, VLAN and port.',
		points: ['Trusted = uplinks toward the legitimate DHCP server.', 'Untrusted = user ports: Offer/Ack received there are dropped.', 'Rate limiting on untrusted ports stops DHCP starvation.', 'The binding table is used by DAI and IP Source Guard.'],
		vocab: [['rogue server', 'serveur pirate'], ['starvation', 'épuisement (famine)'], ['trusted / untrusted', 'de confiance / non fiable'], ['binding table', 'table d\'association'], ['rate limit', 'limite de débit']],
		commands: ['ip dhcp snooping', 'ip dhcp snooping vlan 10', 'interface g0/1', 'ip dhcp snooping trust', 'ip dhcp snooping limit rate 10', 'show ip dhcp snooping binding'],
		hint: 'Forgetting "ip dhcp snooping trust" on the uplink = nobody gets an address.',
		fr: "Un faux serveur DHCP peut donner une passerelle pirate aux PC (attaque man-in-the-middle). DHCP snooping n'accepte les messages de serveur (Offer, Ack) que sur les ports trusted (vers le vrai serveur). Sur les ports utilisateurs, on limite aussi le nombre de messages par seconde contre la DHCP starvation. La table de bindings créée sert ensuite à DAI.",
		quiz: [
			{ q: 'Which ports should be trusted for DHCP snooping?', o: ['All user ports', 'Ports toward the legitimate DHCP server', 'Unused ports', 'Voice ports'], a: 1, why: 'Les ports vers le vrai serveur DHCP.' },
			{ q: 'Which attack sends many DHCP Discovers to empty the pool?', o: ['DHCP starvation', 'ARP poisoning', 'VLAN hopping', 'MAC spoofing'], a: 0, why: 'DHCP starvation.' },
			{ q: 'Which feature uses the DHCP snooping binding table to check ARP?', o: ['Port security', 'Dynamic ARP Inspection', 'BPDU Guard', 'CDP'], a: 1, why: 'DAI.' }
		]
	},
	{
		day: 51,
		summary: 'Dynamic ARP Inspection (DAI) stops ARP poisoning (ARP spoofing) attacks. On untrusted ports, the switch checks each ARP message against the DHCP snooping binding table. ARP messages that do not match are dropped. Ports to other switches and routers are usually trusted.',
		points: ['ARP poisoning: the attacker claims to be the gateway → man-in-the-middle.', 'DAI requires DHCP snooping (or static ARP ACLs for static IPs).', 'Trust uplinks; leave user ports untrusted.', 'DAI can also rate-limit ARP and validate MAC/IP fields.'],
		vocab: [['ARP poisoning / spoofing', 'empoisonnement / usurpation ARP'], ['man-in-the-middle', 'homme du milieu'], ['to inspect', 'inspecter'], ['to validate', 'valider'], ['gratuitous ARP', 'ARP gratuit (non sollicité)']],
		commands: ['ip arp inspection vlan 10', 'interface g0/1', 'ip arp inspection trust', 'ip arp inspection validate src-mac dst-mac ip', 'show ip arp inspection'],
		hint: 'Enable DHCP snooping first, then DAI. DAI needs the bindings.',
		fr: "L'attaquant envoie de faux messages ARP pour dire « je suis la passerelle » : les PC lui envoient alors leur trafic (man-in-the-middle). DAI vérifie, sur les ports untrusted, que le couple IP/MAC annoncé correspond à la table de DHCP snooping, et jette les messages menteurs. Les liens vers les autres switchs et routers sont mis en trust.",
		quiz: [
			{ q: 'Which attack does DAI prevent?', o: ['DHCP starvation', 'ARP poisoning', 'MAC flooding', 'STP manipulation'], a: 1, why: 'DAI bloque l\'ARP spoofing / poisoning.' },
			{ q: 'Which table does DAI use?', o: ['Routing table', 'DHCP snooping binding table', 'CAM table', 'NAT table'], a: 1, why: 'La table de bindings du DHCP snooping.' },
			{ q: 'Which ports are usually trusted for DAI?', o: ['User access ports', 'Uplinks to switches and routers', 'Wireless clients', 'None'], a: 1, why: 'Les liens vers les autres équipements réseau.' }
		]
	}
];
