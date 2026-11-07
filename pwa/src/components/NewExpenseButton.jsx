import { useLayoutEffect, useRef } from 'react';
import useReduceMotion from '../hooks/useReduceMotion.js';
import { keepTransitionDuration, motion, springFrames, timingFrames } from '../utils/motion.js';
import Icon from './Icon.jsx';

export default function NewExpenseButton({ expanded, onClick }) {
  const button = useRef(null);
  const previous = useRef(expanded);
  const reduced = useReduceMotion();
  useLayoutEffect(() => {
    if (previous.current === expanded) return;
    previous.current = expanded;
    keepTransitionDuration(button.current.parentElement, reduced ? 0 : motion.morph);
    if (reduced) return;
    const jump = expanded ? -8 : -14;
    const spring = springFrames(jump);
    const duration = motion.jump + spring.at(-1).time;
    const frames = timingFrames((p) => ({ transform: `translateY(${jump * p}px)` }), (t) => 1 - (1 - t) ** 2)
      .map((frame) => ({ ...frame, offset: frame.offset * motion.jump / duration }));
    frames.push(...spring.slice(1).map(({ time, y }) => ({ transform: `translateY(${y}px)`, offset: (motion.jump + time) / duration })));
    const animation = button.current.animate(frames, { id: 'button-jump', delay: motion.morph, duration, fill: 'backwards' });
    return () => animation.cancel();
  }, [expanded, reduced]);
  return <div className={`new-button-slot${expanded ? ' expanded' : ''}`}>
    <button ref={button} data-testid="new-expense-button" className="new-expense-button" aria-label={expanded ? 'Cargar un gasto' : 'Nuevo gasto'} onClick={onClick}>
      <Icon className="new-button-plus" name="add" size={30} /><span className="new-button-label" aria-hidden="true">Cargar un gasto</span><Icon className="new-button-arrow" name="arrow-forward" size={22} />
    </button>
  </div>;
}
