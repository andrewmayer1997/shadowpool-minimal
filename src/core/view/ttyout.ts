import "../server";
import { workers, activeWorkers, accepted } from "../stats";
import { whoMinedLastBlock, lastBlock, shares } from "../daemon";
import { calcPoolHashrate } from "../stats";
import { web3 } from "../daemon";
import "../utils/network";
import { getStat, netstat } from "../utils/network";
import remote from '../utils/remoteLogger'

const getBlocktime = async function (stat: netstat): Promise<number> {
  return Number(
    ((calcPoolHashrate() * stat.blocktime) / stat.hashrate).toPrecision(2)
  );
};

let lastBlockAt: undefined | Date;

export const updateLastBlockDate = function (date: string) {
  lastBlockAt = new Date(date);
};

const calcBlocksFromShares = function () {
  let total = 0;
  shares.forEach((s, key) => {
    if (s.isBlock) total++;
  });
  return total;
};

const prettyTime = function (sec: number): string {
  return sec > 60 * 60 * 24
    ? (sec / (60 * 60 * 24)).toPrecision(2) + "d"
    : sec > 60 * 60
    ? (sec / (60 * 60)).toPrecision(2) + "h"
    : sec > 60
    ? (sec / 60).toPrecision(2) + "m"
    : sec < 0
    ? "?"
    : sec.toPrecision(2) + "s";
};

const update = async function () {
  getStat(1000).then(async (stat) => {
    console.clear()
    const blocktime = await getBlocktime(stat);
    const passed =
      (Number(new Date()) -
        Number(lastBlockAt == undefined ? 100000000000000000 : lastBlockAt)) /
      1000;
    const progress = Math.floor(passed < 0 ? 0 : (passed / blocktime) * 100);
    const hashrate = Math.floor(calcPoolHashrate() / 10000) / 100; //MH

    remote.info("------------------------");
    remote.info(
      `Balance: ${web3.utils.fromWei(
        await web3.eth.getBalance(await web3.eth.getCoinbase()),
        "ether"
      )}`
    );
    remote.info(`Hashrate: ${hashrate < 0 ? "?" : hashrate.toString() + "MH"}`);
    //console.log(`Hashrate(2): ${(await web3.eth.getHashrate()) / 1000000} MH`);
    remote.info(`Workers: ${activeWorkers}/${workers.size}`);
    remote.info(`Last block: ${lastBlock}`);
    remote.info(`Mined by: ${whoMinedLastBlock}`);
    //1 == 1 ? 2 : 2 == 2 ? 3 : 0;
    remote.info(`Expected blocktime: ${prettyTime(blocktime)}`);
    remote.info(`Time passed: ${prettyTime(passed)}`);
    remote.info(`Progress: ${progress < 0 ? "?" : progress.toString() + "%"}`);
    remote.info(`Total shares: ${accepted}/${calcBlocksFromShares()}`);
    remote.info("------------------------");
  });
};

export const view = function () {
  setInterval(update, 1000);
};
