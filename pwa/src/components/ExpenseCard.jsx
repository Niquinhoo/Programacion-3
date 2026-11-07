import { Link, useLocation } from 'react-router-dom';
import { formatAmount, formatDate } from '../utils/expense.js';
import Icon from './Icon.jsx';

const categories = {
  Alimentos: { icon: 'cart-outline', color: '#08A94E', background: '#DFF8E9' },
  Transporte: { icon: 'car-outline', color: '#087FF5', background: '#E0F0FF' },
  Servicios: { icon: 'wifi-outline', color: '#9C23D5', background: '#F4E5FC' },
  Otros: { icon: 'receipt-outline', color: '#C37500', background: '#FFF3D6' },
};

export default function ExpenseCard({ expense }) {
  const location = useLocation();
  const category = categories[expense.category] || categories.Otros;
  return <li className="expense-item"><Link className="expense-card" to={`/expenses/${expense.id}`} state={{ backgroundPath: location.pathname }} aria-label={`Ver detalle de ${expense.name}, ${formatAmount(expense.amount)}`}>
    <span className="expense-mark" style={{ background: category.background, color: category.color }}><Icon name={category.icon} size={26} /></span>
    <span className="expense-info"><strong>{expense.name}</strong><span className="expense-category">{expense.category}</span></span>
    <span className="expense-amount"><strong>{formatAmount(expense.amount)}</strong><time dateTime={expense.date}>{formatDate(expense.date)}</time></span><Icon name="chevron-forward" size={18} className="chevron" />
  </Link></li>;
}
