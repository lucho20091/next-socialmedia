// app/AosInit.js
"use client";
import { useEffect } from "react";
import AOS from "aos";
import "@/app/aos-custom.css";

export default function AosInit() {
  useEffect(() => {
    console.log("this ran");
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-cubic",
      mirror: false,
      disable: window.innerWidth < 1300,
    });
  }, []);

  return null;
}
