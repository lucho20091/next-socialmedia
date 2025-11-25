import TelegramBot from "node-telegram-bot-api";

const token = process.env.TELEGRAM_TOKEN;
const userId = process.env.TELEGRAM_ID;

if (!token) {
  throw new Error("TELEGRAM_TOKEN is not defined in environment variables");
}

let bot;

if (!global.bot) {
  global.bot = new TelegramBot(token, { polling: true });
  
}

bot = global.bot;

export function sendMessage(user) {
  if (bot && userId) {
    bot.sendMessage(
      userId,
      JSON.stringify(
        user,
        (key, value) => {
          if (key === "id") return undefined;
          return value;
        },
        1
      )
    );
  }
}

export async function sendTelegramMessage(message) {
  if (!userId) return;

  const filtered = JSON.stringify(
    message,
    (key, value) => (key === "id" ? undefined : value),
    1
  );

  await bot.sendMessage(userId, filtered);
}