import fs from "fs";
import path from "path";
import { EventEmitter } from "events";
import child_process from "child_process";

class WhatchLog extends EventEmitter {
  constructor() {
    super();
    console.log("Init observer...");
    setInterval(this.watch, 10000);
  }
  public lastSize = 0;
  public watch = () => {
    fs.stat(
      //@ts-ignore
      path.join(process.env.HOME, ".shadowlogs", "info.log"),
      (err, stat) => {
    //@ts-ignore
        console.log(`Check ${path.join(process.env.HOME, ".shadowlogs", "info.log")}`)
        if (stat.size == this.lastSize) {
          this.restart();
          this.emit("error");
          console.log("Pool was be restarted");
        } else {
          console.log("Pool still alive.");
          this.lastSize = stat.size;
        }
      }
    );
  };
  public restart = function () {
    console.log("restarting...");
    const stdout = child_process.execSync(
      `cd ${path.join(
        // @ts-ignore
        process.env.HOME,
        "NODE",
        "shadowpool-minimal"
      )}; yarn start;`
    );
  };
}
export const watch = new WhatchLog();
