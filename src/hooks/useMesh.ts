import { useEffect } from 'react';
import { usePersistentState } from './usePersistentState';

const MESH_KEY = 'vitro-mesh';

const serializeMesh = (value: boolean) => (value ? 'on' : 'off');

function readMesh(raw: string | null): boolean {
  return raw !== 'off';
}

export function useMesh() {
  const [active, setActive] = usePersistentState<boolean>(
    MESH_KEY,
    () => true,
    serializeMesh,
    readMesh,
  );

  useEffect(() => {
    document.documentElement.dataset.mesh = active ? 'on' : 'off';
  }, [active]);

  return {
    active,
    setActive,
    toggle: () => setActive((a) => !a),
  };
}
