import { useMemo, useState } from 'react';
import ExpenseCard from '../components/ExpenseCard.jsx';
import Icon from '../components/Icon.jsx';
import { categories } from '../data/categories.js';
import { filterExpenses } from '../utils/expense.js';

export default function ExpensesScreen({ active, expenses, error }) {
  const [query, setQuery] = useState('');
  const [period, setPeriod] = useState('Todos');
  const [category, setCategory] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const visible = useMemo(() => filterExpenses(expenses, { query, period, category }), [expenses, query, period, category]);
  return <div className="screen-scroll" hidden={!active}><div className="listing-page">
    <label className="search-field"><Icon name="search-outline" size={22} /><span className="visually-hidden">Buscar gastos, comercios o categorías</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar gastos, comercios o categorías..." />{query && <button className="icon-button" onClick={() => setQuery('')} aria-label="Limpiar búsqueda"><Icon name="close" size={20} /></button>}</label>
    <div className="filters" role="group" aria-label="Filtrar gastos">{['Todos', 'Hoy', 'Semana', 'Mes'].map((item) => <button key={item} className={`chip period-chip${period === item ? ' selected' : ''}`} aria-pressed={period === item} onClick={() => setPeriod(item)}>{item}</button>)}
      <button className={`chip category-chip${category ? ' selected' : ''}`} aria-label="Filtrar por categoría" aria-expanded={showCategories} aria-pressed={Boolean(category)} onClick={() => setShowCategories(!showCategories)}><Icon name="options-outline" size={17} /><span className="category-chip-label">Categorías</span></button>
    </div>
    {showCategories && <div className="category-options" role="group" aria-label="Categorías">{['', ...categories].map((item) => <button key={item} className={`chip${category === item ? ' selected' : ''}`} aria-pressed={category === item} onClick={() => setCategory(item)}>{item || 'Todas'}</button>)}</div>}
    {error ? <p className="notice" role="alert">{error}</p> : visible.length ? <ul className="expense-list">{visible.map((expense) => <ExpenseCard key={expense.id} expense={expense} />)}</ul> : <section className="empty-state"><h2>Sin movimientos</h2><p>Probá otra búsqueda o cambiá los filtros.</p></section>}
  </div></div>;
}
