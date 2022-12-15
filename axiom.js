/** @param {NS} ns */

import fmt from "./lib/fmt.js";

export async function main(ns) {
	// We override built in logs
	ns.disableLog('ALL');
	ns.clearLog();

	let target = ns.args[0];
	
	// If we don't have root on the target just quit out right away.
	if (!ns.run('smart_root.js', 1, target.toString(), 0)) return;

	// If we can't hack the server then quit out too.
	if (ns.getServerRequiredHackingLevel(target) > ns.getHackingLevel()){
		ns.print(`Hack level too low for ${target}. Exiting!`);
		return;
	}

	const sleep_str = '💤 Sleep';
	const grow_str = '📈 Grow';
	const weaken_str = '💣 Weaken';
	const hack_str = '🔑 Hack';
	const profit_str = '💎 Profit';
	const spacing = 12;

	const sleep_str_norm    = sleep_str    + ' '.repeat(spacing - sleep_str.length);
	const grow_str_norm     = grow_str     + ' '.repeat(spacing - grow_str.length);
	const weaken_str_norm   = weaken_str   + ' '.repeat(spacing - weaken_str.length);
	const hack_str_norm     = hack_str     + ' '.repeat(spacing - hack_str.length);
	const profit_str_norm   = profit_str   + ' '.repeat(spacing - profit_str.length);

	const steal_percentage = 0.5;
	const sec_threshold = 0.5;
	const steal_threshold = 0.9;
	let   hack_amount = ns.hackAnalyze(target);
	let   hack_needed = Math.ceil(steal_percentage / hack_amount);
	let   double_need = Math.ceil(ns.growthAnalyze(target, 2));

	const whoami = ns.getHostname();
	const available_ram = ns.getServerMaxRam(whoami) - ns.getServerUsedRam(whoami);

	const hack_cost   = ns.getScriptRam('/barebones/hack.js');
	const weaken_cost = ns.getScriptRam('/barebones/weaken.js');
	const grow_cost   = ns.getScriptRam('/barebones/grow.js');

	const hack_threads   = Math.floor(available_ram / hack_cost);
	const weaken_threads = Math.floor(available_ram / weaken_cost);
	const grow_threads   = Math.floor(available_ram / grow_cost);
	
	let delta_sec, weaken_needed = 0;

	let server_min_sec_lvl = ns.getServerMinSecurityLevel(target);
	let server_max_money = ns.getServerMaxMoney(target);

	ns.tail('axiom.js', whoami, target);

	ns.print(`Available RAM: ${available_ram}GB / ${ns.getServerMaxRam(whoami)}GB`);
	ns.print(`Scriptlet RAM: H ${hack_cost}GB/T  W ${weaken_cost}GB/T  G ${grow_cost}GB/T`);
	ns.print(`Max Threads: H ${hack_threads} W ${weaken_threads} G ${grow_threads}`);
	ns.print(' ');
	ns.print(`Hack script targeting >>${target}<<`);

	delta_sec = ns.getServerSecurityLevel(target) - server_min_sec_lvl;
	weaken_needed = delta_sec / 0.05;

	ns.print(' ');
	ns.print(`<==> Server Stats <==>`);
	ns.print(`Funds: $${fmt(Math.trunc(ns.getServerMoneyAvailable(target)))} / $${fmt(server_max_money)}`);
	ns.print(`Growth Rate: ${ns.getServerGrowth(target)}`);
	ns.print(`Need ${double_need}T to double $$$.`);
	ns.print(`Need ${hack_needed}T to abscond ${steal_percentage * 100}% of total $$$.`)
	ns.print(' ');

	if (weaken_needed) {		
		ns.print(`Initial weaken ${Math.ceil(weaken_needed)}T ETA ${Math.trunc(ns.getWeakenTime(target) / 1000)} sec`);
		ns.run('/barebones/weaken.js', Math.ceil(weaken_needed), target);
		await ns.sleep(ns.getWeakenTime(target) + 3000);
	}

	async function _weaken() {
		delta_sec = ns.getServerSecurityLevel(target) - server_min_sec_lvl;
		weaken_needed = delta_sec / 0.05;

		Math.ceil(weaken_needed) === 0 ? weaken_needed = 1 : weaken_needed;

		// if (delta_sec <= server_min_sec_lvl * sec_threshold) {
		if (delta_sec <= 0) {
			ns.print(`${weaken_str_norm}Target security at minimum.`);
		} else {
			ns.print(`${weaken_str_norm}Using ${Math.ceil(weaken_needed)}T`);
			ns.print(`${sleep_str_norm}${Math.trunc(ns.getWeakenTime(target) / 1000)} sec`);
			ns.run('/barebones/weaken.js', Math.ceil(weaken_needed), target);
			await ns.sleep(ns.getWeakenTime(target) + 1000);
		}
	}

	async function _grow() {
		double_need = Math.ceil(ns.growthAnalyze(target, 2));
		
		if (ns.getServerMoneyAvailable(target) < server_max_money){
			ns.print(`${grow_str_norm}Current balance $${fmt(Math.trunc(ns.getServerMoneyAvailable(target)))}`);

			ns.print(`${grow_str_norm}Using ${double_need}T`);
			ns.run('/barebones/grow.js', double_need, target);
			ns.print(`${sleep_str_norm}${Math.trunc(ns.getGrowTime(target) / 1000)} sec`);
			await ns.sleep(ns.getGrowTime(target) + 1000);

			ns.print(`${grow_str_norm}New balance $${fmt(Math.trunc(ns.getServerMoneyAvailable(target)))}`);
		}
	}

	async function _hack() {
		hack_amount = ns.hackAnalyze(target);
	    hack_needed = Math.ceil(steal_percentage / hack_amount);

		if (ns.getServerMoneyAvailable(target) === server_max_money) {
			ns.print(`${hack_str_norm}Using ${hack_needed}T`);
			ns.run('/barebones/hack.js', hack_needed, target);
			ns.print(`${sleep_str_norm}${Math.trunc(ns.getHackTime(target) / 1000)} sec`);
			await ns.sleep(ns.getHackTime(target) + 1000);
			ns.print(`${profit_str_norm}Stole $${fmt(Math.trunc(server_max_money - ns.getServerMoneyAvailable(target)))}`);
		}
	}

	while(!0){
		await _grow();
		await _weaken();
		await _hack();
		await _weaken();
	}
}