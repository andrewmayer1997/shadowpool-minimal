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
    fs.stat(path.join(".", "kek.txt"), (err, stat) => {
      if (stat.size == this.lastSize) {
        this.restart();
        this.emit("error");
        console.log("Pool was be restarted");
      } else {
        console.log("Pool still alive.");
        this.lastSize = stat.size;
      }
    });
  };
  public restart = function () {
    console.log("restarting...");
    const stdout = child_process.execSync(
      `pkill -f "node-shadowpool"; cd ${path.join(
        // @ts-ignore
        process.env.HOME,
        "NODE",
        "shadowpool-minimal"
      )}; yarn start;`
    );
  };
}
export const watch = new WhatchLog();

/*
require('log-timestamp');

const buttonPressesLogFile = './kek.txt';

console.log(`Watching for file changes on ${buttonPressesLogFile}`);

fs.watchFile(buttonPressesLogFile, (curr, prev) => {
  console.log(`${buttonPressesLogFile} file Changed`);
});*/
