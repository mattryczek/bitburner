/** @param {NS} ns **/

export async function main(ns) {
	const port_force = 1;

	switch (ns.args[0]) {
		case 'recon':
			recon(ns);
			break;
		case 'weaken':
			weaken_server(ns, ns.args[1]);
			break;
		case 'hack':
			hack_server(ns, ns.args[1]);
			break;
		case 'stats':
			get_stats(ns, ns.args[1]);
			break;
		case 'get-money':
			get_money(ns);
			break;
		default:
			ns.tprint('I need to know what you want me to do...');
	}
}

function hack_server(ns, target) {
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

async function weaken_server(ns, target) {
	let threads, servers = 0;
	let total_threads = 1 - 1;
	let script_ram = ns.getScriptRam('weaken.js');
	ns.tprint(`\n\nCurrent weaken.js impl needs ${script_ram}GB per thread.\n\n`);

	for (let server of ns.scan("home")) {
		let max_ram = ns.getServerMaxRam(server);
		if (max_ram == 0) { continue };
		servers++;

		await ns.scp('weaken.js', server);
		ns.killall(server);

		threads = Math.floor(max_ram / script_ram);
		total_threads += threads;

		ns.tprint(`(${max_ram}GB => ${threads} threads): ${server}`);

		ns.exec("weaken.js", server, threads, target, threads);
	}

	ns.tprint(``);
	ns.tprint(`Successfully spawned ${total_threads} weaken threads across ${servers} servers.`);
	ns.tprint(`This will weaken >>${target}<< by ${(0.05 * total_threads).toFixed(4)} per iteration.`);
	ns.tprint(`Script ETA ${Math.trunc(ns.getWeakenTime(target) / 1000)}s this iteration.`);
}

function recon(ns) {
	for (let server of ns.scan("home")) {
		get_stats(ns, server);
	}
}

function get_stats(ns, server) {
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

function get_money(ns) {
	let server_funds = 0;

	for (let server of ns.scan("home")) {
		server_funds = ns.getServerMoneyAvailable(server);
		ns.tprint(`${server}: \$${Math.trunc(server_funds).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);
	}
}


function print_servers(ns) {
	let my_level = ns.getHackingLevel();
	ns.tprint(`Current hacking level: ${my_level}`);
	ns.tprint(`Number of port opening programs: ${port_force}`);

	let servers = ns.scan("home");
	ns.tprint(`Servers: ${servers}`)

	for (let server of servers) {
		let server_level = ns.getServerRequiredHackingLevel(server);
		if (my_level >= server_level) {
			ns.tprint(`Found NUKEable server: ${server}: ${server_level}`);
		}
	}
}