/** @param {NS} ns **/

// import get_stats from "./helpers/get_stats.js";
// import hack_server from "./helpers/hack_server.js";
// import weaken_server from "./helpers/weaken_server.js";
// import propagate from "./helpers/propagate.js";
// import root_server from "./smart_root.js";

export async function main(ns) {
  switch (ns.args[0]) {
    case "recon":
      recon(ns);
      break;
    case "weaken":
      await weaken_server(ns, ns.args[1]);
      break;
    case "hack":
      await hack_server(ns, ns.args[1]);
      break;
    case "stats":
      get_stats(ns, ns.args[1]);
      break;
    case "money":
      get_money(ns);
      break;
    case "propagate":
      propagate(ns);
      break;
    case "nuke":
      root_server(ns, ns.args[1]);
      break;
    default:
      ns.tprint("I need to know what you want me to do...");
  }
}

function recon(ns) {
  for (let server of ns.scan()) {
    ns.run("helpers/get_stats.js", 1, server);
  }
}

function get_money(ns) {
  let server_funds = 0;

  for (let server of ns.scan()) {
    server_funds = ns.getServerMoneyAvailable(server);
    ns.tprint(
      `${server}: \$${
        Math.trunc(server_funds).toString().replace(
          /\B(?=(\d{3})+(?!\d))/g,
          ",",
        )
      }`,
    );
  }
}
