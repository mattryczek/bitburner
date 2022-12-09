/** @param {NS} ns **/

import fmt from "./helpers/fmt.js"

const whitelist = ['darkweb'];

export async function main(ns) {
  switch (ns.args[0]) {
    case "recon":
      recon(ns);
      break;
    case "weaken":
      ns.run('helpers/weaken_server.js', 1, ns.args[1]);
      break;
    case "hack":
      ns.run('helpers/hack_server.js', 1, ns.args[1]);
      break;
    case "stats":
      ns.run('helpers/get_stats.js', 1, ns.args[1]);
      break;
    case "money":
      get_money(ns);
      break;
    case "nuke":
      ns.run('smart_root.js', 1, ns.args[1]);
      break;
    default:
      ns.tprint("I need to know what you want me to do...");
  }
}

function recon(ns) {
  for (let server of ns.scan()) {
    if (whitelist.indexOf(server.toString()) !== -1) continue;
    ns.run("helpers/get_stats.js", 1, server);
  }
}

function get_money(ns) {
  let server_funds = 0;

  for (let server of ns.scan()) {
    server_funds = ns.getServerMoneyAvailable(server);
    ns.tprint(`${server}: \$${fmt(Math.trunc(server_funds))}`);
  }
}
