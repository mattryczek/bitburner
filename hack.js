/** @param {NS} ns */

export async function main(ns) {
  ns.disableLog("ALL");
  let server = ns.args[0];
  ns.print(`Hack script targeting ${server} with ${ns.args[1]} threads.`);
  ns.print(`Script ETA ${Math.trunc(ns.getHackTime(server))}ms.`);

  let stolen = 0;

  while (
    ns.getServerMoneyAvailable(server) >
      ns.getServerMoneyAvailable(server) * 0.3
  ) {
    stolen += await ns.hack(server, { threads: ns.args[1] });
    ns.print(`Script ETA ${Math.trunc(ns.getWeakenTime(server)) / 1000}s.`);
    ns.print(
      `Iteration complete, server security at ${
        ns.getServerSecurityLevel(server).toFixed(4)
      }`,
    );
  }

  ns.tprint(`Stole ${stolen} from ${server}. Exiting.`);
}
