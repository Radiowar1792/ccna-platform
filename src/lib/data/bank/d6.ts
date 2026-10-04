// Banque de questions originales — Domaine 6.0 Automation & Programmability (10 % de l'examen).
import type { SeedQuestion } from '../questions';

const q = (key: string, topic: string, stem: string, options: string[], answer: number[], explanation: string): SeedQuestion => ({ key, topic, stem, options, answer, explanation });

const JSON_EX = `{
  "device": "R1",
  "interfaces": [
    { "name": "GigabitEthernet0/0", "ip": "10.0.0.1", "enabled": true },
    { "name": "GigabitEthernet0/1", "ip": null, "enabled": false }
  ],
  "uptime_days": 42
}`;

export const BANK_D6: SeedQuestion[] = [
	// 6.1 Automation impact
	q('b6-001', '6.1', 'Which two are benefits of network automation? (Choose two.)', ['Fewer configuration errors', 'Consistent configurations across devices', 'No need for any network knowledge', 'Eliminates all outages', 'More manual CLI work'], [0, 1], 'L\'automatisation réduit les erreurs humaines et garantit la cohérence.'),
	q('b6-002', '6.1', 'What is "configuration drift"?', ['A WAN failover', 'Devices gradually differing from the approved standard configuration', 'A routing loop', 'A Wi-Fi roaming event'], [1], 'Dérive de configuration : chaque modification manuelle éloigne l\'équipement du standard.'),
	q('b6-003', '6.1', 'Which statement about automation and network engineers is most accurate?', ['Engineers no longer need networking skills', 'Engineers combine networking knowledge with scripting and APIs', 'Automation only works on wireless', 'Automation replaces routing protocols'], [1], 'Il faut toujours comprendre le réseau ; l\'automatisation est un outil en plus.'),

	// 6.2 Traditional vs controller-based
	q('b6-004', '6.2', 'In a traditional network, where is the control plane located?', ['In a central controller', 'Distributed on each device', 'In the cloud only', 'On the end hosts'], [1], 'Traditionnel : chaque équipement calcule lui-même (OSPF, STP…).'),
	q('b6-005', '6.2', 'Which is a characteristic of controller-based networking?', ['Every change is done by CLI on each box', 'Policies are defined centrally and pushed to devices', 'Devices have no data plane', 'It cannot use APIs'], [1], 'Le contrôleur centralise la politique et la pousse aux équipements.'),
	q('b6-006', '6.2', 'Which Cisco product is a controller for enterprise campus networks (intent-based networking)?', ['Cisco Catalyst Center (formerly DNA Center)', 'Cisco Packet Tracer', 'Cisco Webex', 'Cisco AnyConnect'], [0], 'Catalyst Center (ex-DNA Center) est le contrôleur SD-Access du campus.'),
	q('b6-007', '6.2', 'Which plane forwards user traffic?', ['Management plane', 'Control plane', 'Data plane', 'Application plane'], [2], 'Le data plane (forwarding plane) transmet les paquets.'),
	q('b6-008', '6.2', 'SSH and SNMP belong to which plane?', ['Data plane', 'Control plane', 'Management plane', 'Overlay plane'], [2], 'Management plane : accès et supervision de l\'équipement.'),

	// 6.3 SDN
	q('b6-009', '6.3', 'Which southbound protocols can a controller use to configure devices? (Choose two.)', ['NETCONF', 'OpenFlow', 'REST between the app and the controller', 'SMTP', 'DHCP'], [0, 1], 'NETCONF, RESTCONF, OpenFlow, SSH sont des API southbound. REST entre l\'application et le contrôleur est northbound.'),
	q('b6-010', '6.3', 'In Cisco SD-Access, which technology builds the overlay data plane?', ['VXLAN', 'GRE only', 'MPLS', 'PPP'], [0], 'SD-Access : VXLAN pour le data plane, LISP pour le control plane.'),
	q('b6-011', '6.3', 'What is the underlay in SD-Access?', ['Virtual tunnels between edge nodes', 'The physical IP network that carries the overlay', 'The controller GUI', 'The REST API'], [1], 'L\'underlay est le réseau IP physique routé.'),
	q('b6-012', '6.3', 'What does a northbound API allow?', ['A controller to configure switches', 'Applications and scripts to request information or changes from the controller', 'Switches to exchange BPDUs', 'Routers to share LSAs'], [1], 'Northbound : entre l\'application et le contrôleur.'),
	q('b6-013', '6.3', 'What is a "fabric" in SDN?', ['A cable type', 'The combination of underlay and overlay forming one logical network', 'A Wi-Fi channel', 'An ACL'], [1], 'Fabric = underlay + overlay.'),

	// 6.4 AI in network operations
	q('b6-014', '6.4', 'Which task is an example of generative AI in network operations?', ['Predicting link failures from telemetry trends', 'Writing a draft configuration or summary from a natural-language request', 'Counting interface errors', 'Running STP'], [1], 'L\'IA générative produit du contenu (config, résumé) — à vérifier avant usage.'),
	q('b6-015', '6.4', 'Which task is an example of predictive AI or machine learning?', ['Detecting unusual traffic patterns compared with a learned baseline', 'Typing commands faster', 'Assigning VLAN IDs manually', 'Replacing NTP'], [0], 'Le ML apprend une référence (baseline) et détecte les anomalies ou prédit les pannes.'),
	q('b6-016', '6.4', 'Why must AI-generated configurations be reviewed before deployment?', ['They are always encrypted', 'They can contain mistakes or invented commands', 'They use too much bandwidth', 'They cannot be read by humans'], [1], 'Une IA générative peut produire des erreurs plausibles : on vérifie et on teste.'),

	// 6.5 REST APIs
	q('b6-017', '6.5', 'Which HTTP method updates an existing resource?', ['GET', 'POST', 'PUT', 'DELETE'], [2], 'PUT (ou PATCH) = Update ; POST = Create.'),
	q('b6-018', '6.5', 'Which HTTP status code means the request succeeded and a new resource was created?', ['200', '201', '204', '301'], [1], '201 Created.'),
	q('b6-019', '6.5', 'Which HTTP status code means the client is not authenticated?', ['400', '401', '403', '500'], [1], '401 Unauthorized (pas authentifié) ; 403 Forbidden (authentifié mais non autorisé).'),
	q('b6-020', '6.5', 'Which status code class indicates a server-side error?', ['2xx', '3xx', '4xx', '5xx'], [3], '5xx = erreur du serveur.'),
	q('b6-021', '6.5', 'Which two are REST constraints? (Choose two.)', ['Stateless', 'Client-server', 'Requires XML only', 'Requires a VPN', 'Uses only UDP'], [0, 1], 'REST : client-serveur, sans état, cache possible, interface uniforme.'),
	q('b6-022', '6.5', 'Where is an API authentication token usually sent?', ['In the URL path only', 'In an HTTP header', 'In the TCP options', 'In the DNS query'], [1], 'Le jeton est envoyé dans un en-tête HTTP (Authorization, X-Auth-Token…).'),
	q('b6-023', '6.5', 'Which data formats are commonly used in REST API payloads? (Choose two.)', ['JSON', 'XML', 'MP3', 'PNG', 'CSV only'], [0, 1], 'JSON surtout, et XML.'),

	// 6.6 Configuration management
	q('b6-024', '6.6', 'Which tool is agentless and uses SSH to push YAML playbooks?', ['Puppet', 'Chef', 'Ansible', 'SaltStack minion'], [2], 'Ansible : sans agent, push, SSH, YAML.'),
	q('b6-025', '6.6', 'Which tool describes infrastructure declaratively in HCL and applies it with "plan" and "apply"?', ['Ansible', 'Terraform', 'Chef', 'Python netmiko'], [1], 'Terraform : infrastructure as code déclarative (HCL).'),
	q('b6-026', '6.6', 'Which tools traditionally use an agent and a pull model? (Choose two.)', ['Puppet', 'Chef', 'Ansible', 'Terraform', 'Postman'], [0, 1], 'Puppet et Chef installent un agent qui vient chercher sa configuration.'),
	q('b6-027', '6.6', 'In Ansible, which file lists the devices to manage?', ['Playbook', 'Inventory', 'Manifest', 'Cookbook'], [1], 'L\'inventaire liste les hôtes ; le playbook décrit les tâches.'),
	q('b6-028', '6.6', 'What does "declarative" mean for a configuration tool?', ['You describe each command step by step', 'You describe the desired end state and the tool works out how to reach it', 'You write Python only', 'You use the CLI manually'], [1], 'Déclaratif = on décrit l\'état voulu, pas les étapes.'),

	// 6.7 JSON
	q('b6-029', '6.7', `Refer to the exhibit.\n\n${JSON_EX}\n\nWhat type of value is "interfaces"?`, ['Object', 'Array', 'String', 'Boolean'], [1], 'Les crochets [ ] délimitent un tableau (array) d\'objets.'),
	q('b6-030', '6.7', `Refer to the exhibit.\n\n${JSON_EX}\n\nHow many key/value pairs are in the top-level object?`, ['2', '3', '4', '6'], [1], 'device, interfaces, uptime_days : 3 paires au premier niveau.'),
	q('b6-031', '6.7', `Refer to the exhibit.\n\n${JSON_EX}\n\nWhat is the value of "enabled" for GigabitEthernet0/1?`, ['"false" (a string)', 'false (a boolean)', 'null', '0'], [1], 'false sans guillemets = booléen.'),
	q('b6-032', '6.7', 'Which JSON value type is written without quotes and means "no value"?', ['empty', 'null', 'none', 'nil'], [1], 'null.'),
	q('b6-033', '6.7', 'Which character separates a key from its value in JSON?', ['=', ':', ';', ','], [1], 'Deux-points entre la clé et la valeur ; virgule entre les paires.'),
	q('b6-034', '6.7', 'Which JSON is valid?', ['{"vlans": [10, 20, 30]}', "{'vlans': [10, 20, 30]}", '{"vlans": [10, 20, 30],}', '{vlans: [10, 20, 30]}'], [0], 'Guillemets doubles obligatoires, pas de virgule finale.')
];
