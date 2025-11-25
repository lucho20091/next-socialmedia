"use server";
import { sendTelegramMessage } from "@/lib/utils/telegram";
export async function sendMessageToTelegram(message) {
  await sendTelegramMessage(message);
}