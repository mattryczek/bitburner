/** @param {NS} ns */

import fmt from "./helpers/fmt.js";

export async function main(ns) {
	// We override built in logs
	ns.disableLog('ALL');
	ns.clearLog();

	let target = ns.args[0];
	
	// If we don't have root on the target just quit out right away.
	if (!ns.run('smart_root.js', 1, target.toString(), 0)) return;

	// If we can't hack the server then quick out too.
	if (ns.getServerRequiredHackingLevel(target) > ns.getHackingLevel()){
		ns.print(`Hack level too low to breach target. Exiting!`);
		return;
	}

	const sleep_str = '💤 Sleep';
	const grow_str = '📈 Grow';
	const weaken_str = '💣 Weaken';
	const hack_str = '🔑 Hack';
	const spacing = 11;

	const sleep_str_norm  = sleep_str  + ' '.repeat(spacing - sleep_str.length);
	const grow_str_norm   = grow_str   + ' '.repeat(spacing - grow_str.length);
	const weaken_str_norm = weaken_str + ' '.repeat(spacing - weaken_str.length);
	const hack_str_norm   = hack_str   + ' '.repeat(spacing - hack_str.length);

	const steal_percentage = 0.5;
	const sec_threshold = 0.5;
	const steal_threshold = 0.9;
	const hack_amount = ns.hackAnalyze(target);
	const hack_needed = Math.ceil(steal_percentage / hack_amount);
	const double_need = Math.ceil(ns.growthAnalyze(target, 2));

	const whoami = ns.getHostname();
	const available_ram = ns.getServerMaxRam(whoami) - ns.getServerUsedRam(whoami);

	const hack_cost   = ns.getScriptRam('/barebones/hack.js');
	const weaken_cost = ns.getScriptRam('/barebones/weaken.js');
	const grow_cost   = ns.getScriptRam('/barebones/grow.js');

	const hack_threads   = Math.floor(available_ram / hack_cost);
	const weaken_threads = Math.floor(available_ram / weaken_cost);
	const grow_threads   = Math.floor(available_ram / grow_cost);

	ns.print(`Available RAM: ${available_ram}GB / ${ns.getServerMaxRam(whoami)}GB`);
	ns.print(`Scriptlet RAM costs: Hack ${hack_cost}GB | Weaken ${weaken_cost}GB | Grow ${grow_cost}GB `);
	ns.print(`Max spawnable threads: Hack ${hack_threads} | Weaken ${weaken_threads} | Grow ${grow_threads}`);
	ns.print(``);
	ns.print(`Hack script targeting >>${target}<<`);

	let server_min_sec_lvl = ns.getServerMinSecurityLevel(target);
	let server_max_money = ns.getServerMaxMoney(target);

	ns.print('');
	ns.print(`Server Stats:`);
	ns.print(`Funds: $${fmt(Math.trunc(ns.getServerMoneyAvailable(target)))} / $${fmt(server_max_money)}`);
	ns.print(`Security: ${ns.getServerSecurityLevel(target)} / ${server_min_sec_lvl}`);
	ns.print(`Growth Rate: ${ns.getServerGrowth(target)}`);
	ns.print(`Growth Amount: Need ${double_need} threads to double money on server.`);
	ns.print(`Hack amount: ${(hack_amount * 100).toFixed(2)}%, need ${hack_needed} threads to steal ${steal_percentage * 100}% of total funds at a time.`)
	ns.print('');
	ns.print('');

	let delta_sec, weaken_needed = 0;

	async function _weaken() {
		delta_sec = ns.getServerSecurityLevel(target) - server_min_sec_lvl;
		weaken_needed = delta_sec / 0.05;

		Math.ceil(weaken_needed) === 0 ? weaken_needed = 1 : weaken_needed;

		if (delta_sec <= server_min_sec_lvl * sec_threshold) {
			ns.print(`${weaken_str_norm}Target security at ${ns.getServerSecurityLevel(target).toFixed(4)}`);
		} else {
			ns.print(`${weaken_str_norm}Spawning ${Math.ceil(weaken_needed)} threads to bring target to ${server_min_sec_lvl} security.`);
			ns.print(`${sleep_str_norm}${Math.trunc(ns.getWeakenTime(target) / 1000)} sec`);
			ns.run('/barebones/weaken.js', Math.ceil(weaken_needed), target);
			await ns.sleep(ns.getWeakenTime(target) + 1000);
		}
	}

	async function _grow() {
		if (ns.getServerMoneyAvailable(target) < (server_max_money * steal_threshold)){
			ns.print(`${grow_str_norm}Current server funds: $${fmt(Math.trunc(ns.getServerMoneyAvailable(target)))}`);

			ns.print(`${grow_str_norm}Growing server with ${grow_threads} threads.`)
			ns.run('/barebones/grow.js', grow_threads, target);
			ns.print(`${sleep_str_norm}${Math.trunc(ns.getGrowTime(target) / 1000)} sec`);
			await ns.sleep(ns.getGrowTime(target) + 1000);

			ns.print(`${grow_str_norm}Current server funds: $${fmt(Math.trunc(ns.getServerMoneyAvailable(target)))}`);
		}
	}

	async function _hack() {
		if (ns.getServerMoneyAvailable(target) >= (server_max_money * steal_threshold)) {
			ns.print(`${hack_str_norm}Hacking target with ${hack_needed} threads.`);
			ns.print(`${hack_str_norm}Current server funds: $${fmt(Math.trunc(ns.getServerMoneyAvailable(target)))}`);
			ns.run('/barebones/hack.js', hack_needed, target);
			ns.print(`${sleep_str_norm}${Math.trunc(ns.getHackTime(target) / 1000)} sec`);
			await ns.sleep(ns.getHackTime(target) + 1000);
			ns.print(`${hack_str_norm}Current server funds: $${fmt(Math.trunc(ns.getServerMoneyAvailable(target)))}`);
		}
	}
	
	while(!0){

		await _weaken();
		await _grow();
		// await _weaken();
		await _hack();
	}
}