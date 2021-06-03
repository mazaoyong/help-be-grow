import { useState, useCallback, useEffect } from 'react';
import * as api from '../../api';
import { Room } from '../../types';

export default function useList() {
  const [list, setList] = useState<Room[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(() => {
    setLoading(true);

    api.fetchLiveList({ page }).then(res => {
      setLoading(false);
      setList(res.list);
      setTotal(res.total);
    });
  }, [page]);

  useEffect(refresh, [page]);

  return {
    list,
    page,
    total,
    loading,
    setPage,
    refresh,
  };
}
