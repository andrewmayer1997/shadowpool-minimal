import "../rpc/jsonrpc";
import { jsonrpc, serialize } from "../rpc/jsonrpc";
import log from "../utils/logger";
import "websocket";
import WebSocket, * as ws from "ws";
import { view } from "./api";

export let poolStat: view.Stat;

namespace back {
  export let clients = new Map<string, WebSocket>();

  export const sendNotify = async function (notify: string) {
    log.debug("Send notification for all client");
    log.debug(notify);
    const raw = notify + "\n";

    clients.forEach((client) => {
      client.send(raw);
    });
  };

  export const createWebSocket = function (port) {
    log.info(`Create ws server.`);
    return new ws.Server(<ws.ServerOptions>{
      port: port,
    }).on("connection", (s) => {
      clients.set(clients.size.toString(), s);
      log.info(`New connection to ws`);
    });
  };
}
export { back };
