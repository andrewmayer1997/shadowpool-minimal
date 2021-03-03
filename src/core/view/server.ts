import net from "net";
import "../rpc/jsonrpc";
import { jsonrpc, serialize } from "../rpc/jsonrpc";
import log from "../utils/logger";
import "websocket";
import WebSocket, * as ws from "ws";

namespace back {
  export let clients = new Map<string, WebSocket>();

  export const sendNotify = async function (notify: jsonrpc.notification) {
    log.debug("Send notification for all client");
    log.debug(notify);
    const raw = serialize(notify) + "\n";

    clients.forEach((client) => {
      client.send(raw);
    });
  };

  export const createWebSocket = function (port) {
    log.info(`Create ws server.`)
    return new ws.Server(<ws.ServerOptions>{
      port: port,
    }).on("connection", (s) => {
      clients.set(clients.size.toString(), s);
      log.info(`New connection.`)
    });
  };
  
  /*
  export const create = function (
    port: number,
    host: string
  ): net.Server | undefined {
    log.info(`--------------- ${new Date()} ---------------`);
    log.info(`Starting tcp server...`);
    log.info(`Listening on ${port}`);

    try {
      return net
        .createServer({ allowHalfOpen: false })
        .listen(port, host)
        .on("connection", (s) => {
          log.info(`Max listeners: 5`);
          s.setMaxListeners(5);

          s.setKeepAlive(true);
          s.setEncoding("ascii");

          s.on("error", (e) => {
            log.error(e);
          });
        });
    } catch (e) {
      log.info(`Somethings went wrong\n ${e}`);
      // throw e;
    }
  }; */
}
export { back };
