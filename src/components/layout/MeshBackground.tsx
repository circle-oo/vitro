import React from 'react';

interface MeshBackgroundProps {
  className?: string;
}

export function MeshBackground({ className }: MeshBackgroundProps) {
  return (
    <>
      <div
        className={className}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: [
            'conic-gradient(from var(--ma1) at 15% 15%, rgba(var(--gl), var(--mesh-op)) 0deg, transparent 120deg)',
            'conic-gradient(from var(--ma2) at 85% 75%, rgba(var(--gl), var(--mesh-op2)) 0deg, transparent 100deg)',
            'conic-gradient(from var(--ma3) at 50% 50%, rgba(var(--gl), var(--mesh-op3)) 0deg, transparent 80deg)',
            'var(--bg)',
          ].join(', '),
          transition: 'background 1s ease',
          animation: 'var(--mesh-animation, none)',
        }}
        data-vitro-mesh
      />
      <div className="vitro-noise" />
      <style>{`
        [data-mesh=on] [data-vitro-mesh] { animation: mesh-rot 20s linear infinite; }
        [data-mesh=off] [data-vitro-mesh] { animation: none !important; }
      `}</style>
    </>
  );
}
