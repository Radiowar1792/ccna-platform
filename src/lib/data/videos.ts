// Cours "Free CCNA 200-301 Complete Course" de Jeremy's IT Lab.
// Les identifiants YouTube sont remplis par la synchronisation de la playlist (page Vidéos).
export const JEREMY_PLAYLIST = 'PLxbwE86jKRgMpuZuLBivzlM8s2Dk5lXBQ';

export interface CourseDay {
	day: number;
	title: string;
	topics: string[];
}

export const COURSE: CourseDay[] = [
	{ day: 1, title: 'Network Devices', topics: ['1.1'] },
	{ day: 2, title: 'Interfaces and Cables', topics: ['1.3'] },
	{ day: 3, title: 'OSI Model & TCP/IP Suite', topics: ['1.5'] },
	{ day: 4, title: 'Intro to the CLI', topics: ['2.8', '5.3'] },
	{ day: 5, title: 'Ethernet LAN Switching (Part 1)', topics: ['1.13'] },
	{ day: 6, title: 'Ethernet LAN Switching (Part 2)', topics: ['1.13'] },
	{ day: 7, title: 'IPv4 Addressing (Part 1)', topics: ['1.6'] },
	{ day: 8, title: 'IPv4 Addressing (Part 2)', topics: ['1.6', '1.7'] },
	{ day: 9, title: 'Switch Interfaces', topics: ['1.4'] },
	{ day: 10, title: 'The IPv4 Header', topics: ['1.6'] },
	{ day: 11, title: 'Routing Fundamentals', topics: ['3.1', '3.2', '3.3'] },
	{ day: 12, title: 'The Life of a Packet', topics: ['3.2'] },
	{ day: 13, title: 'Subnetting (Part 1)', topics: ['1.6'] },
	{ day: 14, title: 'Subnetting (Part 2)', topics: ['1.6'] },
	{ day: 15, title: 'Subnetting (Part 3 – VLSM)', topics: ['1.6'] },
	{ day: 16, title: 'VLANs (Part 1)', topics: ['2.1'] },
	{ day: 17, title: 'VLANs (Part 2)', topics: ['2.1', '2.2'] },
	{ day: 18, title: 'VLANs (Part 3)', topics: ['2.1', '2.2'] },
	{ day: 19, title: 'DTP/VTP', topics: ['2.2'] },
	{ day: 20, title: 'Spanning Tree Protocol (Part 1)', topics: ['2.5'] },
	{ day: 21, title: 'Spanning Tree Protocol (Part 2)', topics: ['2.5'] },
	{ day: 22, title: 'Rapid Spanning Tree Protocol', topics: ['2.5'] },
	{ day: 23, title: 'EtherChannel', topics: ['2.4'] },
	{ day: 24, title: 'Dynamic Routing', topics: ['3.1', '3.2'] },
	{ day: 25, title: 'RIP & EIGRP', topics: ['3.2'] },
	{ day: 26, title: 'OSPF (Part 1)', topics: ['3.4'] },
	{ day: 27, title: 'OSPF (Part 2)', topics: ['3.4'] },
	{ day: 28, title: 'OSPF (Part 3)', topics: ['3.4'] },
	{ day: 29, title: 'First Hop Redundancy Protocols', topics: ['3.5'] },
	{ day: 30, title: 'TCP & UDP', topics: ['1.5'] },
	{ day: 31, title: 'IPv6 (Part 1)', topics: ['1.8'] },
	{ day: 32, title: 'IPv6 (Part 2)', topics: ['1.8', '1.9'] },
	{ day: 33, title: 'IPv6 (Part 3)', topics: ['1.9', '3.3'] },
	{ day: 34, title: 'Standard ACLs', topics: ['5.6'] },
	{ day: 35, title: 'Extended ACLs', topics: ['5.6'] },
	{ day: 36, title: 'CDP & LLDP', topics: ['2.3'] },
	{ day: 37, title: 'NTP', topics: ['4.2'] },
	{ day: 38, title: 'DNS', topics: ['4.3'] },
	{ day: 39, title: 'DHCP', topics: ['4.3', '4.6', '1.10'] },
	{ day: 40, title: 'SNMP', topics: ['4.4'] },
	{ day: 41, title: 'Syslog', topics: ['4.5'] },
	{ day: 42, title: 'SSH', topics: ['4.8', '2.8'] },
	{ day: 43, title: 'FTP & TFTP', topics: ['4.9'] },
	{ day: 44, title: 'NAT (Part 1)', topics: ['4.1'] },
	{ day: 45, title: 'NAT (Part 2)', topics: ['4.1'] },
	{ day: 46, title: 'QoS (Part 1)', topics: ['4.7'] },
	{ day: 47, title: 'QoS (Part 2)', topics: ['4.7'] },
	{ day: 48, title: 'Security Fundamentals', topics: ['5.1', '5.2', '5.4', '5.5', '5.8'] },
	{ day: 49, title: 'Port Security', topics: ['5.7'] },
	{ day: 50, title: 'DHCP Snooping', topics: ['5.7'] },
	{ day: 51, title: 'Dynamic ARP Inspection', topics: ['5.7'] },
	{ day: 52, title: 'LAN Architectures', topics: ['1.2'] },
	{ day: 53, title: 'WAN Architectures', topics: ['1.2', '5.5'] },
	{ day: 54, title: 'Virtualization & Cloud', topics: ['1.12', '1.2'] },
	{ day: 55, title: 'Wireless Fundamentals', topics: ['1.11'] },
	{ day: 56, title: 'Wireless Architectures', topics: ['2.6', '2.7'] },
	{ day: 57, title: 'Wireless Security', topics: ['5.9'] },
	{ day: 58, title: 'Wireless Configuration', topics: ['2.9', '5.10'] },
	{ day: 59, title: 'Intro to Network Automation', topics: ['6.1', '6.2', '6.4'] },
	{ day: 60, title: 'JSON, XML & YAML', topics: ['6.7'] },
	{ day: 61, title: 'REST APIs', topics: ['6.5'] },
	{ day: 62, title: 'Software-Defined Networking', topics: ['6.2', '6.3'] },
	{ day: 63, title: 'Ansible, Puppet & Chef / Terraform', topics: ['6.6'] }
];

export function searchUrl(day: number): string {
	return `https://www.youtube.com/results?search_query=${encodeURIComponent(`Jeremy's IT Lab Free CCNA Day ${day}`)}`;
}
