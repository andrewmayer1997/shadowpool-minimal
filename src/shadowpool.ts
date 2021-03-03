import "./core/server";
import { stratum } from "./core/server";
import "./core/daemon";
import { start } from "./core/daemon";
import { view } from "./core/view/ttyout";
//import { back } from "./core/view/server";

try {
  stratum.create(8008, "0.0.0.0");
  //back.createWebSocket(2002)
  start();
  view();
} catch (e) {
  console.log(`<----------------- ERROR! ----------------->`);
  console.error(e);
}
