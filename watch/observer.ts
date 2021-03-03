import fs from "fs";
import path from "path";
import { EventEmitter } from "events";
import child_process from "child_process";

class WhatchLog extends EventEmitter {}

export const restart = function () {
  const stdout = child_process.execSync(
    `killall node; cd ${path.join(
      process.env.HOME as string,
      "NODE",
      "shadowpool-minimal"
    )}; yarn start;`
  );
};

export const watch = new WhatchLog();

export const init = function () {
  fs.watchFile(
    path.join(process.env.HOME as string, ".shadowlogs", "shadow-debug.log"),
    { interval: 10000 },
    (curr, prev) => {
      if (curr.size == prev.size) {
        restart();
        watch.emit("error");
      }
    }
  );
};
