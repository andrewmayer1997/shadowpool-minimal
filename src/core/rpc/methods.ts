import { shares, submitWork } from "../daemon";
import { jsonrpc } from "./jsonrpc";
import log from "../utils/logger";
import "../stats";
import {
  addWorker,
  Worker,
  workers,
  UIDbyName,
  makeOnline,
  accepted,
  increeseAccepted,
  updateHashrate,
} from "../stats";

export const submit = async function (
  req: jsonrpc.request
): Promise<jsonrpc.response> {
  const isBlock = await submitWork(
    //@ts-ignore
    req.params[1],
    // @ts-ignore
    req.params[2],
    req.worker!.toString()
  );
  log.info(
    // @ts-ignore
    `Checked the share: -- ${isBlock}`
  );
  // @ts-ignore
  shares.get(req.params[1])!.isBlock = isBlock;
  increeseAccepted();
  //@ts-ignore
  makeOnline(req.worker);
  return <jsonrpc.response>{
    id: req.id,
    result: true,
  };
};

export const auth = async function (
  req: jsonrpc.request,
  ip: string
): Promise<jsonrpc.response> {
  // @ts-ignore
  // @ts-ignore
  addWorker(req.params[1], <Worker>{
    name: req.worker!.toString(),
    // @ts-ignore
    hashrate: "-1",
    ip: ip,
  });
  return <jsonrpc.response>{
    id: req.id,
    result: true,
  };
};
export const extranonce = async function (
  req: jsonrpc.request
): Promise<jsonrpc.response> {
  return <jsonrpc.response>{
    id: req.id,
    result: true,
  };
};

export const submitHashrate = async function (
  req: jsonrpc.request,
  ip: string
): Promise<jsonrpc.response> {
  makeOnline(req.worker!.toString());
  // @ts-ignore
  updateHashrate(req.worker!.toString(), req.params[0]);
  return <jsonrpc.response>{
    id: req.id,
    result: true,
  };
};
export const subscribe = async function (
  req: jsonrpc.request
): Promise<jsonrpc.response> {
  return <jsonrpc.response>{
    id: req.id,
    result: true,
  };
};
