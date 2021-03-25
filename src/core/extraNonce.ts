import { getActiveWorkers, workers } from "./stats";
import { stratum } from "./server";
import { jsonrpc } from "./rpc/jsonrpc";
import log from "../core/utils/logger";

const Min = 0x00;
const Max = 0xff;

export const calc = function () {
  try {
    log.debug("Try to calc extraNonce");
    const step = 1;
    let last = 0;

    workers.forEach((w, key) => {
      if (w.online) {
        const extraNonce = (last + step).toString(16).padStart(2, "0");

        stratum.sendNotifyTo(w.ip, <jsonrpc.notification>{
          method: "mining.set_extranonce",
          params: [extraNonce],
        });

        w.extranonce = extraNonce;
        last += step;

        log.debug(`Worker: ${w.name}, start at ${w.extranonce}, step ${step}`);
      } else {
        log.debug(`Worker with ${key} UID is offline!`);
      }
    });
  } catch (e) {
    log.error(JSON.stringify(e));
  }
};
