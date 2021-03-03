import "./observer";
import { watch } from "./observer";
import "node-telegram-bot-api";
import TelegramBot from "node-telegram-bot-api";

const token = "1643667819:AAFjB82QKOC-3ZcxUAlWmKWua9l5g4Ygi_k";

const bot = new TelegramBot(token as string, <TelegramBot.ConstructorOptions>{
  polling: false,
});

watch.on("error", async () => {
  bot.getUpdates().then((upds) => {
    upds.forEach((upd) => {
      bot
        .sendMessage(upd.update_id, "Error occurred. Shadowpool was restarted!")
        .then(() => {
          bot
            .sendMessage(
              upd.update_id,
              "Check more detail: \nless ~/.shadowlogs/error-debug.log \nless ~/.shadowlogs/error.log"
            )
            .then(() => {
              bot.sendMessage(
                upd.update_id,
                "p.s. scroll to end hotkeys: Shift + G"
              );
            });
        });
    });
  });
});

bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "You have subscribed to pool notifications");
  console.log("Add new client.");
});
