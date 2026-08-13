import React, { useEffect, useRef } from 'react';


export default function WheelPicker({ items, selectedIndex, onSelect }) {
  const wheelRef = useRef(null);

  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;
    const el = wheel.children[selectedIndex];
    if (el) {
      el.scrollIntoView({ block: 'center' });
    }
  }, [items]);

  const handleClick = (index) => {
    onSelect(index);
    requestAnimationFrame(() => {
      const wheel = wheelRef.current;
      if (wheel && wheel.children[index]) {
        wheel.children[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  };

  return (
    <div className="wheel" ref={wheelRef}>
      {items.map((item, index) => (
        <div
          key={item}
          className={`wheel-item${index === selectedIndex ? ' selected' : ''}`}
          data-index={index}
          onClick={() => handleClick(index)}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
