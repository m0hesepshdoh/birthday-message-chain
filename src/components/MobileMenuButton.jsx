import React from "react";

export default function MobileMenuButton({ onClick }) {
  return (
    <button
      id="mobileMenuBtn"
      className="md:hidden text-gray-700"
      onClick={onClick}
      aria-label="Toggle mobile menu"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
}
