import React, { FC, useState, useEffect, useCallback } from 'react';
import { Grid, IGridPageInfo, IGridOnChangeConfig } from 'zent';
import { columns } from './columns';
import { findMoments } from './api';

export interface IMomentsParams {
  type: number; // 0：学员详情入口，1：日程详情入口，2：家校圈运营后台
  queryData: any;
  loading: boolean;
  setLoading: (boolean) => void;
  fetchDataRef?: React.MutableRefObject<(pageNumber?: number) => void>;
}

const MomentsGrid: FC<IMomentsParams> = (props) => {
  const { type, queryData, loading, setLoading, fetchDataRef } = props;
  const [datasets, setDatasets] = useState<any[]>([]);
  const [pageInfo, setPageInfo] = useState<IGridPageInfo>({
    current: 1,
    total: 0,
    pageSize: 6,
  });

  const fetchData = useCallback((current: number = 1) => {
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
    }).then(resp => {
      if (resp) {
        setDatasets(resp.content);
        setPageInfo({
          current: current || 1,
          total: resp.total,
          pageSize: 6,
        });
      }
      if (loading) {
        setLoading(false);
      }
    }).catch(err => {
      console.error('err', err);
    });
  }, [queryData, loading, pageInfo.pageSize, setLoading, type]);

  // 由于本组件但fetchData触发方式较特殊，外部先用setPageInfo来触发fetchData
  if (fetchDataRef) {
    fetchDataRef.current = (pageNumber = 1) => setPageInfo({
      current: pageNumber,
      total: 0,
      pageSize: 6,
    });
  }

  useEffect(() => {
    if (loading) {
      fetchData(pageInfo.current || 1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    setLoading(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageInfo.current]);

  const onPageChange: ((conf: IGridOnChangeConfig) => any) | undefined = (conf) => {
    const { current = 1 } = conf;
    setPageInfo({ ...pageInfo, current });
  };

  return <Grid
    emptyLabel="暂无数据"
    loading={loading}
    datasets={datasets}
    columns={columns(type, setLoading, queryData)}
    onChange={onPageChange}
    pageInfo={pageInfo}
    scroll={{ x: 1300 }}
  />;
};

export default MomentsGrid;
