import { useEffect, useState } from 'react';

export function usePWAInstall() {
  const [prompt, setPrompt] = useState(null);
  const [installed, setInstalled] = useState(() => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true);
  useEffect(() => {
    const capture = (event) => { event.preventDefault(); setPrompt(event); };
    const installedEvent = () => { setInstalled(true); setPrompt(null); };
    window.addEventListener('beforeinstallprompt', capture);
    window.addEventListener('appinstalled', installedEvent);
    return () => { window.removeEventListener('beforeinstallprompt', capture); window.removeEventListener('appinstalled', installedEvent); };
  }, []);
  return {
    canInstall: Boolean(prompt) && !installed,
    isIOS: /iphone|ipad|ipod/i.test(navigator.userAgent) && !installed,
    async install() { if (!prompt) return; await prompt.prompt(); setPrompt(null); },
  };
}
