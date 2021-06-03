import { Pop } from '@zent/compat';
import React, { FC, useCallback } from 'react';
import { Icon, Notify } from 'zent';
import { EasyList } from '@youzan/ebiz-components';
import { IFormatData } from '@youzan/ebiz-components/es/types/easy-list';
import get from 'lodash/get';

import { getTuitionOffsetEffectRankListByPage } from '../../../api/stats';
import { participantRankingColumns } from '../../constants';

import './styles.scss';

const PAGE_SIZE = 10;

const { List, EasyGrid } = EasyList;

interface IParticipantRankingProps {
  id: string;
}

const ParticipantRanking: FC<IParticipantRankingProps> = (props) => {
  const { id } = props;

  const fetchData = useCallback((query): Promise<IFormatData> => {
    const { page = 1, pageSize } = query;
    return getTuitionOffsetEffectRankListByPage({
      query: { activityId: id },
      pageRequest: {
        pageNumber: page,
        pageSize,
      },
    })
      .then(res => {
        const { content, pageable, total } = res;
        return {
          dataset: content,
          pageInfo: {
            page: get(pageable, 'pageNumber', 1),
            pageSize: get(pageable, 'pageSize', PAGE_SIZE),
            total,
          }
        };
      })
      .catch(e => {
        throw Notify.error(e || '拉取裂变效果排行数据失败，请稍后重试');
      });
  }, [id]);

  return (
    <div className="tuition-offset-stats__participant-ranking">
      <h1>
        参与人裂变效果排行榜
        <Pop
          trigger="hover"
          position="top-center"
          content="数据统计至前一天"
        >
          <Icon className="tooltip" type="help-circle" />
        </Pop>
      </h1>
      <List mode="none" onSubmit={fetchData} defaultFilter={{ pageSize: PAGE_SIZE }}>
        <EasyGrid
          rowKey="rankNo"
          columns={participantRankingColumns}
          emptyLabel={<span>暂无数据</span>}
        />
      </List>
    </div>
  );
};

export default ParticipantRanking;
