import React, { useEffect, useState } from 'react';


export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let scrollTimeout;
    const scrollFunction = () => {
      const scrolled =
        document.body.scrollTop > 500 || document.documentElement.scrollTop > 500;
      setVisible(scrolled);
    };
    const onScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(scrollFunction, 10);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const topFunction = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      id="myBtn"
      title="Go to top"
      aria-label="Scroll to top"
      onClick={topFunction}
      style={{
        display: visible ? 'flex' : 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
      }}
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
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
}
