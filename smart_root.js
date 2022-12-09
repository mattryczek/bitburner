/** @param {NS} ns */

export function main(ns) {
  let target = ns.args[0];
  let verbosity = ns.args[1];

  let exploits = [
    "BruteSSH.exe",
    "FTPCrack.exe",
    "relaySMTP.exe",
    "HTTPWorm.exe",
    "SQLInject.exe",
  ];

  let available_exploits = [];
  let req_ports = ns.getServerNumPortsRequired(target);

  cprint(ns, `SmartROOT v2 ------------------------------`, verbosity);
  cprint(ns, "         __" + "_".repeat(target.toString().length) + "__", verbosity);
  cprint(ns, `         >>${target}<<`, verbosity);
  cprint(ns, "         ‾‾" + "‾".repeat(target.toString().length) + "‾‾", verbosity);

  // First check if we have root. If true then return.
  if (ns.hasRootAccess(target)) {
    cprint(ns, "Already have root!", verbosity);
    return true;
  }

  cprint(ns, `Number of ports required open to NUKE: ${req_ports}`, verbosity);

  // Next check if server cant be autonuked (no ports required open).
  if (req_ports === 0) {
    ns.nuke(target);
    cprint(ns, `NUKE successful, got root.`, verbosity);
    return true;
  }

  // If req_ports > 0, enumerate available exploits to see if avail >= req.
  for (let exploit of exploits) {
    if (ns.fileExists(exploit)) {
      available_exploits.push(exploit);
      cprint(ns, `Loaded exploit ${exploit}`, verbosity);
    }
  }

  // We can't nuke if we don't have enough exploits.
  if (ns.getServerNumPortsRequired(target) > available_exploits.length) {
    cprint(ns, `Not able to open enough ports on >>${target}<< to get root!`, verbosity);
    return false;
  }

  // Loop through available exploits until we have root. Using eval() breaks things so the
  // run_exploit() function was created as a workaround.
  for (let exploit of available_exploits) {
    run_exploit(ns, exploit, target);
  }

  cprint(ns, `${available_exploits.length} ports opened, tactical NUKE incoming.`, verbosity);
  ns.nuke(target);
  cprint(ns, `Root status: ${ns.hasRootAccess(target)}`, verbosity);
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
      cprint(ns, "You should not be executing...", verbosity);
  }
}

function cprint(ns, str, verbosity){
  verbosity === 0 ? ns.print(str) : ns.tprint(str);
}