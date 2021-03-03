import "./observer";
import { init, watch } from "./observer";
import "node-telegram-bot-api";
import TelegramBot from "node-telegram-bot-api";

init();

const token = process.env.TOKEN;
const chats = new Array<number>();

const bot = new TelegramBot(token as string, <TelegramBot.ConstructorOptions>{
  polling: false,
});

watch.on("error", () => {
  chats.forEach((id) => {
    bot.sendMessage(id, "Error occurred. Shadowpool was restarted!");
    bot.sendMessage(
      id,
      "Check more detail: \nless ~/.shadowlogs/error-debug.log \nless ~/.shadowlogs/error.log"
    );
    bot.sendMessage(id, "p.s. scroll to end hotkeys: Shift + G");
  });
});

bot.onText(/\/init/, (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "You have subscribed to pool notifications");
  chats.push(chatId);
});
