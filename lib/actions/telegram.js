"use server";
export async function sendMessageToTelegram(message) {
  await sendTelegramMessage(message);
}
