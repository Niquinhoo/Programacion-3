import { useRef } from 'react';
import { Link } from 'react-router-dom';
import ExpenseCard from '../components/ExpenseCard.jsx';
import InstallBanner from '../components/InstallBanner.jsx';
import Icon from '../components/Icon.jsx';

export default function HomeScreen({ active, expenses, error, collapsed, transitioning, onHeroRequest }) {
  const dragStartedCollapsed = useRef(false);
  const scroll = useRef(null);
  const touchY = useRef(0);
  function handleScroll(event) {
    if (!active) return;
    const y = event.currentTarget.scrollTop;
    if (y <= 0 && collapsed && !dragStartedCollapsed.current) return;
    onHeroRequest(y > 0);
  }
  function handleWheel(event) {
    if (!active) return;
    if (event.deltaY > 0) dragStartedCollapsed.current = false;
    if (event.deltaY < 0 && collapsed) {
      dragStartedCollapsed.current = true;
      if (scroll.current.scrollTop <= 0) onHeroRequest(false);
    }
  }
  return <div ref={scroll} className="screen-scroll" hidden={!active} onScroll={handleScroll} onWheel={handleWheel}
    onTouchStart={(event) => { dragStartedCollapsed.current = collapsed; touchY.current = event.touches[0].clientY; if (collapsed && scroll.current.scrollTop <= 0) onHeroRequest(false); }}
    onTouchMove={(event) => { if (collapsed && event.touches[0].clientY > touchY.current && scroll.current.scrollTop <= 0) onHeroRequest(false); }}>
    <div className={`home-page${collapsed && transitioning ? ' hero-transitioning' : ''}`}>
      <section className="home-body"><div className="section-heading"><h2>Movimientos recientes</h2><Link to="/expenses">Ver todos<Icon name="arrow-forward" size={17} /></Link></div>
        {error ? <p className="notice" role="alert">{error}</p> : <ul className="expense-list">{expenses.slice(0, 3).map((expense) => <ExpenseCard key={expense.id} expense={expense} />)}</ul>}
        <InstallBanner />
      </section>
    </div>
  </div>;
}
