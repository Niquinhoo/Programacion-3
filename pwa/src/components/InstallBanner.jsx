import { usePWAInstall } from '../hooks/usePWAInstall.js';

export default function InstallBanner() {
  const { canInstall, isIOS, install } = usePWAInstall();
  if (!canInstall && !isIOS) return null;
  return <aside className="install-banner" aria-label="Instalar ExpenseTracker">
    <span><strong>Tené tus gastos a mano</strong><small>{isIOS ? 'Compartir → Agregar a pantalla de inicio' : 'Instalá ExpenseTracker en tu dispositivo.'}</small></span>
    {canInstall && <button className="button button-small" onClick={install}>Instalar App</button>}
  </aside>;
}
