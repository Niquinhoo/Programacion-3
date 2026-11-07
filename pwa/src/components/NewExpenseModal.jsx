import { useRef, useState } from 'react';
import { categories } from '../data/categories.js';
import { createExpense } from '../services/expenses.js';
import { validateExpense } from '../utils/expense.js';
import ExpenseSheet from './ExpenseSheet.jsx';
import Icon from './Icon.jsx';

export default function NewExpenseModal({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const submitting = useRef(false);
  async function submit(event, close) {
    event.preventDefault();
    if (submitting.current) return;
    const { error, expense } = validateExpense({ name, amount, category, notes });
    if (error) { setMessage(error); return; }
    submitting.current = true;
    setSaving(true);
    setMessage('');
    try {
      const created = await createExpense(expense);
      onCreated(created);
      close();
    } catch (err) {
      setMessage(err.message || 'No se pudo guardar el gasto.');
      submitting.current = false;
      setSaving(false);
    }
  }
  return <ExpenseSheet title="Nuevo gasto" onClose={onClose} headerAction={<button type="button" className="icon-button note-toggle" aria-label="Notas opcionales" aria-expanded={showNotes} onClick={() => setShowNotes(!showNotes)}><Icon name="receipt-outline" size={20} /></button>}>{(close) => <>
    <h3 className="sheet-title">Cargá un gasto</h3>
    <form noValidate onSubmit={(event) => submit(event, close)}>
      <div className="form-fields">
        <label className="field">Nombre<input required maxLength="100" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej.: Supermercado" autoCapitalize="sentences" /></label>
        <label className="field">Monto (ARS)<input required inputMode="decimal" maxLength="18" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Ej.: 25000,50" /></label>
        <fieldset className="field"><legend>Categoría</legend><div className="category-options">{categories.map((item) => <label className={`choice${category === item ? ' selected' : ''}`} key={item}><input type="radio" name="category" value={item} checked={category === item} onChange={() => setCategory(item)} />{item}</label>)}</div></fieldset>
        {showNotes && <label className="field">Notas (opcional)<textarea maxLength="1000" rows="2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Agregá un detalle" /></label>}
      </div>
      <button className="button action-button" type="submit" disabled={saving}><span>{saving ? 'Guardando…' : 'Guardar'}</span><Icon name="arrow-forward" size={22} /></button>
      {message && <p className="form-message" role="alert">{message}</p>}
    </form>
  </>}</ExpenseSheet>;
}
