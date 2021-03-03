(()=>{"use strict";var e={467:function(e,t,r){var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.submitWork=t.shares=t.start=t.newHeaderSub=t.lastBlock=t.whoMinedLastBlock=t.web3=void 0;const n=o(r(409)),a=o(r(605)),s=r(887),i=r(622),c=o(r(495)),u=r(925),l=r(907);t.web3=new n.default(new n.default.providers.WebsocketProvider("ws://localhost:8546")),t.whoMinedLastBlock="",t.lastBlock="",t.newHeaderSub=async function(){t.web3.eth.subscribe("newBlockHeaders",(async(e,r)=>{r.miner.toLowerCase()==(await t.web3.eth.getCoinbase()).toLowerCase()?(l.updateLastBlockDate((new Date).toLocaleString()),c.default.info(`Found new block ${r.hash}`),c.default.info(`Balance: ${t.web3.utils.fromWei(await t.web3.eth.getBalance(await t.web3.eth.getCoinbase()),"ether")}`),t.whoMinedLastBlock="<shadowpool>"):(c.default.info(`New block: ${r.number}`),c.default.info(`Mined by ${r.miner}`),t.whoMinedLastBlock=r.miner),t.lastBlock=r.number.toString(10)}))},t.start=function(){(async function(){t.web3.eth.getCoinbase().then((async e=>{c.default.info(`Wallet: ${e}`),c.default.info(`Balance: ${t.web3.utils.fromWei(await t.web3.eth.getBalance(e),"ether")}`)})).catch((e=>{c.default.error("Unable connect to geth. Exit."),process.exit(1)}))})().then((()=>{setTimeout((()=>{t.web3.eth.getWork().then((e=>{s.stratum.sendNotify({method:"mining.notify",params:[(t.shares.size+1).toString(),e[1],e[0],!0]}),t.shares.set((t.shares.size+1).toString(),{powhash:e[0],seedhash:e[1]})}))}),15e3),t.newHeaderSub(),a.default.createServer(((e,t)=>{e.on("data",(e=>{d(e)}))})).listen(4444,"localhost")}))},t.shares=new Map;const d=function(e){const r=JSON.parse(e.toString());s.stratum.sendNotify({method:"mining.notify",params:[(t.shares.size+1).toString(),r[1],r[0],!0]}),t.shares.set((t.shares.size+1).toString(),{powhash:r[0]})};t.submitWork=async function(e,r,o){var n,a;let s,l;try{if(!u.UIDbyName.get(o))throw new Error("CANNOT FIND EXTRANONCE FOR THE WORKER!");if(l=null===(n=u.UIDbyName.get(o))||void 0===n?void 0:n.toString(),!u.workers.get(l))throw new Error("CANNOT FIND EXTRANONCE FOR THE WORKER!");return s=null===(a=u.workers.get(l))||void 0===a?void 0:a.extranonce,c.default.debug("Full nonce: 0x00"+s+r),c.default.debug(`Length: ${("0x"+s+r).length}`),t.web3.eth.submitWork("0x00"+s+r,t.shares.get(e).powhash,"0x85f60765a212abec9239c327fcc38a5ece20b491e4f41073568d5c2668ccdffd")}catch(e){throw c.default.error(e),new i.RpcError({code:400,message:"Cannot process the share!",data:e})}}},950:function(e,t,r){var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.calc=t.getExtranonceByName=void 0;const n=r(925),a=r(887),s=o(r(495));let i=0;t.getExtranonceByName=function(){},t.calc=function(){const e=Math.floor(4095/n.activeWorkers);i-=e,n.workers.forEach(((t,r)=>{a.stratum.sendNotifyTo(t.ip,{method:"mining.set_extranonce",params:["0x"+Math.floor(i+e).toString(16).padStart(3,"0")]}),t.extranonce=(i+e).toString(16).padStart(3,"0"),i+=e,s.default.debug(`Worker: ${t.name}, start at ${t.extranonce}, step ${e}`)}))}},724:function(e,t,r){var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.msgHandler=void 0;const n=r(8),a=r(622),s=o(r(495));t.msgHandler=async function(e,t){let r;try{r=a.deserialize(e.toString("ascii")),s.default.debug("Got request:"),s.default.debug(r)}catch(e){return s.default.debug("Invalid request"),{id:0,error:{code:400,message:"Unable to parse json",data:e}}}try{switch(r.method){case"mining.subscribe":return n.subscribe(r);case"mining.submit":return n.submit(r);case"mining.authorize":return n.auth(r,t);case"eth_submitHashrate":return n.submitHashrate(r,t);case"eth_submitLogin":return n.auth(r,t);case"mining.extranonce.subscribe":return n.extranonce(r);default:throw new a.RpcError({code:400,message:"Unsupport method",data:r.method})}}catch(e){if(e instanceof a.RpcError)return{id:r.id,error:e.rpcmsg};throw s.default.warn("Something went wrong"),e}}},622:function(e,t,r){var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.isResponse=t.isRequest=t.isNotification=t.isRpcMessage=t.deserialize=t.serialize=t.RpcError=void 0;const n=o(r(495));class a extends Error{constructor(e){super(e.message),this.name="RpcError",this.rpcmsg=e}}t.RpcError=a,t.serialize=function(e){try{return JSON.stringify(e)}catch(e){throw n.default.debug("Cannot parse json"),e}},t.deserialize=function(e){try{let r=JSON.parse(e);if(t.isRpcMessage(r))return r;throw new Error("This is not jsonrpc msg")}catch(e){throw n.default.debug("Cannot parse json"),e}},t.isRpcMessage=function(e){return!!(t.isNotification(e)||t.isRequest(e)||t.isResponse(e))},t.isNotification=function(e){const t=Object.keys(e);return!!(t.includes("params")&&t.includes("method")||t.includes("error"))},t.isRequest=function(e){const t=Object.keys(e);return!!(t.includes("id")&&t.includes("method")&&t.includes("params"))},t.isResponse=function(e){const t=Object.keys(e);return!(!t.includes("id")||!t.includes("result")&&!t.includes("error"))}},8:function(e,t,r){var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.subscribe=t.submitHashrate=t.extranonce=t.auth=t.submit=void 0;const n=r(467),a=o(r(495));r(925);const s=r(925);t.submit=async function(e){const t=await n.submitWork(e.params[1],e.params[2],e.worker.toString());return a.default.info(`Checked the share: -- ${t}`),n.shares.get(e.params[1]).isBlock=t,s.increaseAccepted(),s.makeOnline(e.worker),{id:e.id,result:!0}},t.auth=async function(e,t){return s.addWorker(e.params[1],{name:e.worker.toString(),hashrate:"-1",ip:t}),{id:e.id,result:!0}},t.extranonce=async function(e){return{id:e.id,result:!0}},t.submitHashrate=async function(e,t){return s.makeOnline(e.worker.toString()),s.updateHashrate(e.worker.toString(),e.params[0]),{id:e.id,result:!0}},t.subscribe=async function(e){return{id:e.id,result:!0}}},887:function(e,t,r){var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.stratum=void 0;const n=o(r(631)),a=r(724),s=r(622),i=r(925),c=o(r(495));var u;!function(e){e.clients=new Map,e.sendNotify=async function(t){c.default.debug("Send notification for all client"),c.default.debug(t);const r=s.serialize(t)+"\n";e.clients.forEach((e=>{e.write(r)}))},e.sendNotifyTo=async function(t,r){c.default.debug(`Send notification for ${t}`),c.default.debug(r);const o=s.serialize(r)+"\n";e.clients.get(t).write(o)},e.create=function(t,r){c.default.info(`--------------- ${new Date} ---------------`),c.default.info("Starting stratum2 tcp server..."),c.default.info(`Listening on ${t}`);try{return n.default.createServer({allowHalfOpen:!1}).listen(t,r).on("connection",(t=>{c.default.info("Max listeners: 5"),t.setMaxListeners(5),t.setKeepAlive(!0),t.setEncoding("ascii");const r=t.remoteAddress,o=t.remotePort;c.default.info(`New connection: ${r}:${o}`),e.clients.set(r.toString(),t),c.default.debug("Set pool difficulty for new client..."),setTimeout((()=>{t.write(s.serialize({method:"mining.set_difficulty",params:[.1]})+"\n")}),1e3),c.default.info("Active connections:"),e.clients.forEach((e=>{c.default.info("<> "+e.remoteAddress)})),t.on("data",(async e=>{a.msgHandler(e,t.remoteAddress).then((e=>{c.default.debug("Sent response."),c.default.debug(e),t.write(s.serialize(e)+"\n")}))})),t.on("error",(e=>{c.default.error(e)})),t.on("close",(()=>{c.default.info(`Connection closed: ${r}:${o}`),e.clients.delete(t.remoteAddress.toString()),i.removeWorker(t.remoteAddress.toString()),c.default.info("Active connections:"),e.clients.forEach((e=>{c.default.info("<> "+e.remoteAddress)}))}))}))}catch(e){c.default.info(`Somethings went wrong\n ${e}`)}}}(u||(u={})),t.stratum=u},925:function(e,t,r){var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.removeWorker=t.makeOnline=t.updateHashrate=t.addWorker=t.calcPoolHashrate=t.increaseAccepted=t.accepted=t.UIDbyName=t.activeWorkers=t.workers=void 0;const n=r(950),a=o(r(495));t.workers=new Map,t.activeWorkers=0,t.UIDbyName=new Map,t.accepted=0,t.increaseAccepted=function(){t.accepted++},t.calcPoolHashrate=function(){let e=0;return t.workers.forEach(((t,r)=>{t.online&&(e+=Number(t.hashrate))})),e},t.addWorker=function(e,r){t.workers.get(e)||(t.activeWorkers++,t.workers.set(e,r),t.UIDbyName.set(r.name,e)),t.workers.get(e).online=!0,n.calc()},t.updateHashrate=function(e,r){var o;null===(o=t.workers.get(t.UIDbyName.get(e)))||void 0===o||(o.hashrate=r)},t.makeOnline=function(e){var r;null===(r=t.workers.get(t.UIDbyName.get(e)))||void 0===r||(r.online=!0)},t.removeWorker=function(e){t.workers.forEach(((r,o)=>{r.ip==e&&(r.online=!1,t.activeWorkers--,a.default.info(`Worker ${r.name} is offline!`),a.default.info(`Workers: ${t.activeWorkers}/${t.workers.size}}`))}))}},495:function(e,t,r){var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const n=r(160),a=o(r(747)),s=o(r(277)),i=a.default.createWriteStream(s.default.join(null==process.env.LOGDIR?s.default.join(process.env.HOME,".shadowlogs"):process.env.LOGDIR,"shadow-debug.log"),{flags:"w",autoClose:!0});function c(e){const t=e.toJSON();i.write("["+t.date.getDay().toString().padStart(2,"0")+"."+t.date.getMonth().toString().padStart(2,"0")+" "+t.date.getHours().toString().padStart(2,"0")+":"+t.date.getMinutes().toString().padStart(2,"0")+"] ["+t.logLevel+"] "+t.argumentsArray+"\n\n")}const u=new n.Logger;u.setSettings({displayFilePath:"hidden",displayLogLevel:!0,displayFunctionName:!1,displayInstanceName:!1,displayRequestId:!1,displayTypes:!1,displayLoggerName:!1,minLevel:"fatal"}),u.attachTransport({silly:c,debug:c,trace:c,info:c,warn:c,error:c,fatal:c},"debug"),t.default=u},226:function(e,t,r){var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.getStat=void 0;const n=r(467),a=o(r(495));t.getStat=async function(e){let t=await(await n.web3.eth.getBlock("latest")).number,r=(Number(await(await n.web3.eth.getBlock(t)).timestamp)-Number(await(await n.web3.eth.getBlock(t-e)).timestamp))/e,o=(await n.web3.eth.getBlock(t)).difficulty;return a.default.debug(`Diff ${o/1e9} G`),a.default.debug(`Blocktime ${r} ms`),a.default.debug(`Network hashrate: ${o/r/1e9} G`),{hashrate:o/r,blocktime:r,diff:o}}},907:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.view=t.updateLastBlockDate=void 0,r(887);const o=r(925),n=r(467),a=r(925),s=r(467);r(226);const i=r(226);let c;t.updateLastBlockDate=function(e){c=new Date(e)};const u=function(e){return e>86400?(e/86400).toPrecision(2)+"d":e>3600?(e/3600).toPrecision(2)+"h":e>60?(e/60).toPrecision(2)+"m":e<0?"?":e.toPrecision(2)+"s"},l=async function(){i.getStat(1e3).then((async e=>{console.clear();const t=await async function(e){return Number((a.calcPoolHashrate()*e.blocktime/e.hashrate).toPrecision(2))}(e),r=(Number(new Date)-Number(null==c?1e17:c))/1e3,i=Math.floor(r<0?0:r/t*100),l=Math.floor(a.calcPoolHashrate()/1e4)/100;console.log("------------------------"),console.info(`Balance: ${s.web3.utils.fromWei(await s.web3.eth.getBalance(await s.web3.eth.getCoinbase()),"ether")}`),console.log("Hashrate: "+(l<0?"?":l.toString()+"MH")),console.log(`Workers: ${o.activeWorkers}/${o.workers.size}`),console.log(`Last block: ${n.lastBlock}`),console.log(`Mined by: ${n.whoMinedLastBlock}`),console.log(`Expected blocktime: ${u(t)}`),console.log(`Time passed: ${u(r)}`),console.log("Progress: "+(i<0?"?":i.toString()+"%")),console.log(`Total shares: ${o.accepted}/${function(){let e=0;return n.shares.forEach(((t,r)=>{t.isBlock&&e++})),e}()}`),console.log("------------------------")}))};t.view=function(){setInterval(l,1e3)}},747:e=>{e.exports=require("fs")},605:e=>{e.exports=require("http")},631:e=>{e.exports=require("net")},277:e=>{e.exports=require("path")},160:e=>{e.exports=require("tslog")},409:e=>{e.exports=require("web3")}},t={};function r(o){if(t[o])return t[o].exports;var n=t[o]={exports:{}};return e[o].call(n.exports,n,n.exports,r),n.exports}(()=>{r(887);const e=r(887);r(467);const t=r(467),o=r(907);e.stratum.create(8008,"0.0.0.0"),t.start(),o.view()})()})();