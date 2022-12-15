/** @param {NS} ns **/

import fmt from "./lib/fmt.js"

const whitelist = ['darkweb'];

export async function main(ns) {
  switch (ns.args[0]) {
    case "recon":
      recon(ns);
      break;
    case "stats":
      ns.run('getters/get_stats.js', 1, ns.args[1]);
      break;
    case "money":
      ns.run('getters/get_money.js', 1, ns.args[1]);
      break;
    case "nuke":
      ns.run('smart_root.js', 1, ns.args[1], 1);
      break;
    case "autonuke":
      auto_root(ns);
      break;
    default:
      ns.tprint("I need to know what you want me to do...");
  }
}

function auto_root(ns){
  for (let server of ns.scan()){
    ns.run('smart_root.js', 1, server, 1);
  }
}

function recon(ns) {
  for (let server of ns.scan()) {
    if (whitelist.indexOf(server.toString()) !== -1) continue;
    ns.run("getters/get_stats.js", 1, server);
  }
}
