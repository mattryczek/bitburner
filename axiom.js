/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog('ALL');

	let server = ns.args[0];
	ns.print(`Hack script targeting ${server}...`);

	if (ns.hasRootAccess(server)) {
		ns.print(`Already have root!`);
	} else {
		ns.nuke(server);
		ns.print(`Got root on ${server} for the first time!`);
	}

	let msg;
	let server_min_sec_lvl = ns.getServerMinSecurityLevel(server);
	let server_max_money = ns.getServerMaxMoney(server);

	ns.print(`Current server funds: ${ns.getServerMoneyAvailable(server)}`);
	ns.print(`Current server sec level: ${ns.getServerSecurityLevel(server)}`);

	while (1) {
		if (ns.getServerSecurityLevel(server) > server_min_sec_lvl) {
			ns.print(`Weakening ${server}`);
			msg = await ns.weaken(server, 3);
			ns.print(`Server weakened by ${msg}. Current sec level: ${ns.getServerSecurityLevel(server)}`);
		} else if (ns.getServerMoneyAvailable(server) < server_max_money) {
			ns.print(`Growing ${server}`);
			msg = await ns.grow(server);
			ns.print(`Server grown by ${msg}. Current funds: ${ns.getServerMoneyAvailable(server)}`);
		} else {
			ns.print(`Hacking ${server}`);
			msg = await ns.hack(server);
			ns.print(`Hacked ${msg} funds from ${server}`);
		}
	}

}