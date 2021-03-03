import { web3 } from "../daemon";
import log from "./logger";

export interface netstat {
  hashrate: number;
  blocktime: number;
  diff: number;
}

export const getStat = async function (
  sampleSize //!< [in] Larger n give more accurate numbers but with longer latency.
) {
  let blockNum = await (await web3.eth.getBlock('latest')).number; // Save this value to atomically get a block number.
  let blockTime =
    (Number(await (await web3.eth.getBlock(blockNum)).timestamp) -
      Number(
        await (await web3.eth.getBlock(blockNum - sampleSize)).timestamp
      )) /
    sampleSize;
  let difficulty = (await web3.eth.getBlock(blockNum)).difficulty; // You can sum up the last n-blocks and average; this is mathematically sound.

  log.debug(`Diff ${difficulty/1000000000000} TH`);
  log.debug(`Blocktime ${blockTime} s`);
  log.debug(`Network hashrate: ${difficulty / blockTime / 1000000000} G`);

  return <netstat>{
    hashrate: difficulty / blockTime,
    blocktime: blockTime,
    diff: difficulty,
  };
};
