import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { Grid } from 'zent';

import './styles.scss';

const pageSize = 5;

export default function PaginationTable({ getColumns, value, loading, ...restProps }) {
  const [ current, setCurrent ] = useState(1);

  const toggleCurrent = useCallback(e => {
    setCurrent(e.current || 1);
  }, []);

  const total = value.length || 0;

  const datasets = useMemo(() => {
    const start = (current - 1) * pageSize;
    const end = current * pageSize;
    return value.slice(start, (end > total) ? total : end);
  }, [current, value, total]);

  useEffect(() => {
    if (total > 0 && datasets.length === 0) {
      setCurrent(1);
    }
  }, [total, datasets.length]);

  if (!loading && total === 0) {
    return null;
  }

  const pageInfo = total > pageSize ? {
    pageSize,
    current,
    total,
  } : null;

  return (
    <Grid
      className="pct-freebie-pagination-table"
      columns={getColumns({ current, toggleCurrent })}
      datasets={datasets}
      pageInfo={pageInfo}
      paginationType="mini"
      onChange={toggleCurrent}
      loading={loading}
      {...restProps}
    />
  );
}
