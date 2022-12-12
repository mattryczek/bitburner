/** @param {NS} ns */

import fmt from "./helpers/fmt.js";

export async function main(ns) {
  let target = ns.args[0];
  let server_funds, max_funds = 0;

  for (let server of ns.scan(target)) {
    server_funds = ns.getServerMoneyAvailable(server);
    max_funds = ns.getServerMaxMoney(server);
    ns.tprint(
      `${server}: \$${fmt(Math.trunc(server_funds))} / \$${
        fmt(Math.trunc(max_funds))
      }`,
    );
  }
}
