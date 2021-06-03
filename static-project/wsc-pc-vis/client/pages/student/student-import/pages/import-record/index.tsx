import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { withRouter, WithRouterProps } from 'react-router';
import { Grid, IGridColumn, Notify } from 'zent';
import { get } from 'lodash';

import { findRowsDesensitizeByPage } from '../../api/confirm';
import { IStudentInfoGrid } from '../../types';
import './styles.scss';
import useColumns from '../../hooks/use-columns';
import getGridScroll from '../../utils/get-grid-scroll';
import { IMPORT_TYPE } from '../../constants';

function lastElementFixed(columns: IGridColumn[]): IGridColumn[] {
  if (columns.length < 2) {
    return columns;
  }
  const len = columns.length;
  return columns.map((item, idx) => {
    if (idx === len - 1) {
      return { ...item, fixed: 'right' };
    }
    return item;
  });
}

const ImportRecord: FC<WithRouterProps> = props => {
  const { id } = props.params;

  const [current, setCurrent] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [dataset, setDataset] = useState<IStudentInfoGrid[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const importType = Number(get(props.location, 'query.type')) || IMPORT_TYPE.byCourse;

  const branchKdtId = Number(get(props.location, 'query.kdtId', _global.kdtId));

  const { columns } = useColumns({ importType, branchKdtId });

  const gridColumns = useMemo(() => {
    if (importType !== IMPORT_TYPE.byStudentInfo) return columns;
    return lastElementFixed(columns);
  }, [importType, columns]);

  useEffect(() => {
    const { params, location } = props;

    if (!(params && params.id) || !location) return;

    setLoading(true);
    findRowsDesensitizeByPage({
      query: {
        taskId: Number(params.id),
        rowStates: [30],
        importType,
      },
      pageRequest: {
        pageNumber: current,
        pageSize: 10,
        sort: {
          orders: [
            {
              direction: 'DESC',
              property: 'created_at',
            },
          ],
        },
      },
    })
      .then(res => {
        const { content, total } = res;

        setDataset(content || []);
        setTotal(total || 0);
      })
      .catch(e => {
        Notify.error(e || '网络错误，请稍后重试');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, props, current, importType]);

  const onGridChange = useCallback(pageable => {
    const { current = 1 } = pageable;
    setCurrent(current);
  }, []);

  return (
    <div className="import-record">
      <Grid
        columns={gridColumns}
        datasets={dataset}
        pageInfo={{
          current: current,
          pageSize: 10,
          total,
        }}
        onChange={onGridChange}
        loading={loading}
        scroll={getGridScroll(importType, columns.length)}
      />
    </div>
  );
};

export default withRouter(ImportRecord);
