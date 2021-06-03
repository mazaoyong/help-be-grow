import { useState } from 'react';

export default function usePagination() {
  const [current, setCurrent] = useState(1);

  return { current, setCurrent };
}
