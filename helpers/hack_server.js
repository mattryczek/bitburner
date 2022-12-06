/** @param {NS} ns */

export default function hack_server(ns, target) {
	let threads, servers = 0;
	let total_threads = 1 - 1;
	let script_ram = ns.getScriptRam('hack.js');
	ns.tprint(`\n\nCurrent hack.js impl needs ${script_ram}GB per thread.\n\n`);

	for (let server of ns.scan("home")) {
		let max_ram = ns.getServerMaxRam(server);
		if (max_ram == 0) { continue };
		servers++;

		ns.scp('hack.js', server);
		ns.killall(server);

		threads = Math.floor(max_ram / script_ram);
		total_threads += threads;

		ns.tprint(`(${max_ram}GB => ${threads} threads): ${server}`);

		ns.exec("hack.js", server, threads, target, threads);
	}

	ns.tprint(``);
	ns.tprint(`Successfully spawned ${total_threads} hack threads across ${servers} servers.`);
	ns.tprint(`Script ETA ${Math.trunc(ns.getHackTime(target) / 1000)}s this iteration.`);
}