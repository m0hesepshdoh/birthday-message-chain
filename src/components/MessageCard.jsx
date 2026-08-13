import React, { useEffect, useState } from "react";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { db } from "../firebase.js";

export default function MessageCard({
  msg,
  id,
  lang,
  monthNames,
  formatTimeAgo,
}) {
  const isAlreadyLiked =
    typeof localStorage !== "undefined" &&
    localStorage.getItem(`liked-${id}`) === "true";

  const [isLiked, setIsLiked] = useState(isAlreadyLiked);
  const [likeCount, setLikeCount] = useState(msg.likes || 0);

  useEffect(() => {
    if (!isAlreadyLiked) {
      const fetchLatest = async () => {
        try {
          const snap = await getDoc(doc(db, "submissions", id));
          if (snap.exists()) {
            setLikeCount(snap.data().likes || 0);
          }
        } catch (err) {
          console.error("Error fetching latest like count:", err);
        }
      };
      fetchLatest();
    }
  }, []);

  const toggleLike = async () => {
    const likesRef = doc(db, "submissions", id);
    try {
      if (isLiked) {
        await updateDoc(likesRef, { likes: increment(-1) });
        setLikeCount((c) => c - 1);
      } else {
        await updateDoc(likesRef, { likes: increment(1) });
        setLikeCount((c) => c + 1);
      }
      const next = !isLiked;
      setIsLiked(next);
      localStorage.setItem(`liked-${id}`, String(next));
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const messageClass = msg.language === "Arabic" ? "arabic-message" : "";

  return (
    <div className="message-card bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex space-x-2">
          <span className="birthday-badge px-3 py-1 rounded-full text-xs font-semibold">
            {monthNames[msg.birthMonth - 1]} {msg.birthDay}
          </span>
          {msg.language && (
            <span className="language-badge px-3 py-1 rounded-full text-xs font-semibold">
              {msg.language}
            </span>
          )}
        </div>
        <span className="text-gray-500 text-sm">
          {formatTimeAgo(msg.timestamp?.toDate?.())}
        </span>
      </div>
      <p className={`text-gray-700 mb-4 ${messageClass}`}>{msg.message}</p>
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleLike}
          className={`flex items-center space-x-1 transition ${isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"}`}
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>{likeCount}</span>
        </button>
      </div>
    </div>
  );
}
