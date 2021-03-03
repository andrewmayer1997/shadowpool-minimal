import "./observer";
import { watch } from "./observer";
import "node-telegram-bot-api";
import TelegramBot from "node-telegram-bot-api";

const token = "1643667819:AAFjB82QKOC-3ZcxUAlWmKWua9l5g4Ygi_k";

const bot = new TelegramBot(token as string, <TelegramBot.ConstructorOptions>{
  polling: false,
});

watch.on("error", async () => {
  if (bot.isPolling()) {
    await bot.stopPolling();
  }

  bot.getUpdates().then((upds) => {
    upds.forEach((upd) => {
      bot
        .sendMessage(
          upd.message!.chat.id,
          "Error occurred. Shadowpool was restarted!"
        )
        .then(() => {
          bot
            .sendMessage(
              upd.message!.chat.id,
              `Check the more details:\n<pre><code class="language-bash">less ~/.shadowlogs/error-debug.log\nless ~/.shadowlogs/error.log\n</code></pre>`,
              { parse_mode: "HTML" }
            )
            .then(() => {
              bot.sendMessage(
                upd.message!.chat.id,
                "p.s. scroll to end hotkeys: Shift + G"
              );
            });
        });
    });
  });
});

/*bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "You have subscribed to pool notifications");
  console.log("Add new client.");
});
*/
