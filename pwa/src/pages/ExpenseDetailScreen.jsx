import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CategoryBadge from '../components/CategoryBadge.jsx';
import ExpenseSheet from '../components/ExpenseSheet.jsx';
import { getExpense } from '../services/expenses.js';
import { formatAmount, formatDate } from '../utils/expense.js';

export default function ExpenseDetailScreen({ id }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    getExpense(id).then((item) => { if (active) setExpense(item); }).catch((e) => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [id]);
  function back() {
    if (location.state?.backgroundPath && window.history.state?.idx > 0) navigate(-1);
    else navigate('/expenses', { replace: true });
  }
  return <ExpenseSheet title="Detalle del gasto" onClose={back}>
    {error ? <section className="empty-state"><h3>No se encontró el gasto</h3><p>{error}</p></section> : expense ? <>
      <h3 className="sheet-title">{expense.name}</h3>
      <article className="detail-card"><span className="field-label">MONTO</span><strong className="detail-amount">{formatAmount(expense.amount)}</strong><hr />
        <div className="detail-row"><span className="field-label">CATEGORÍA</span><CategoryBadge category={expense.category} /></div>
        <div className="detail-row"><span className="field-label">FECHA</span><time dateTime={expense.date}>{formatDate(expense.date)}</time></div>
        {expense.notes && <div className="detail-notes"><span className="field-label">NOTAS</span><p>{expense.notes}</p></div>}
      </article>
    </> : <p className="muted" role="status">Cargando gasto…</p>}
  </ExpenseSheet>;
}
