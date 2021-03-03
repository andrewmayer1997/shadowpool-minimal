import "./core/server";
import { stratum } from "./core/server";
import "./core/daemon";
import { start } from "./core/daemon";
import { view } from "./core/view/ttyout";

stratum.create(8008, "0.0.0.0");
start();
view();
