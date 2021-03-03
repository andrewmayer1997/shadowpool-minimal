import "../server";
import { workers, activeWorkers, accepted } from "../stats";
import { whoMinedLastBlock, lastBlock, shares } from "../daemon";
import { calcPoolHashrate } from "../stats";
import { web3 } from "../daemon";
import "../utils/network";
import { getStat, netstat } from "../utils/network";

const getBlocktime = async function (stat: netstat): Promise<number> {
  return Math.floor((calcPoolHashrate() * stat.blocktime) / stat.hashrate);
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

const update = async function () {
  getStat(100).then(async (stat) => {
    console.clear();
    const blocktime = await getBlocktime(stat);
    const passed =
      (Number(new Date()) -
        Number(lastBlockAt == undefined ? 100000000000000000 : lastBlockAt)) /
      1000;
    const progress = Math.floor(passed < 0 ? 0 : (passed / blocktime) * 100);
    const hashrate = Math.floor(calcPoolHashrate() / 10000)/100; //MH

    console.log("------------------------");
    console.info(
      `Balance: ${web3.utils.fromWei(
        await web3.eth.getBalance(await web3.eth.getCoinbase()),
        "ether"
      )}`
    );
    console.log(`Hashrate: ${hashrate < 0 ? "?" : hashrate}MH`);
    //console.log(`Hashrate(2): ${(await web3.eth.getHashrate()) / 1000000} MH`);
    console.log(`Workers: ${activeWorkers}/${workers.size}`);
    console.log(`Last block: ${lastBlock}`);
    console.log(`Mined by: ${whoMinedLastBlock}`);
    console.log(`Expected blocktime: ${blocktime < 0 ? "?" : blocktime}s`);
    console.log(`Time passed: ${passed < 0 ? "?" : passed}s`);
    console.log(`Progress: ${progress < 0 ? "?" : progress}%`);
    console.log(`Total shares: ${accepted}/${calcBlocksFromShares()}`);
    console.log("------------------------");
  });
};

export const view = function () {
  setInterval(update, 1000);
};
