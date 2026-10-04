// Thèmes officiels de l'examen CCNA 200-301 v1.1 (reformulés en français).
export interface Domain {
	id: string;
	en: string;
	fr: string;
	weight: number;
	topics: [code: string, label: string][];
}

export const DOMAINS: Domain[] = [
	{ id: '1', en: 'Network Fundamentals', fr: 'Fondamentaux réseau', weight: 20, topics: [
		['1.1', 'Rôle des équipements : routeurs, switchs L2/L3, NGFW/IPS, AP, WLC, endpoints, serveurs, PoE'],
		['1.2', 'Topologies : 2 et 3 tiers, spine-leaf, WAN, SOHO, on-premise vs cloud'],
		['1.3', 'Câblage : fibre mono/multimode, cuivre, Ethernet partagé vs point à point'],
		['1.4', "Problèmes d'interface et de câble : collisions, erreurs, duplex, vitesse"],
		['1.5', 'TCP vs UDP'],
		['1.6', 'Adressage IPv4 et subnetting'],
		['1.7', 'Adressage IPv4 privé'],
		['1.8', 'Adressage IPv6 et préfixes'],
		['1.9', "Types d'adresses IPv6 : global unicast, unique local, link-local, anycast, multicast, EUI-64"],
		['1.10', 'Vérifier la config IP des postes (Windows, macOS, Linux)'],
		['1.11', 'Principes du Wi-Fi : canaux non chevauchants, SSID, RF, chiffrement'],
		['1.12', 'Virtualisation : serveurs, conteneurs, VRF'],
		['1.13', 'Switching : apprentissage et vieillissement MAC, flooding, table MAC']
	]},
	{ id: '2', en: 'Network Access', fr: 'Accès réseau', weight: 20, topics: [
		['2.1', "VLAN : ports d'accès (data et voix), VLAN par défaut, inter-VLAN"],
		['2.2', 'Trunks 802.1Q et VLAN natif'],
		['2.3', 'CDP et LLDP'],
		['2.4', 'EtherChannel (LACP) L2 et L3'],
		['2.5', 'Rapid PVST+ : root bridge, rôles et états des ports, PortFast, root/loop/BPDU guard'],
		['2.6', 'Architectures Wi-Fi et modes des AP'],
		['2.7', 'Connexions physiques WLAN : AP, WLC, trunk, LAG'],
		['2.8', 'Accès de gestion : console, Telnet, SSH, HTTP/S, TACACS+/RADIUS, cloud'],
		['2.9', 'Interface graphique du WLC : création WLAN, sécurité, QoS']
	]},
	{ id: '3', en: 'IP Connectivity', fr: 'Connectivité IP', weight: 25, topics: [
		['3.1', 'Lire une table de routage : code, préfixe, masque, next hop, AD, métrique, passerelle par défaut'],
		['3.2', 'Décision de routage : longest prefix match, AD, métrique'],
		['3.3', 'Routes statiques IPv4/IPv6 : par défaut, réseau, hôte, flottante'],
		['3.4', 'OSPFv2 single-area : voisins, point à point, DR/BDR, router ID'],
		['3.5', 'FHRP (HSRP)']
	]},
	{ id: '4', en: 'IP Services', fr: 'Services IP', weight: 10, topics: [
		['4.1', 'NAT statique et pools (+ PAT)'],
		['4.2', 'NTP client/serveur'],
		['4.3', 'Rôle de DHCP et DNS'],
		['4.4', 'SNMP'],
		['4.5', 'Syslog : facilities et niveaux'],
		['4.6', 'DHCP client et relay'],
		['4.7', 'QoS : classification, marquage, files, congestion, policing, shaping'],
		['4.8', 'Accès distant SSH'],
		['4.9', 'TFTP et FTP']
	]},
	{ id: '5', en: 'Security Fundamentals', fr: 'Sécurité', weight: 15, topics: [
		['5.1', 'Menaces, vulnérabilités, exploits, mitigation'],
		['5.2', 'Programmes de sécurité : sensibilisation, formation, accès physique'],
		['5.3', 'Mots de passe locaux sur les équipements'],
		['5.4', 'Politiques de mots de passe, MFA, certificats, biométrie'],
		['5.5', 'VPN IPsec site à site et accès distant'],
		['5.6', 'ACL'],
		['5.7', 'Sécurité L2 : DHCP snooping, DAI, port security'],
		['5.8', 'AAA : authentification, autorisation, traçabilité'],
		['5.9', 'Sécurité Wi-Fi : WPA, WPA2, WPA3'],
		['5.10', "Config d'un WLAN WPA2-PSK via l'interface graphique"]
	]},
	{ id: '6', en: 'Automation & Programmability', fr: 'Automatisation', weight: 10, topics: [
		['6.1', "Impact de l'automatisation sur la gestion du réseau"],
		['6.2', 'Réseau traditionnel vs piloté par contrôleur'],
		['6.3', 'SDN : overlay, underlay, fabric, plans de contrôle et de données, API northbound/southbound'],
		['6.4', "IA générative et prédictive dans l'exploitation réseau"],
		['6.5', 'API REST : CRUD, verbes HTTP, encodage des données'],
		['6.6', 'Gestion de configuration : Ansible et Terraform'],
		['6.7', 'Lire du JSON']
	]}
];

export const ALL_TOPICS = DOMAINS.flatMap((d) => d.topics.map(([code, label]) => ({ code, label, domain: d.id })));

export function domainOf(code: string): string {
	return code.split('.')[0];
}
