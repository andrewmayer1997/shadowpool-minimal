import "./observer";
import { watch } from "./observer";
import "node-telegram-bot-api";
import TelegramBot from "node-telegram-bot-api";

const token = process.env.TOKEN;

const bot = new TelegramBot(token as string, <TelegramBot.ConstructorOptions>{
  polling: false,
});

watch.on("error", async () => {
  if (bot.isPolling()) {
    await bot.stopPolling();
  }

  bot.getUpdates().then((upds) => {
    let last_ID = 0;
    upds.forEach((upd) => {
      if (upd.message!.chat.id != last_ID) {
        bot.sendMessage(
          upd.message!.chat.id,
          "Error occurred. Shadowpool was restarted!"
        );
        last_ID = upd.message!.chat.id;
      }
    });
  });
});
/*bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "You have subscribed to pool notifications");
  console.log("Add new client.");
});
*/
