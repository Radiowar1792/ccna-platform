// Official CCNA 200-301 v1.1 exam topics (short wording).
export interface Domain {
	id: string;
	en: string;
	name: string;
	weight: number;
	topics: [code: string, label: string][];
}

export const DOMAINS: Domain[] = [
	{ id: '1', en: 'Network Fundamentals', name: 'Network Fundamentals', weight: 20, topics: [
		['1.1', 'Role of network components: routers, L2/L3 switches, NGFW/IPS, APs, WLCs, endpoints, servers, PoE'],
		['1.2', 'Topology architectures: two-tier, three-tier, spine-leaf, WAN, SOHO, on-premises vs cloud'],
		['1.3', 'Physical interfaces and cabling: single-mode/multimode fiber, copper, shared media vs point-to-point'],
		['1.4', 'Interface and cable issues: collisions, errors, duplex mismatch, speed'],
		['1.5', 'TCP vs UDP'],
		['1.6', 'IPv4 addressing and subnetting'],
		['1.7', 'Private IPv4 addressing'],
		['1.8', 'IPv6 addressing and prefixes'],
		['1.9', 'IPv6 address types: global unicast, unique local, link-local, anycast, multicast, modified EUI-64'],
		['1.10', 'Verify IP parameters for client OS (Windows, macOS, Linux)'],
		['1.11', 'Wireless principles: non-overlapping channels, SSID, RF, encryption'],
		['1.12', 'Virtualization: server virtualization, containers, VRFs'],
		['1.13', 'Switching concepts: MAC learning and aging, frame switching, flooding, MAC address table']
	]},
	{ id: '2', en: 'Network Access', name: 'Network Access', weight: 20, topics: [
		['2.1', 'VLANs: access ports (data and voice), default VLAN, inter-VLAN connectivity'],
		['2.2', 'Interswitch connectivity: trunk ports, 802.1Q, native VLAN'],
		['2.3', 'Layer 2 discovery protocols: CDP and LLDP'],
		['2.4', 'EtherChannel (LACP), Layer 2 and Layer 3'],
		['2.5', 'Rapid PVST+: root bridge, port roles and states, PortFast, root guard, loop guard, BPDU guard'],
		['2.6', 'Cisco wireless architectures and AP modes'],
		['2.7', 'WLAN physical infrastructure: AP, WLC, access/trunk ports, LAG'],
		['2.8', 'Device management access: console, Telnet, SSH, HTTP/HTTPS, TACACS+/RADIUS, cloud managed'],
		['2.9', 'WLC GUI: WLAN creation, security settings, QoS profiles, advanced settings']
	]},
	{ id: '3', en: 'IP Connectivity', name: 'IP Connectivity', weight: 25, topics: [
		['3.1', 'Routing table: protocol code, prefix, mask, next hop, AD, metric, gateway of last resort'],
		['3.2', 'Forwarding decision: longest prefix match, administrative distance, metric'],
		['3.3', 'IPv4 and IPv6 static routing: default, network, host, floating static'],
		['3.4', 'Single-area OSPFv2: neighbor adjacencies, point-to-point, broadcast (DR/BDR), router ID'],
		['3.5', 'First hop redundancy protocols (FHRP)']
	]},
	{ id: '4', en: 'IP Services', name: 'IP Services', weight: 10, topics: [
		['4.1', 'Inside source NAT: static and pools (+ PAT)'],
		['4.2', 'NTP in client and server mode'],
		['4.3', 'Role of DHCP and DNS'],
		['4.4', 'Function of SNMP'],
		['4.5', 'Syslog: facilities and severity levels'],
		['4.6', 'DHCP client and relay'],
		['4.7', 'QoS: classification, marking, queuing, congestion, policing, shaping'],
		['4.8', 'Remote access with SSH'],
		['4.9', 'TFTP and FTP in the network']
	]},
	{ id: '5', en: 'Security Fundamentals', name: 'Security Fundamentals', weight: 15, topics: [
		['5.1', 'Key concepts: threats, vulnerabilities, exploits, mitigation'],
		['5.2', 'Security programs: user awareness, training, physical access control'],
		['5.3', 'Device access control with local passwords'],
		['5.4', 'Password policies, MFA, certificates, biometrics'],
		['5.5', 'IPsec VPNs: site-to-site and remote access'],
		['5.6', 'Access control lists (ACLs)'],
		['5.7', 'Layer 2 security: DHCP snooping, DAI, port security'],
		['5.8', 'AAA: authentication, authorization, accounting'],
		['5.9', 'Wireless security protocols: WPA, WPA2, WPA3'],
		['5.10', 'Configure a WLAN with WPA2 PSK using the GUI']
	]},
	{ id: '6', en: 'Automation & Programmability', name: 'Automation & Programmability', weight: 10, topics: [
		['6.1', 'How automation impacts network management'],
		['6.2', 'Traditional networks vs controller-based networking'],
		['6.3', 'Software-defined architectures: overlay, underlay, fabric, control/data plane, northbound/southbound APIs'],
		['6.4', 'AI (generative and predictive) and machine learning in network operations'],
		['6.5', 'REST APIs: CRUD, HTTP verbs, data encoding'],
		['6.6', 'Configuration management: Ansible and Terraform'],
		['6.7', 'Recognize components of JSON-encoded data']
	]}
];

export const ALL_TOPICS = DOMAINS.flatMap((d) => d.topics.map(([code, label]) => ({ code, label, domain: d.id })));

export function domainOf(code: string): string {
	return code.split('.')[0];
}
