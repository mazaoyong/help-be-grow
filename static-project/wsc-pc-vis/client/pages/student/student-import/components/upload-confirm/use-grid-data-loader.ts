import { useCallback, useState } from 'react';

export default function useGridDataLoader({ setCurrent }) {
  const [selected, setSelected] = useState<number[]>([]);

  const onGridChange = useCallback(pageable => {
    const { current = 1 } = pageable;
    setCurrent(current);
    setSelected([]);
  }, []);

  return {
    selected,
    onGridChange,
    setSelected,
  };
}
