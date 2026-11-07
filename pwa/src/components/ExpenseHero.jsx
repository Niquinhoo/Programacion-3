import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { filterExpenses, formatAmount } from '../utils/expense.js';
import { keepTransitionDuration, motion } from '../utils/motion.js';
import useReduceMotion from '../hooks/useReduceMotion.js';
import Icon from './Icon.jsx';

export default function ExpenseHero({ home, collapsed, expenses, onTransitionChange }) {
  const details = home && !collapsed;
  const previousDetails = useRef(details);
  const reduceMotion = useReduceMotion();
  const intro = useRef(null);
  const hero = useRef(null);
  const footer = useRef(null);
  const amount = useRef(null);
  const [heights, setHeights] = useState({ intro: 154, footer: 64 });
  useLayoutEffect(() => {
    const measure = () => setHeights({ intro: intro.current.scrollHeight, footer: footer.current.scrollHeight });
    const observer = new ResizeObserver(measure);
    observer.observe(intro.current);
    observer.observe(footer.current);
    return () => observer.disconnect();
  }, []);
  useLayoutEffect(() => {
    if (previousDetails.current === details) return;
    previousDetails.current = details;
    keepTransitionDuration(hero.current, reduceMotion ? 0 : motion.morph);
    onTransitionChange({ complete: false, lockedUntil: 0 });
    const timeout = setTimeout(() => onTransitionChange({ complete: true, lockedUntil: Date.now() + motion.heroStable }), reduceMotion ? 0 : motion.morph);
    return () => {
      clearTimeout(timeout);
      onTransitionChange({ complete: true, lockedUntil: 0 });
    };
  }, [details, onTransitionChange, reduceMotion]);
  const items = home ? expenses : filterExpenses(expenses, { period: 'Mes' });
  const total = formatAmount(items.reduce((sum, expense) => sum + expense.amount, 0));
  useLayoutEffect(() => {
    const node = amount.current;
    let active = true;
    const fit = () => {
      node.style.fontSize = '48px';
      if (node.scrollWidth > node.clientWidth) node.style.fontSize = `${Math.max(33.6, 48 * node.clientWidth / node.scrollWidth)}px`;
    };
    const observer = new ResizeObserver(fit);
    observer.observe(node.parentElement);
    fit();
    document.fonts.ready.then(() => { if (active) fit(); });
    return () => { active = false; observer.disconnect(); };
  }, [total]);
  return <header ref={hero} data-testid="expense-hero" className={`hero${details ? ' expanded' : ''}`} style={{ '--intro-height': `${heights.intro}px`, '--footer-height': `${heights.footer}px` }}>
    <div className="hero-art" aria-hidden="true"><span className="outer-orbit" /><span className="inner-orbit" /><span className="light-orbit" /></div>
    <div className="hero-top"><p className="eyebrow">{home ? 'EXPENSETRACKER' : 'EXPENSETRACKER / GASTOS'}</p></div>
    <div className="hero-intro-fold" aria-hidden={!details} inert={!details}>
      <div ref={intro} className="hero-intro"><h1>Tus gastos,<br />más claros.</h1><p>Bienvenido. Registrá tus gastos y conocé en qué usás tu dinero.</p></div>
    </div>
    <div className="balance"><div className="hero-total"><span>{home ? 'TOTAL DE GASTOS' : 'ESTE MES'}</span><strong ref={amount} className="hero-amount">{total}</strong></div>
      <div className="chart-fold" aria-hidden="true"><div className="chart">{[28, 46, 70, 96].map((height) => <span key={height} style={{ height }} />)}</div></div>
    </div>
    <div className="hero-footer-fold" aria-hidden={!details} inert={!details}><div ref={footer} className="hero-footer"><div className="hero-activity"><span className="count-pill">{expenses.length} gastos</span><span className="hero-hint">registrados</span></div><Link className="overview" to="/expenses" aria-label="Ver visión general de los gastos"><Icon name="pie-chart-outline" size={19} /><span>VISIÓN GENERAL</span><Icon name="arrow-forward" size={18} /></Link></div></div>
  </header>;
}
