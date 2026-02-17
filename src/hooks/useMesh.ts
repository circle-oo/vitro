import { useState, useEffect } from 'react';

export function useMesh() {
  const [active, setActive] = useState(() => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem('vitro-mesh');
    return stored !== 'off';
  });

  useEffect(() => {
    document.documentElement.dataset.mesh = active ? 'on' : 'off';
    localStorage.setItem('vitro-mesh', active ? 'on' : 'off');
  }, [active]);

  return {
    active,
    setActive,
    toggle: () => setActive((a) => !a),
  };
}
