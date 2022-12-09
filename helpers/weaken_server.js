/** @param {NS} ns */

export async function main(ns) {
	let target = ns.args[0];

	let threads, servers = 0;
	let total_threads = 1 - 1;
	let ram_req = ns.getScriptRam('weaken-ng.js');

	ns.tprint(`\n\nCurrent weaken-ng.js impl needs ${ram_req}GB per thread.\n\n`);

	for (let server of ns.scan("home")) {
		let max_ram = ns.getServerMaxRam(server);
		if (max_ram == 0) { continue };
		servers++;

		await ns.scp('weaken-ng.js', server);
		ns.killall(server);

		threads = Math.floor(max_ram / ram_req);
		total_threads += threads;

		ns.tprint(`(${max_ram}GB => ${threads} threads): ${server}`);

		ns.exec("weaken-ng.js", server, threads, target, threads);
	}

	ns.tprint(``);
	ns.tprint(`Successfully spawned ${total_threads} weaken threads across ${servers} servers.`);
	ns.tprint(`This will weaken >>${target}<< by ${(0.05 * total_threads).toFixed(4)} per iteration.`);
	ns.tprint(`Script ETA ${Math.trunc(ns.getWeakenTime(target) / 1000)}s this iteration.`);
}