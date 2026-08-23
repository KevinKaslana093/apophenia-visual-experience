import { useEffect, useRef } from 'react';

// Adapted from React Bits / Magnet Lines (MIT).
export default function MagnetLines({ rows = 8, columns = 12, active = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !active) return undefined;
    const lines = [...root.querySelectorAll('i')];
    const point = { x: innerWidth * 0.5, y: innerHeight * 0.5 };
    const rotate = () => lines.forEach((line) => {
      const box = line.getBoundingClientRect();
      const angle = Math.atan2(point.y - (box.top + box.height / 2), point.x - (box.left + box.width / 2));
      line.style.transform = `rotate(${angle}rad)`;
    });
    const move = (event) => { point.x = event.clientX; point.y = event.clientY; rotate(); };
    rotate();
    addEventListener('pointermove', move);
    return () => removeEventListener('pointermove', move);
  }, [active, rows, columns]);

  return (
    <div ref={ref} className={`magnet-lines ${active ? 'is-active' : ''}`} style={{ '--rows': rows, '--columns': columns }}>
      {Array.from({ length: rows * columns }, (_, index) => <i key={index} />)}
    </div>
  );
}
