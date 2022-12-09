/** @param {NS} ns */

export default async function grow_server(ns, target) {
	let threads, servers = 0;
	let total_threads = 1 - 1;
	let script_ram = ns.getScriptRam('weaken.js');
	ns.tprint(`\n\nCurrent grow.js impl needs ${script_ram}GB per thread.\n\n`);

	for (let server of ns.scan("home")) {
		let max_ram = ns.getServerMaxRam(server);
		if (max_ram == 0) { continue };
		servers++;

		await ns.scp('grow.js', server);
		ns.killall(server);

		threads = Math.floor(max_ram / script_ram);
		total_threads += threads;

		ns.tprint(`(${max_ram}GB => ${threads} threads): ${server}`);

		ns.exec("grow.js", server, threads, target, threads);
	}

	ns.tprint(``);
	ns.tprint(`Successfully spawned ${total_threads} grow threads across ${servers} servers.`);
	ns.tprint(`Script ETA ${Math.trunc(ns.getGrowTime(target) / 1000)}s this iteration.`);
}