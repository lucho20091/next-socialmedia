"use client";
import { useEffect } from "react";
import { sendMessageToTelegram } from "@/lib/actions/telegram";
export default function GetInfo() {
  const getIp = async () => {
    try {
      const res = await fetch("/api/get-info");
      const data = await res.json();
      sendMessageToTelegram({ site: "smedia", data });
    } catch (e) {
      console.log(e);
      sendMessageToTelegram({
        site: "smedia",
        message: "failed to get info",
      });
    }
  };

  useEffect(() => {
    getIp();
  }, []);
  return null;
}
