"use client";
import { FaLock } from "react-icons/fa6";
import { FaUnlock } from "react-icons/fa";
import toast from "react-hot-toast";

import { useState, useEffect, useRef } from "react";

export default function LockScreen() {
  const [locked, setLocked] = useState(false);
  const buttonRef = useRef(null);
  useEffect(() => {
    if (locked) {
      toast("Screen Locked", { style: { background: "#333", color: "#fff" } });
      document.body.style.pointerEvents = "none";
      document.body.style.overflow = "hidden"; // 🔒 Prevent scrolling

      // Re-enable pointer events only on this button
      if (buttonRef.current) {
        buttonRef.current.style.pointerEvents = "auto";
      }
    } else {
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto"; // ✅ Restore scrolling
    }

    // Cleanup on unmount
    return () => {
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
    };
  }, [locked]);

  return (
    <>
      <div className="absolute top-5 right-5 z-50">
        <button
          ref={buttonRef}
          onClick={() => setLocked(!locked)}
          className={`p-3 rounded-full backdrop-blur-sm border border-white/20 transition
            ${
              locked
                ? "bg-black hover:bg-black/80 text-gray-400"
                : "bg-black/40 hover:bg-black/60 text-gray-400"
            }`}
        >
          {locked ? <FaUnlock size={20} /> : <FaLock size={20} />}
        </button>
      </div>
      {locked && (
        <div className="absolute left-5 top-5 bg-black/50 backdrop-blur-xl px-4 py-2 text-white shadow-xl border border-gray-700 rounded-md shadow-gray-800">
          <span>screen locked</span>
        </div>
      )}
    </>
  );
}
