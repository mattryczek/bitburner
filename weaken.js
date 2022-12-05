/** @param {NS} ns */

export async function main(ns) {
	ns.disableLog('ALL');
	let server = ns.args[0];
	ns.print(`Weaken script targeting ${server} with ${ns.args[1]} threads.`);
	ns.print(`Script ETA ${Math.trunc(ns.getWeakenTime(server))}ms.`);

	let min_sec = ns.getServerMinSecurityLevel(server);
	let res = 0;

	while(ns.getServerSecurityLevel(server) > min_sec){
		await ns.weaken(server, {threads: ns.args[1]});
		ns.print(`Script ETA ${Math.trunc(ns.getWeakenTime(server))}ms.`);
		ns.print(`Iteration complete, server security at ${ns.getServerSecurityLevel(server).toFixed(4)}`)
	}

	ns.tprint(`${server} weakened to ${min_sec} and cannot be weakened further. Exiting.`);
}