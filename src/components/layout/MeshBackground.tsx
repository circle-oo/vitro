import React from 'react';

export interface MeshBackgroundProps {
  className?: string;
}

export function MeshBackground({ className }: MeshBackgroundProps) {
  return (
    <>
      <div
        className={`vitro-mesh ${className ?? ''}`}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
        }}
        data-vitro-mesh
      />
      <div className="vitro-noise" />
    </>
  );
}
