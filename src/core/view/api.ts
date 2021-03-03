import { lastBlock, shares, web3, whoMinedLastBlock } from "../daemon";
import { activeWorkers, calcPoolHashrate, workers } from "../stats";
import { getStat } from "../utils/network";
import { calcBlocksFromShares, getBlocktime, lastBlockAt } from "./ttyout";

export namespace view {
  export type Stat = {
    hashrate: number;
    balance: string;
    activeWorkers: number;
    allWorkers: number;
    allShares: number;
    blockInShares: number;
    lastBlock: string;
    minedBy: string;
    expectedTime: string;
    lastBlockTime: Date | undefined;
    blockTime: number;
  };

  export let poolStat: Stat;

  export const getHashrate = function (): number {
    poolStat.hashrate = Math.floor(calcPoolHashrate() / 10000) / 100;
    return poolStat.hashrate;
  };
  export const getBalance = async function (): Promise<string> {
    poolStat.balance = web3.utils.fromWei(
      await web3.eth.getBalance(await web3.eth.getCoinbase()),
      "ether"
    );
    return poolStat.balance;
  };
  export const getActiveWorkers = function (): number {
    poolStat.activeWorkers = activeWorkers;
    return poolStat.activeWorkers;
  };
  export const getAllWorkers = function (): number {
    poolStat.allWorkers = workers.size;
    return poolStat.allWorkers;
  };
  export const getAllShares = function (): number {
    poolStat.allShares = shares.size;
    return poolStat.allShares;
  };
  export const getBlockInShares = function (): number {
    poolStat.blockInShares = calcBlocksFromShares();
    return poolStat.blockInShares;
  };
  export const getLastBlock = function (): string {
    poolStat.lastBlock = lastBlock;
    return poolStat.lastBlock;
  };
  export const lastBlockMinedBy = function (): string {
    poolStat.minedBy = whoMinedLastBlock;
    return poolStat.minedBy;
  };
  export const getExpectedTime = async function (): Promise<string> {
    poolStat.blockTime = await getBlocktime(await getStat(1000));
    return poolStat.expectedTime;
  };
  export const getLastBlockTime = function (): Date | undefined {
    poolStat.lastBlockTime = lastBlockAt;
    return poolStat.lastBlockTime;
  };
}
