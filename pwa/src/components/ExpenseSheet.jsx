import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useBlocker } from 'react-router-dom';
import useReduceMotion from '../hooks/useReduceMotion.js';
import { easing, motion, timingFrames } from '../utils/motion.js';
import Icon from './Icon.jsx';

export default function ExpenseSheet({ title, onClose, children, headerAction }) {
  const dialog = useRef(null);
  const panel = useRef(null);
  const scrim = useRef(null);
  const back = useRef(null);
  const finished = useRef(false);
  const [requestedClose, setClosing] = useState(false);
  const reduced = useReduceMotion();
  const headingId = useId();
  const blocker = useBlocker(useCallback(() => !finished.current, []));
  const closing = requestedClose || blocker.state === 'blocked';
  const completion = useRef({ onClose, blocker });
  useLayoutEffect(() => { completion.current = { onClose, blocker }; });
  const close = useCallback(() => setClosing(true), []);
  useLayoutEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;
    element.showModal();
    back.current.focus({ preventScroll: true });
    const viewport = window.visualViewport;
    const resize = () => {
      element.style.height = `${viewport?.height ?? window.innerHeight}px`;
      element.style.top = `${viewport?.offsetTop ?? 0}px`;
    };
    resize();
    viewport?.addEventListener('resize', resize);
    viewport?.addEventListener('scroll', resize);
    return () => {
      viewport?.removeEventListener('resize', resize);
      viewport?.removeEventListener('scroll', resize);
      element.close();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);
  useLayoutEffect(() => {
    let canceled = false;
    if (closing && dialog.current.contains(document.activeElement)) document.activeElement.blur();
    const element = panel.current;
    const backdrop = scrim.current;
    const height = window.visualViewport?.height ?? window.innerHeight;
    const startY = closing ? new DOMMatrixReadOnly(getComputedStyle(element).transform).m42 : height;
    const startOpacity = closing ? Number(getComputedStyle(backdrop).opacity) : 0;
    const endY = closing ? height : 0;
    const endOpacity = closing ? 0 : 1;
    const duration = reduced ? 0 : closing ? motion.sheetClose : motion.sheetOpen;
    const curve = closing ? easing.in : easing.out;
    const animation = element.animate(timingFrames((p) => ({ transform: `translateY(${startY + (endY - startY) * p}px)` }), curve), { id: 'sheet-motion', duration, fill: 'both' });
    const fade = backdrop.animate(timingFrames((p) => ({ opacity: startOpacity + (endOpacity - startOpacity) * p }), curve), { duration, fill: 'both' });
    animation.finished.then(() => {
      if (canceled || !closing) return;
      finished.current = true;
      dialog.current.close();
      const { blocker: pending, onClose: complete } = completion.current;
      if (pending.state === 'blocked') pending.proceed();
      else complete();
    }).catch(() => {});
    return () => {
      canceled = true;
      element.style.transform = getComputedStyle(element).transform;
      backdrop.style.opacity = getComputedStyle(backdrop).opacity;
      animation.cancel();
      fade.cancel();
    };
  }, [closing, reduced]);
  return createPortal(<dialog ref={dialog} className="expense-dialog" aria-labelledby={headingId} onCancel={(event) => { event.preventDefault(); close(); }}>
    <div ref={scrim} className="sheet-scrim" aria-hidden="true" />
    <button data-testid="sheet-backdrop" className="sheet-backdrop" tabIndex={-1} aria-label="Cerrar tocando fuera del panel" onClick={close} />
    <section ref={panel} data-testid="expense-sheet" className="expense-sheet" data-closing={closing}>
      <div className="dialog-handle" aria-hidden="true" />
      <header className="dialog-heading"><button ref={back} className="icon-button" aria-label="Volver" title="Cancelar" onClick={close}><Icon name="arrow-back" size={23} /></button><h2 id={headingId}>{title}</h2>{headerAction}</header>
      <div className="sheet-content">{typeof children === 'function' ? children(close) : children}</div>
    </section>
  </dialog>, document.body);
}
