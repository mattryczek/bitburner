/** @param {NS} ns */

export default function get_stats(ns, server) {
	let server_funds, sec, level, ram_used, ram_total, ports = 0;
	let root = false;

	root = ns.hasRootAccess(server);
	ram_used = ns.getServerUsedRam(server);
	ram_total = ns.getServerMaxRam(server);
	server_funds = ns.getServerMoneyAvailable(server);
	sec = ns.getServerRequiredHackingLevel(server);
	level = ns.getServerSecurityLevel(server);
	ports = ns.getServerNumPortsRequired(server);

	ns.tprint('         __' + '_'.repeat(server.toString().length) + '__');
	ns.tprint(`         >>${server}<<`);
	ns.tprint('         ‾‾' + '‾'.repeat(server.toString().length) + '‾‾');

	ns.tprint(`Root status: ${root}`);
	ns.tprint(`Number of ports to NUKE: ${ports}`);
	ns.tprint(`RAM Usage: ${ram_used}GB / ${ram_total}GB`)
	ns.tprint(`Current funds: \$${Math.trunc(server_funds).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} `);
	ns.tprint(`Required Hack Level: ${sec} `);
	ns.tprint(`Current Security Level: ${level.toFixed(4)}\n\n`);
}