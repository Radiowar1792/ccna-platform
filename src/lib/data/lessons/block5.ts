import type { Lesson } from './types';

// Block 5 — Architectures, wireless, automation (Days 52 to 63)
export const BLOCK5: Lesson[] = [
	{
		day: 52,
		summary: 'Campus LANs are usually designed in layers. In a two-tier design (collapsed core), distribution and core are combined. In a three-tier design, there are access, distribution and core layers. Data centers use spine-leaf. SOHO networks use one small all-in-one router.',
		points: ['Access layer: end hosts connect here (PoE, port security).', 'Distribution: aggregates access switches, routing between VLANs.', 'Core: very fast connection between distribution blocks.', 'Spine-leaf: every leaf connects to every spine, no leaf-to-leaf or spine-to-spine links.'],
		vocab: [['access / distribution / core layer', 'couche accès / distribution / cœur'], ['collapsed core', 'cœur fusionné (2 niveaux)'], ['spine-leaf', 'architecture spine-leaf'], ['SOHO (Small Office/Home Office)', 'petit bureau / domicile'], ['to aggregate', 'agréger']],
		hint: 'In spine-leaf, any server reaches any other server in the same number of hops.',
		fr: "Le modèle à 3 couches (accès, distribution, cœur) sert aux grands campus ; dans les plus petits, on fusionne distribution et cœur (collapsed core, 2 couches). Dans les datacenters, la topologie spine-leaf donne des chemins de même longueur entre tous les serveurs : chaque leaf est relié à chaque spine, mais jamais un leaf à un leaf ni un spine à un spine.",
		quiz: [
			{ q: 'Which layer do end hosts connect to?', o: ['Core', 'Distribution', 'Access', 'Spine'], a: 2, why: 'Les hôtes se branchent sur la couche accès.' },
			{ q: 'In spine-leaf, which statement is true?', o: ['Leaves connect to each other', 'Every leaf connects to every spine', 'Spines connect in a mesh', 'Servers connect to spines'], a: 1, why: 'Chaque leaf est relié à chaque spine.' },
			{ q: 'What is a collapsed core design?', o: ['Core and distribution combined (two tiers)', 'A network without a core', 'A failed core switch', 'Spine-leaf'], a: 0, why: 'Distribution et cœur fusionnés.' }
		]
	},
	{
		day: 53,
		summary: 'WANs connect sites that are far apart. Options include leased lines, MPLS from a service provider, and Internet connections like fiber, DSL or 4G/5G. Over the Internet, companies use VPNs: site-to-site IPsec VPNs connect offices, and remote-access VPNs connect individual users.',
		points: ['Leased line: dedicated, expensive point-to-point link.', 'MPLS: provider network; CE (customer) and PE (provider) routers.', 'Site-to-site VPN: between two gateways, users do not need software.', 'Remote-access VPN: client software (or TLS) on each user device.'],
		vocab: [['WAN (Wide Area Network)', 'réseau étendu'], ['leased line', 'ligne louée'], ['service provider', 'opérateur'], ['tunnel', 'tunnel'], ['remote worker', 'télétravailleur']],
		hint: 'GRE alone is not encrypted. GRE over IPsec = tunnel + encryption.',
		fr: "Pour relier des sites distants : lignes louées (chères), réseau MPLS de l'opérateur, ou simplement Internet avec un VPN. Le VPN site-à-site relie deux réseaux entiers via leurs routers ou firewalls (les utilisateurs ne voient rien). Le VPN d'accès distant connecte un seul utilisateur grâce à un client (AnyConnect par exemple). IPsec chiffre ; GRE seul ne chiffre pas.",
		quiz: [
			{ q: 'Which VPN type connects two office networks through their gateways?', o: ['Remote-access VPN', 'Site-to-site VPN', 'SSL for one user', 'MPLS only'], a: 1, why: 'Site-à-site.' },
			{ q: 'In MPLS, what is the router at the customer edge called?', o: ['PE', 'CE', 'P', 'ABR'], a: 1, why: 'CE = Customer Edge.' },
			{ q: 'Does GRE encrypt traffic by itself?', o: ['Yes', 'No', 'Only with OSPF', 'Only on IPv6'], a: 1, why: 'Non, il faut IPsec pour chiffrer.' }
		]
	},
	{
		day: 54,
		summary: 'Virtualization runs many virtual machines (VMs) on one physical server, using a hypervisor. Containers are lighter: they share the host OS kernel. Cloud computing provides resources on demand: IaaS, PaaS and SaaS. VRF creates several separate routing tables on one router.',
		points: ['Type 1 hypervisor runs on bare metal (ESXi, Proxmox). Type 2 runs on an OS (VirtualBox).', 'Containers (Docker) share the kernel and start faster than VMs.', 'IaaS = infrastructure, PaaS = platform, SaaS = software.', 'Cloud types: public, private, hybrid, community.'],
		vocab: [['hypervisor', 'hyperviseur'], ['virtual machine', 'machine virtuelle'], ['container', 'conteneur'], ['on demand', 'à la demande'], ['bare metal', 'matériel physique nu']],
		hint: 'Your Proxmox is a Type 1 hypervisor, and your LXC is a container!',
		fr: "Ton Proxmox est un hyperviseur de type 1 : il tourne directement sur le matériel et fait tourner des VM complètes (avec leur propre noyau) et des conteneurs LXC (qui partagent le noyau de l'hôte, donc plus légers). Dans le cloud : IaaS = tu loues des VM, PaaS = une plateforme pour déployer ton code, SaaS = un logiciel prêt à l'emploi (Microsoft 365).",
		quiz: [
			{ q: 'Which hypervisor type runs directly on the hardware?', o: ['Type 1', 'Type 2', 'Type 3', 'Hosted'], a: 0, why: 'Type 1 = bare metal.' },
			{ q: 'What do containers share?', o: ['The physical NIC only', 'The host OS kernel', 'Nothing', 'The BIOS'], a: 1, why: 'Ils partagent le noyau de l\'hôte.' },
			{ q: 'Microsoft 365 is an example of…', o: ['IaaS', 'PaaS', 'SaaS', 'On-premises'], a: 2, why: 'Logiciel prêt à l\'emploi = SaaS.' }
		]
	},
	{
		day: 55,
		summary: 'Wi-Fi uses radio waves in shared bands: 2.4 GHz, 5 GHz and 6 GHz. Because the medium is shared, Wi-Fi is half duplex and uses CSMA/CA to avoid collisions. In 2.4 GHz only channels 1, 6 and 11 do not overlap. The SSID is the name of the wireless network.',
		points: ['802.11 standards: n (Wi-Fi 4), ac (Wi-Fi 5), ax (Wi-Fi 6/6E), be (Wi-Fi 7).', '2.4 GHz: longer range, more interference. 5 GHz: faster, more channels.', 'CSMA/CA = collision avoidance (wireless). CSMA/CD = detection (old wired).', 'BSS = one AP and its clients. BSSID = MAC of the AP radio. ESS = several APs, same SSID.'],
		vocab: [['radio frequency (RF)', 'radiofréquence'], ['band / channel', 'bande / canal'], ['to overlap', 'se chevaucher'], ['collision avoidance', 'évitement des collisions'], ['roaming', 'itinérance']],
		hint: '2.4 GHz non-overlapping channels: 1, 6, 11. Say it until it is automatic.',
		fr: "Le Wi-Fi partage les ondes entre tous les appareils, donc il fonctionne en half duplex avec CSMA/CA (on écoute avant d'émettre et on évite la collision). En 2,4 GHz, les canaux font 22 MHz de large et seuls 1, 6 et 11 ne se chevauchent pas. Un BSS est un AP avec ses clients ; un ESS regroupe plusieurs AP avec le même SSID pour permettre le roaming.",
		quiz: [
			{ q: 'Which 2.4 GHz channels do not overlap?', o: ['1, 5, 9', '1, 6, 11', '2, 7, 12', '1, 7, 13'], a: 1, why: '1, 6 et 11.' },
			{ q: 'Which method does Wi-Fi use to share the medium?', o: ['CSMA/CD', 'CSMA/CA', 'Token passing', 'Full duplex'], a: 1, why: 'CSMA/CA (collision avoidance).' },
			{ q: 'What is the SSID?', o: ['The AP MAC address', 'The name of the wireless network', 'The channel number', 'The encryption key'], a: 1, why: 'Le nom du réseau Wi-Fi.' }
		]
	},
	{
		day: 56,
		summary: 'Autonomous APs are configured one by one. Lightweight APs are managed by a Wireless LAN Controller (WLC) using CAPWAP tunnels: this is the split-MAC architecture. Cloud-based APs are managed from the cloud (Meraki). APs can also work in special modes like monitor or sniffer.',
		points: ['CAPWAP: control tunnel UDP 5246 (encrypted), data tunnel UDP 5247.', 'Split-MAC: real-time tasks on the AP, management on the WLC.', 'WLC deployments: unified, cloud, embedded (in a switch), Mobility Express.', 'AP modes: local, FlexConnect, monitor, sniffer, rogue detector, bridge.'],
		vocab: [['autonomous AP', 'point d\'accès autonome'], ['lightweight AP', 'point d\'accès léger'], ['wireless LAN controller', 'contrôleur Wi-Fi'], ['tunnel', 'tunnel'], ['split-MAC', 'MAC partagée (AP + WLC)']],
		hint: 'FlexConnect = the AP can still switch traffic locally if the link to the WLC goes down.',
		fr: "Avec des AP lightweight, l'intelligence est dans le WLC : configuration, sécurité, roaming. L'AP garde les tâches en temps réel (envoi des trames radio, chiffrement). AP et WLC communiquent par deux tunnels CAPWAP : contrôle (UDP 5246, chiffré) et données (UDP 5247). En mode FlexConnect, un AP d'agence peut commuter le trafic localement même si le lien vers le WLC tombe.",
		quiz: [
			{ q: 'Which protocol connects lightweight APs to a WLC?', o: ['LWAPP only', 'CAPWAP', 'SNMP', 'LACP'], a: 1, why: 'CAPWAP.' },
			{ q: 'Which port does the CAPWAP data tunnel use?', o: ['UDP 5246', 'UDP 5247', 'TCP 443', 'UDP 161'], a: 1, why: '5246 contrôle, 5247 données.' },
			{ q: 'Which AP type is configured individually?', o: ['Lightweight', 'Autonomous', 'FlexConnect', 'Cloud-based'], a: 1, why: 'Les AP autonomes se configurent un par un.' }
		]
	},
	{
		day: 57,
		summary: 'Wireless security uses authentication and encryption. WEP is broken and must not be used. WPA2 uses AES-CCMP and WPA3 adds SAE for personal networks and stronger protection. Personal mode uses a pre-shared key; Enterprise mode uses 802.1X with a RADIUS server.',
		points: ['WEP and WPA (TKIP): obsolete.', 'WPA2: AES-CCMP. WPA3: GCMP, SAE, Protected Management Frames.', 'Personal = PSK / SAE. Enterprise = 802.1X + EAP + RADIUS.', 'EAP methods: EAP-TLS (certificates on both sides), PEAP, EAP-FAST.'],
		vocab: [['pre-shared key (PSK)', 'clé pré-partagée'], ['authentication server', 'serveur d\'authentification'], ['supplicant / authenticator', 'client / équipement d\'accès (802.1X)'], ['certificate', 'certificat'], ['obsolete', 'obsolète']],
		hint: '802.1X roles: supplicant (client), authenticator (AP or switch), authentication server (RADIUS).',
		fr: "En mode Personal, tout le monde partage la même clé (PSK en WPA2, SAE en WPA3, qui protège mieux contre les attaques par dictionnaire). En mode Enterprise, chaque utilisateur s'authentifie avec 802.1X : le client (supplicant) parle à l'AP (authenticator) qui interroge le serveur RADIUS. Le chiffrement est AES-CCMP en WPA2 et GCMP en WPA3.",
		quiz: [
			{ q: 'Which method replaces PSK in WPA3-Personal?', o: ['TKIP', 'SAE', 'WEP', 'LEAP'], a: 1, why: 'SAE.' },
			{ q: 'In 802.1X, what is the RADIUS server?', o: ['Supplicant', 'Authenticator', 'Authentication server', 'Access point'], a: 2, why: 'Le serveur d\'authentification.' },
			{ q: 'Which encryption does WPA2 use?', o: ['RC4', 'TKIP only', 'AES-CCMP', 'DES'], a: 2, why: 'AES-CCMP.' }
		]
	},
	{
		day: 58,
		summary: 'You configure a WLAN on a Cisco WLC through its web GUI. You create an interface (linked to a VLAN), then a WLAN with an SSID, then choose the security (for example WPA2 Personal with a PSK) and QoS. The WLC connects to the switch with a trunk, often with a LAG.',
		points: ['Steps: dynamic interface (VLAN) → WLAN (SSID) → security → QoS → enable.', 'WLC ports usually connect as 802.1Q trunks; LAG bundles them.', 'QoS profiles: Platinum (voice), Gold (video), Silver (best effort), Bronze (background).', 'Management access: HTTPS and SSH, not HTTP and Telnet.'],
		vocab: [['web GUI', 'interface graphique web'], ['dynamic interface', 'interface dynamique'], ['to enable', 'activer'], ['profile', 'profil'], ['best effort', 'au mieux (sans garantie)']],
		hint: 'Platinum is for voice. Remember: the most precious metal for the most sensitive traffic.',
		fr: "Sur le WLC : on crée une interface dynamique liée à un VLAN, puis le WLAN (SSID) associé à cette interface, puis on règle la sécurité (WPA2 + PSK par exemple) et le profil QoS (Platinum pour la voix, Gold pour la vidéo, Silver par défaut, Bronze pour le trafic de fond). Le WLC est relié au switch par des trunks, souvent regroupés en LAG.",
		quiz: [
			{ q: 'Which QoS profile is for voice on a WLC?', o: ['Bronze', 'Silver', 'Gold', 'Platinum'], a: 3, why: 'Platinum = voix.' },
			{ q: 'What is a WLAN linked to on the WLC?', o: ['A dynamic interface (VLAN)', 'A routing protocol', 'A DHCP snooping table', 'A loopback'], a: 0, why: 'Le WLAN est associé à une interface liée à un VLAN.' },
			{ q: 'How does a WLC usually connect to the switch?', o: ['Access port in VLAN 1', '802.1Q trunk (often LAG)', 'Console cable', 'Serial link'], a: 1, why: 'Par des trunks, souvent en LAG.' }
		]
	},
	{
		day: 59,
		summary: 'Network automation uses software and scripts instead of typing commands on each device. It reduces human errors, saves time and keeps configurations consistent. Devices have three planes: data plane (forwarding), control plane (building tables) and management plane (configuring and monitoring). AI can also help network operations.',
		points: ['Data plane: forwards traffic. Control plane: OSPF, STP, ARP. Management plane: SSH, SNMP.', 'Automation benefits: speed, consistency, fewer errors, easier scaling.', 'Predictive AI: forecasts problems from historical data.', 'Generative AI: creates content (configs, summaries) from prompts — always verify it.'],
		vocab: [['automation', 'automatisation'], ['data / control / management plane', 'plan de données / contrôle / gestion'], ['consistency', 'cohérence'], ['to scale', 'passer à l\'échelle'], ['predictive / generative AI', 'IA prédictive / générative']],
		hint: 'Ask yourself: does it forward packets (data), build tables (control), or manage the device (management)?',
		fr: "Le data plane transmet les paquets, le control plane construit les tables (routage, MAC, STP), le management plane sert à administrer (SSH, SNMP, API). L'automatisation remplace les configurations manuelles répétitives par des scripts ou des outils : moins d'erreurs et plus de cohérence. L'IA prédictive anticipe (saturation d'un lien), l'IA générative produit du contenu (une config) qu'il faut toujours vérifier.",
		quiz: [
			{ q: 'Which plane builds the routing table?', o: ['Data plane', 'Control plane', 'Management plane', 'User plane'], a: 1, why: 'Le control plane construit les tables.' },
			{ q: 'Which is a benefit of automation?', o: ['More manual work', 'Fewer human errors', 'More inconsistent configs', 'Slower changes'], a: 1, why: 'Moins d\'erreurs humaines.' },
			{ q: 'Forecasting link saturation from past traffic is an example of…', o: ['Generative AI', 'Predictive AI', 'SNMP traps', 'Syslog'], a: 1, why: 'IA prédictive.' }
		]
	},
	{
		day: 60,
		summary: 'Automation tools exchange data in structured formats. JSON is the most important for the CCNA: objects use curly braces with key/value pairs, arrays use square brackets. XML uses tags like HTML. YAML uses indentation and is used by Ansible.',
		points: ['JSON types: string, number, boolean, null, object { }, array [ ].', 'Keys are always strings in double quotes.', 'XML: <tag>value</tag>. YAML: "key: value" with indentation.', 'Whitespace does not matter in JSON, but it matters in YAML.'],
		vocab: [['data serialization', 'sérialisation de données'], ['key / value', 'clé / valeur'], ['object / array', 'objet / tableau'], ['curly braces / square brackets', 'accolades / crochets'], ['indentation', 'indentation']],
		commands: ['{ "interface": "GigabitEthernet0/1", "enabled": true, "vlans": [10, 20] }'],
		hint: 'JSON: double quotes only. Single quotes are invalid.',
		fr: "JSON est le format le plus testé. Un objet { } contient des paires \"clé\": valeur séparées par des virgules ; un tableau [ ] contient une liste de valeurs. Les clés sont toujours entre guillemets doubles, true/false/null s'écrivent sans guillemets. XML ressemble à du HTML avec des balises ; YAML utilise l'indentation (les espaces comptent !) et sert notamment à Ansible.",
		quiz: [
			{ q: 'Which symbols define a JSON array?', o: ['{ }', '[ ]', '< >', '( )'], a: 1, why: 'Les crochets [ ] définissent un tableau.' },
			{ q: 'Which JSON is valid?', o: ["{ 'vlan': 10 }", '{ "vlan": 10 }', '{ vlan: 10 }', '[ "vlan" = 10 ]'], a: 1, why: 'Clés entre guillemets doubles.' },
			{ q: 'Which format depends on indentation?', o: ['JSON', 'XML', 'YAML', 'CSV'], a: 2, why: 'YAML utilise l\'indentation.' }
		]
	},
	{
		day: 61,
		summary: 'A REST API lets programs talk to a device or controller over HTTP. You send a request with a method (GET, POST, PUT, DELETE) to a URI, and you get a response with a status code and usually JSON data. REST APIs are stateless, client-server, and can use caching.',
		points: ['CRUD: Create = POST, Read = GET, Update = PUT/PATCH, Delete = DELETE.', 'Status codes: 2xx success (200 OK, 201 Created), 4xx client error (401, 403, 404), 5xx server error.', 'Stateless: each request contains everything the server needs.', 'Authentication often uses a token in the HTTP header.'],
		vocab: [['API (Application Programming Interface)', 'interface de programmation'], ['request / response', 'requête / réponse'], ['status code', 'code de statut'], ['stateless', 'sans état'], ['endpoint / URI', 'point d\'accès / adresse de la ressource']],
		hint: '404 = Not Found. 401 = not authenticated. 403 = authenticated but not allowed.',
		fr: "Une API REST s'utilise avec des requêtes HTTP : GET pour lire, POST pour créer, PUT/PATCH pour modifier, DELETE pour supprimer (correspondance CRUD). La réponse contient un code (200 OK, 201 Created, 404 Not Found…) et des données, souvent en JSON. « Stateless » signifie que le serveur ne garde pas de contexte entre deux requêtes : chaque requête contient tout ce qu'il faut, y compris le jeton d'authentification.",
		quiz: [
			{ q: 'Which HTTP method creates a new resource?', o: ['GET', 'POST', 'DELETE', 'HEAD'], a: 1, why: 'POST = Create.' },
			{ q: 'What does status code 404 mean?', o: ['OK', 'Created', 'Not Found', 'Server error'], a: 2, why: '404 = ressource introuvable.' },
			{ q: 'What does "stateless" mean for REST?', o: ['The server stores each session', 'Each request contains all needed information', 'There is no authentication', 'Only GET is allowed'], a: 1, why: 'Chaque requête est autonome.' }
		]
	},
	{
		day: 62,
		summary: 'Software-Defined Networking (SDN) centralizes the control plane in a controller. Applications talk to the controller through northbound APIs, and the controller talks to devices through southbound APIs. Cisco Catalyst Center (formerly DNA Center) and SD-Access use an underlay and an overlay network.',
		points: ['Northbound API: apps ↔ controller (usually REST).', 'Southbound API: controller ↔ devices (NETCONF, RESTCONF, OpenFlow, SSH).', 'Underlay = the physical network. Overlay = virtual tunnels on top (VXLAN in SD-Access).', 'Fabric = underlay + overlay together.'],
		vocab: [['controller', 'contrôleur'], ['northbound / southbound', 'vers le haut (apps) / vers le bas (équipements)'], ['underlay / overlay', 'réseau sous-jacent / réseau virtuel'], ['fabric', 'fabric (ensemble underlay + overlay)'], ['intent-based networking', 'réseau basé sur l\'intention']],
		hint: 'Picture the controller in the middle: apps above (north), devices below (south).',
		fr: "En SDN, le control plane est centralisé dans un contrôleur qui a une vue globale du réseau. Au-dessus, les applications et scripts lui parlent via des API northbound (souvent REST). En dessous, il pilote les équipements via des API southbound (NETCONF, RESTCONF, OpenFlow). L'underlay est le réseau physique, l'overlay les tunnels virtuels construits par-dessus (VXLAN dans SD-Access).",
		quiz: [
			{ q: 'Which API is between the controller and the devices?', o: ['Northbound', 'Southbound', 'Eastbound', 'REST only'], a: 1, why: 'Southbound vers les équipements.' },
			{ q: 'What is the underlay?', o: ['The virtual tunnels', 'The physical network', 'The controller', 'The REST API'], a: 1, why: 'L\'underlay est le réseau physique.' },
			{ q: 'Where is the control plane in SDN?', o: ['On each switch only', 'Centralized in a controller', 'In the cloud only', 'In the end hosts'], a: 1, why: 'Centralisé dans le contrôleur.' }
		]
	},
	{
		day: 63,
		summary: 'Configuration management tools apply configurations to many devices automatically and keep them consistent. Ansible is agentless, uses SSH and YAML playbooks, and works in push mode. Terraform describes infrastructure as code (declarative, HCL). Puppet and Chef use agents and a pull model.',
		points: ['Ansible: agentless, push, SSH, playbooks in YAML, inventory of devices.', 'Terraform: infrastructure as code, declarative, HCL language, plan then apply.', 'Puppet: agent-based, pull, manifests. Chef: agent-based, pull, cookbooks/recipes (Ruby).', 'Configuration drift = devices slowly becoming different from the standard.'],
		vocab: [['configuration management', 'gestion de configuration'], ['agentless', 'sans agent'], ['playbook', 'playbook (fichier de tâches)'], ['infrastructure as code', 'infrastructure en tant que code'], ['configuration drift', 'dérive de configuration']],
		hint: 'Ansible = no Agent, uses SSH, YAML. Easy to remember: A for Agentless.',
		fr: "Ces outils évitent la dérive de configuration (des équipements qui deviennent tous un peu différents). Ansible n'a pas besoin d'agent : il se connecte en SSH et pousse (push) des playbooks écrits en YAML. Terraform décrit l'état voulu de l'infrastructure (déclaratif), calcule un plan puis l'applique. Puppet et Chef installent un agent sur chaque machine qui vient chercher (pull) sa configuration.",
		quiz: [
			{ q: 'Which tool is agentless and uses SSH?', o: ['Puppet', 'Chef', 'Ansible', 'SNMP'], a: 2, why: 'Ansible.' },
			{ q: 'Which language are Ansible playbooks written in?', o: ['JSON', 'YAML', 'Ruby', 'HCL'], a: 1, why: 'YAML.' },
			{ q: 'What is configuration drift?', o: ['A routing loop', 'Devices slowly differing from the standard config', 'A Wi-Fi issue', 'An API error'], a: 1, why: 'La dérive progressive des configurations.' }
		]
	}
];
