import { activeWorkers, workers } from "./stats";
import { stratum } from "./server";
import { jsonrpc } from "./rpc/jsonrpc";
import log from "../core/utils/logger";

const Min = 0x000;
const Max = 0xfff;
let last = 0x0;

export const getExtranonceByName = function () {
  //..
};

export const calc = function () {
  const step = Math.floor(Max / activeWorkers);
  last -= step;

  workers.forEach((w, key) => {
    stratum.sendNotifyTo(w.ip, <jsonrpc.notification>{
      method: "mining.set_extranonce",
      params: ["0x" + (Math.floor(last + step)).toString(16).padStart(3, '0')]
    });
    w.extranonce = (last + step).toString(16).padStart(3, '0');
    last += step;
    log.debug(`Worker: ${w.name}, start at ${w.extranonce}, step ${step}`)
  });
};
