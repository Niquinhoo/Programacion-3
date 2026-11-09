import { useState } from 'react';
import { categories } from '../data/categories.js';
import Icon from '../components/Icon.jsx';

const icons = ['person-outline', 'notifications-outline', 'color-palette-outline', 'shield-checkmark-outline', 'pie-chart-outline', 'wallet-outline', 'help-circle-outline', 'chatbox-ellipses-outline', 'information-circle-outline'];

const groups = [
  { title: 'CUENTA', rows: [
    ['Editar perfil', '', 'El perfil es de ejemplo. La edición de cuentas no está habilitada en esta demostración.'],
    ['Notificaciones', '', 'Esta demostración no envía notificaciones.'],
  ] },
  { title: 'APP', rows: [
    ['Apariencia', 'Claro', 'La app utiliza un tema claro y azul para todas las acciones.'],
    ['Seguridad', '', 'La demostración es pública para la cátedra. El servidor valida cada gasto antes de guardarlo en D1.'],
    ['Categorías', '', `Categorías disponibles: ${categories.join(', ')}.`],
    ['Moneda y formato', 'ARS', 'Los montos se muestran en pesos argentinos (ARS), con punto para miles y coma para decimales.'],
  ] },
  { title: 'SOPORTE', rows: [
    ['Ayuda y soporte', '', 'Registrá un gasto desde Inicio. Los gastos se guardan en D1 y requieren conexión a internet.'],
    ['Enviar sugerencia', '', 'El envío de sugerencias no está habilitado en esta demostración.'],
    ['Sobre la app', 'v2.0.0', 'ExpenseTracker · PWA del Sprint 2.'],
  ] },
];

export default function SettingsScreen({ active }) {
  const [message, setMessage] = useState('');
  return <div className="screen-scroll" hidden={!active}><div className="settings-page"><h1>Configuración</h1>
    {groups.map((group, groupIndex) => <section className="settings-section" key={group.title}><h2>{group.title}</h2><div className="settings-card">
      {groupIndex === 0 && <div className="profile-row"><span className="avatar">N</span><span><strong>Nicolás</strong><small>Modo demostración</small></span><span className="demo-label">DEMO</span></div>}
      {group.rows.map(([label, value, hint], index) => <button className="settings-row" key={label} onClick={() => setMessage(hint)}><Icon name={icons[groupIndex === 0 ? index : groupIndex === 1 ? index + 2 : index + 6]} size={20} /><span className="setting-label">{label}</span>{value && <span className="setting-value">{value}</span>}<Icon name="chevron-forward" size={15} /></button>)}
    </div></section>)}
    <button className="logout-button" onClick={() => setMessage('Esta demostración no usa cuentas: no hay una sesión que cerrar.')}><Icon name="log-out-outline" size={21} /><span>Cerrar sesión</span><Icon name="chevron-forward" size={15} /></button>
    {message && <section className="notice" role="status"><p>{message}</p><button className="text-button" onClick={() => setMessage('')}>Entendido</button></section>}
  </div></div>;
}
