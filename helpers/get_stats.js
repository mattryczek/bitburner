/** @param {NS} ns */

export async function main(ns) {
	let target = ns.args[0];
	
	let server_funds, sec, level, ram_used, ram_total, ports = 0;
	let root = false;

	root = ns.hasRootAccess(target);
	ram_used = ns.getServerUsedRam(target);
	ram_total = ns.getServerMaxRam(target);
	server_funds = ns.getServerMoneyAvailable(target);
	sec = ns.getServerRequiredHackingLevel(target);
	level = ns.getServerSecurityLevel(target);
	ports = ns.getServerNumPortsRequired(target);

	ns.tprint('         __' + '_'.repeat(target.toString().length) + '__');
	ns.tprint(`         >>${target}<<`);
	ns.tprint('         ‾‾' + '‾'.repeat(target.toString().length) + '‾‾');

	ns.tprint(`Root status: ${root}`);
	ns.tprint(`Number of ports to NUKE: ${ports}`);
	ns.tprint(`RAM Usage: ${ram_used}GB / ${ram_total}GB`)
	ns.tprint(`Current funds: \$${Math.trunc(server_funds).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);
	ns.tprint(`Required Hack Level: ${sec}`);
	ns.tprint(`Current Security Level: ${level.toFixed(4)}\n\n`);
}