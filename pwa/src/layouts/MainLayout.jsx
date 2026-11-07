import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useMatch, useNavigate } from 'react-router-dom';
import ExpenseHero from '../components/ExpenseHero.jsx';
import NewExpenseButton from '../components/NewExpenseButton.jsx';
import NewExpenseModal from '../components/NewExpenseModal.jsx';
import Icon from '../components/Icon.jsx';
import HomeScreen from '../pages/HomeScreen.jsx';
import ExpensesScreen from '../pages/ExpensesScreen.jsx';
import SettingsScreen from '../pages/SettingsScreen.jsx';
import ExpenseDetailScreen from '../pages/ExpenseDetailScreen.jsx';
import { getExpenses } from '../services/expenses.js';
import { heroEase, motion } from '../utils/motion.js';

const links = [['/', 'Inicio', 'home'], ['/expenses', 'Gastos', 'bar-chart'], ['/settings', 'Ajustes', 'settings']];

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const detail = useMatch('/expenses/:id');
  const path = detail ? location.state?.backgroundPath || '/expenses' : location.pathname;
  const home = path === '/';
  const settings = path === '/settings';
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const heroLock = useRef({ complete: true, lockedUntil: 0 });
  useEffect(() => {
    let active = true;
    getExpenses().then((items) => { if (active) setExpenses(items); }).catch((e) => { if (active) setError(e.message); });
    return () => { active = false; };
  }, []);
  const onTransitionChange = useCallback((status) => {
    heroLock.current = status;
    setTransitioning(!status.complete);
  }, []);
  function requestHero(value) {
    if (!home || detail || location.state?.newExpense || !heroLock.current.complete || Date.now() < heroLock.current.lockedUntil) return;
    if (value === collapsed) return;
    heroLock.current = { complete: false, lockedUntil: Date.now() + motion.heroStable };
    setCollapsed(value);
  }
  return <div className="app-shell" style={{ '--hero-ease': heroEase, '--morph-duration': `${motion.morph}ms` }}>
    {!settings && <ExpenseHero home={home} collapsed={collapsed} expenses={expenses} onTransitionChange={onTransitionChange} />}
    <div className="scene-area">
      {!settings && <NewExpenseButton expanded={home} onClick={() => navigate(location.pathname + location.search, { state: { ...location.state, newExpense: true } })} />}
      <main className="page-main">
        <HomeScreen active={home} expenses={expenses} error={error} collapsed={collapsed} transitioning={transitioning} onHeroRequest={requestHero} />
        <ExpensesScreen active={!home && !settings} expenses={expenses} error={error} />
        <SettingsScreen active={settings} />
        <Outlet />
      </main>
    </div>
    <nav className="bottom-nav" aria-label="Navegación principal">{links.map(([to, label, icon]) => <NavLink key={to} to={to} end={to === '/'} className={() => `nav-link${path === to ? ' active' : ''}`}><span className="nav-icon"><Icon name={icon} size={25} /></span><span>{label}</span></NavLink>)}</nav>
    {detail && <ExpenseDetailScreen key={detail.params.id} id={detail.params.id} />}
    {!detail && location.state?.newExpense && <NewExpenseModal onClose={() => navigate(-1)} onCreated={(expense) => { setExpenses((items) => [expense, ...items]); setError(''); }} />}
  </div>;
}
