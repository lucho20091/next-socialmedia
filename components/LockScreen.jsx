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
          className={`p-3 rounded-full backdrop-blur-xs border border-gray-700 shadow-md shadow-gray-900 transition
            ${
              locked
                ? "bg-black/20 hover:bg-black/40 text-gray-400"
                : "bg-black/10 hover:bg-black/40 text-gray-400"
            }`}
        >
          {locked ? <FaUnlock size={20} /> : <FaLock size={20} />}
        </button>
      </div>
      {locked && (
        <div className="absolute left-5 top-5 bg-black/10 backdrop-blur-xs px-4 py-2 text-gray-300 shadow-md border border-gray-700 rounded-md shadow-gray-900">
          <span>Screen Locked</span>
        </div>
      )}
    </>
  );
}
