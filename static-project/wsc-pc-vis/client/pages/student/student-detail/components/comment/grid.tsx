import React, { FC, useState, useEffect, useCallback } from 'react';
import { Grid, IGridPageInfo, IGridOnChangeConfig } from 'zent';
import { columns } from './columns';
import { findMoments } from './api';

export interface ICommentRecordsParams {
  type: number; // 0：学员详情入口，1：日程详情入口，2：家校圈运营后台
  queryData: {
    userId: string | number;
    userName: string;
    kdtId?: string | number;
    lessonNo?: string;
    shopName?: string;
  };
  updatingSignal?: number;
}

const CommentRecordsGrid: FC<{ onRefresh(): void; } & ICommentRecordsParams> = props => {
  const { type, queryData, updatingSignal, onRefresh } = props;
  const [loading, setLoading] = useState(false);
  const [datasets, setDatasets] = useState<any[]>([]);
  const [pageInfo, setPageInfo] = useState<IGridPageInfo>({
    current: 1,
    total: 0,
    pageSize: 6,
  });

  const fetchData = useCallback(
    (current: number = 1) => {
      let query = {};
      if (!type) {
        query = {
          userId: queryData.userId,
          kdtId: queryData.kdtId,
        };
      } else {
        query = {
          lessonNo: queryData.lessonNo,
          kdtId: queryData.kdtId,
        };
      }
      findMoments({
        pageRequest: {
          pageNumber: current,
          pageSize: pageInfo.pageSize,
        },
        query,
      })
        .then(resp => {
          if (resp) {
            setDatasets(resp.content);
            setPageInfo({
              current: current || 1,
              total: resp.total,
              pageSize: 6,
            });
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    },
    [queryData, pageInfo.pageSize, setLoading, type],
  );

  useEffect(() => {
    setLoading(true);
    fetchData(pageInfo.current || 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageInfo.current]);

  useEffect(() => {
    if (updatingSignal && updatingSignal > 0) {
      setLoading(true);
      fetchData(pageInfo.current || 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatingSignal]);

  const onPageChange: ((conf: IGridOnChangeConfig) => any) | undefined = conf => {
    const { current = 1 } = conf;
    setPageInfo({ ...pageInfo, current });
  };

  return (
    <Grid
      emptyLabel="暂无数据"
      rowKey="postId"
      loading={loading}
      datasets={datasets}
      columns={columns(type, onRefresh, queryData)}
      onChange={onPageChange}
      pageInfo={pageInfo}
      scroll={{ x: 1300 }}
    />
  );
};

export default CommentRecordsGrid;
