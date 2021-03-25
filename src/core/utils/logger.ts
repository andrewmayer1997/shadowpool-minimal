import { ISettingsParam, Logger, ILogObject } from "tslog";
import fs from "fs";
import path from "path";

const stream = fs.createWriteStream(
  path.join(
    process.env.LOGDIR == undefined
      ? // @ts-ignore
        path.join(process.env.HOME, ".shadowlogs")
      : process.env.LOGDIR,
    "shadow-debug.log"
  ),
  { flags: "w", autoClose: true }
);

function logToTransport(logObject: ILogObject) {
  const log = logObject.toJSON();
  stream.write(
    log.date.toLocaleString() +
      " < " +
      log.logLevel +
      " > " +
      log.argumentsArray.toString() +
      "\n"
  );
}

const log: Logger = new Logger();

log.setSettings(<ISettingsParam>{
  displayFilePath: "hidden",
  displayLogLevel: true,
  displayFunctionName: false,
  displayInstanceName: false,
  displayRequestId: false,
  displayTypes: false,
  displayLoggerName: false,
  minLevel: "fatal",
});

log.attachTransport(
  {
    silly: logToTransport,
    debug: logToTransport,
    trace: logToTransport,
    info: logToTransport,
    warn: logToTransport,
    error: logToTransport,
    fatal: logToTransport,
  },
  "debug"
);

export default log;
