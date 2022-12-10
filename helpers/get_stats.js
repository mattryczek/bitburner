/** @param {NS} ns */

import fmt from "./helpers/fmt.js";

export async function main(ns) {
	let target = ns.args[0];

	let server_funds, sec, min_sec, level, ram_used, ram_total, ports = 0;
	let root = false;

	root = ns.hasRootAccess(target) ? '✅' : '❌';
	ram_used = ns.getServerUsedRam(target);
	ram_total = ns.getServerMaxRam(target);
	server_funds = ns.getServerMoneyAvailable(target);
	max_funds = ns.getServerMaxMoney(target);
	sec = ns.getServerRequiredHackingLevel(target);
	min_sec = ns.getServerMinSecurityLevel(target);
	level = ns.getServerSecurityLevel(target);

	let header = `${root} ${target}`;

	ns.tprint('         ' + '_'.repeat(header.length + 1));
	ns.tprint(`         ${header}`);
	ns.tprint('         ' + '‾'.repeat(header.length + 1) );

	ns.tprint('');

	if (!ns.hasRootAccess(target)) ns.tprint(`☢️ Number of ports to NUKE: ${ns.getServerNumPortsRequired(target)}`)

	ns.tprint(`💾 RAM: ${ram_used}GB / ${ram_total}GB`)
	ns.tprint(`💰 Money: \$${fmt(Math.trunc(server_funds))} / \$${fmt(Math.trunc(max_funds))}`);

	if (ns.getHackingLevel() < sec) ns.tprint(`👨‍💻 Required Hack Level: ${sec}`);

	ns.tprint(`🔐 Security: ${level.toFixed(4)} / ${min_sec.toFixed(4)}\n\n`);
}