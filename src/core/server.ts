import net from "net";
import { msgHandler } from "./proxy/statum";
import { jsonrpc, serialize } from "./rpc/jsonrpc";
import { makeOffline } from "./stat/workers";
import log from "./utils/logger";

namespace stratum {
  export let clients = new Map<string, net.Socket>();

  export const sendNotify = async function (notify: jsonrpc.notification) {
    log.debug("Send notification for all client", notify);
    const raw = serialize(notify) + "\n";

    clients.forEach((client) => {
      client.write(raw);
    });
  };

  export const sendNotifyTo = async function (
    ip: string,
    notify: jsonrpc.notification
  ) {
    log.debug(`Send notification to ${ip}`, notify);
    const raw = serialize(notify) + "\n";
    try {
      clients.get(ip)!.write(raw);
    } catch (e) {
      log.error(e);
    }
  };

  export const create = function (
    port: number,
    host: string
  ): net.Server | undefined {
    log.info(`--------------- ${new Date()} ---------------`);
    log.info(`Starting stratum2 tcp server...`);
    log.info(`Listening on ${port}`);

    try {
      return net
        .createServer({ allowHalfOpen: false })
        .listen(port, host)
        .on("connection", (s) => {
          log.info(`Max listeners: 100`);
          s.setMaxListeners(100);

          s.setKeepAlive(true);
          s.setEncoding("ascii");

          const addr = s.remoteAddress;
          const port = s.remotePort;

          log.info(`New connection: ${addr}:${port}`);
          clients.set(addr!.toString(), s);

          // TODO: NEED CONNECTION HANDLER!!!
          // set pool diff for new client
          log.debug(`Set pool difficulty for new client...`);
          setTimeout(() => {
            s.write(
              serialize(<jsonrpc.notification>{
                method: "mining.set_difficulty",
                // ~10G
                params: [2.5],
              }) + "\n"
            );
          }, 1000);

          log.info("Active connections:");
          clients.forEach((c) => {
            log.info("<> " + c.remoteAddress);
          });

          s.on("data", async (data) => {
            // @ts-ignore
            msgHandler(data, s.remoteAddress).then((resp) => {
              log.debug(`Sent response.`, resp);
              s.write(serialize(resp) + "\n");
            });
          });

          s.on("error", (e) => {
            log.error(e);
          });

          s.on("close", () => {
            log.info(`Connection closed: ${addr}:${port}`);
            clients.delete(s.remoteAddress!.toString());
            makeOffline(s.remoteAddress!.toString());

            log.info("Active connections:");
            clients.forEach((c) => {
              log.info("<> " + c.remoteAddress);
            });
          });
        });
    } catch (e) {
      log.info(`Somethings went wrong\n`, e);
      // throw e;
    }
  };
}
export { stratum };
