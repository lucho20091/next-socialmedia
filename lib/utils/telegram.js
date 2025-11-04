import TelegramBot from "node-telegram-bot-api";

const token = process.env.TELEGRAM_TOKEN;
const userId = process.env.TELEGRAM_ID;

if (!token) {
  throw new Error("TELEGRAM_TOKEN is not defined in environment variables");
}

let bot;

if (!global.bot) {
  global.bot = new TelegramBot(token, { polling: true });
  console.log("✅ Telegram bot started");
}

bot = global.bot;

export { bot, userId };
