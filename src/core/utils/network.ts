import { web3 } from "../daemon";
import log from "./logger";

export interface netstat {
  hashrate: number;
  blocktime: number;
  diff: number;
}

export const TH = 1000000000000;
export const GH = 1000000000;
export const MH = 1000000;

export const getStat = async function (
  sampleSize //!< [in] Larger n give more accurate numbers but with longer latency.
) {
  let blockNum = await (await web3.eth.getBlock("latest")).number; // Save this value to atomically get a block number.
  let blockTime =
    (Number(await (await web3.eth.getBlock(blockNum)).timestamp) -
      Number(
        await (await web3.eth.getBlock(blockNum - sampleSize)).timestamp
      )) /
    sampleSize;
  //TH
  let difficulty =
    (await web3.eth.getBlock(blockNum)).difficulty / 1000000000000; // You can sum up the last n-blocks and average; this is mathematically sound.

  log.debug(`Diff ${difficulty / 1000000000000} TH`);
  log.debug(`Blocktime ${blockTime} s`);
  log.debug(`Network hashrate: ${(difficulty * TH) / blockTime / GH} GH`);

  return <netstat>{
    hashrate: (difficulty / blockTime)/GH,
    blocktime: blockTime,
    diff: difficulty/TH,
  };
};
