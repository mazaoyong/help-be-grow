import React, { useEffect, useState, useCallback, useContext } from 'react';
import { BlockHeader, BlockLoading, Grid, Notify } from 'zent';
import formatDate from '@youzan/utils/date/formatDate';
import VideoReviewPanel from '../video-review-panel';
import { CampusContext } from 'components/campus-filter/campus-provider';
import { ILiveVideoSurveyDTO, ILiveVideoSurvey, ILiveVideoRecord } from './types';
import * as Api from '../../../api';

import style from './style.m.scss';

const pageSize = 20;

const columns: any[] = [
  {
    title: '直播名称',
    name: 'name',
  },
  {
    title: '观看ip数',
    name: 'watchIpCount',
  },
  {
    title: '观看时长(分钟)',
    name: 'watchDuration',
  },
  {
    title: '观看次数',
    name: 'watchCount',
  },
  {
    title: '人均观看时长(分钟)',
    name: 'perWatchTime',
  },
  {
    title: '人均观看次数',
    name: 'perWatchCount',
    textAlign: 'right',
  },
];

const VideoRecord: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [survey, setSurvey] = useState<ILiveVideoSurvey>({
    perWatchTime: '0',
    watchIpCount: 0,
    watchDuration: 0,
    updateTime: '',
    status: 1,
    surplusWatchTime: 0,
  });
  const [detail, setDetail] = useState<ILiveVideoRecord>({
    content: [],
    total: 0,
  });

  const { targetKdtId } = useContext(CampusContext);

  const fetchData = useCallback(
    (pageNumber: number, refresh?: boolean) => {
      const request = refresh ? Api.getRefreshSurvey : Api.getLiveVideoSurvey;
      setLoading(true);
      return request({ pageNumber, pageSize, targetKdtId })
        .then((data: Required<ILiveVideoSurveyDTO>) => {
          const { liveVideoRecordList, ...survey } = data;
          setLoading(false);
          setSurvey(survey);
          setDetail({
            content: liveVideoRecordList.content,
            total: liveVideoRecordList.total,
          });
        })
        .catch(() => Notify.error('数据量较多，请耐心等待一会，刷新浏览器重试', 1500))
        .finally(() => setLoading(false));
    },
    [targetKdtId],
  );

  // 切换校区刷新数据
  useEffect(() => {
    fetchData(1, false);
  }, [fetchData]);

  // 刷新源数据
  const handleRefresh = useCallback(() => {
    fetchData(1, true);
  }, [fetchData]);

  const handlePageChange = useCallback(
    ({ current }) => {
      setPageNumber(current);
      fetchData(current);
      window.scrollTo(0, 0);
    },
    [fetchData],
  );

  const updateTime = survey.updateTime
    ? formatDate(new Date(Number(survey.updateTime)), 'YYYY-MM-DD HH:mm:ss')
    : '';

  return (
    <BlockLoading loading={loading}>
      <div className={style.record}>
        <div className="record__head">
          <span>{`数据更新于 ${updateTime}`}</span>
          <a className="record__reload-btn" onClick={handleRefresh}>
            刷新
            <i className="record_reload-icon" />
          </a>
        </div>
        <BlockHeader className="record__title" title="直播概况" />
        <div className="record__review-panel">
          <VideoReviewPanel survey={survey} />
        </div>
        <BlockHeader className="record__title" title="直播明细" />
        <Grid
          columns={columns}
          datasets={detail.content}
          pageInfo={{ total: detail.total, current: pageNumber, pageSize }}
          onChange={handlePageChange}
        />
      </div>
    </BlockLoading>
  );
};

export default VideoRecord;
