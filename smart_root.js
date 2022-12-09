/** @param {NS} ns */

export async function main(ns) {
  let target = ns.args[0];

  let exploits = [
    "BruteSSH.exe",
    "FTPCrack.exe",
    "relaySMTP.exe",
    "HTTPWorm.exe",
    "SQLInject.exe",
  ];

  let available_exploits = [];
  let req_ports = ns.getServerNumPortsRequired(target);

  ns.tprint(`AutoROOT v0 ------------------------------`);
  ns.tprint("         __" + "_".repeat(target.toString().length) + "__");
  ns.tprint(`         >>${target}<<`);
  ns.tprint("         ‾‾" + "‾".repeat(target.toString().length) + "‾‾");

  // First check if we have root. If true then return.
  if (ns.hasRootAccess(target)) {
    ns.tprint("Already have root!");
    return true;
  }

  ns.tprint(`Number of ports required open to NUKE: ${req_ports}`);

  // Next check if server cant be autonuked (no ports required open).
  if (req_ports === 0) {
    ns.nuke(target);
    ns.tprint(`NUKE successful, got root.`);
    return true;
  }

  // If req_ports > 0, enumerate available exploits to see if avail >= req.
  for (let exploit of exploits) {
    if (ns.fileExists(exploit)) {
      available_exploits.push(exploit);
      ns.tprint(`Loaded exploit ${exploit}`);
    }
  }

  // We can't nuke if we don't have enough exploits.
  if (ns.getServerNumPortsRequired(target) > available_exploits.length) {
    ns.tprint(`Not able to open enough ports on >>${target}<< to get root!`);
    return false;
  }

  // Loop through available exploits until we have root. Using eval() breaks things so the
  // run_exploit() function was created as a workaround.
  for (let exploit of available_exploits) {
    run_exploit(ns, exploit, target);
  }

  ns.tprint(`${available_exploits.length} ports opened, tactical NUKE incoming.`);
  ns.nuke(target);
  ns.tprint(`Root status: ${ns.hasRootAccess(target)}`);
  return true;
}

function run_exploit(ns, exploit, target) {
  switch (exploit) {
    case "BruteSSH.exe":
      ns.brutessh(target);
      break;
    case "FTPCrack.exe":
      ns.ftpcrack(target);
      break;
    case "relaySMTP.exe":
      ns.relaysmtp(target);
      break;
    case "HTTPWorm.exe":
      ns.httpworm(target);
      break;
    case "SQLInject.exe":
      ns.sqlinject(target);
      break;
    default:
      ns.tprint("You should not be executing...");
  }
}
