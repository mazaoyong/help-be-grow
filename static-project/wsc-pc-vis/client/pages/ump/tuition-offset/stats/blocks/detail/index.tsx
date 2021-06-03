import React from 'react';
import { Pop } from '@zent/compat';
import { Notify, Icon } from 'zent';
import { EasyList } from '@youzan/ebiz-components';
import { IFormatData } from '@youzan/ebiz-components/es/types/easy-list';
import date from '@youzan/utils/date';
import { get, omit, omitBy, isNil } from 'lodash';
import { EXPORT_RECORD_TYPES } from '@ability-center/ump/export-record';
import ExportActions from 'components/export-actions';
import type { IListProps } from '@youzan/ebiz-components/es/types/easy-list/types/list';

import { getTuitionOffsetParticipantByPage, exportRewardList } from '../../../api/stats';
import { getTuitionOffsetDetailById } from '../../../api/edit';
import { detailFilterConfig, getDetailColumns, curDateTime } from '../../constants';
import { parseJoinTime } from '../../utils';

import './styles.scss';

interface IDetailProps {
  id: string;
}

const PAGE_SIZE = 20;

const { List, Filter, EasyGrid } = EasyList;

const { compare, parseDate } = date;

const Statistics: React.FC<IDetailProps> = props => {
  const { id } = props;
  const [filterHasChanged, toggleFilterHasChanged] = React.useState(false);
  const [enableInfoCollect, setEnableInfoCollect] = React.useState(false);

  const handlePredicate = React.useCallback(filter => {
    const filterValue = filter && filter.getCurrentValues();
    const joinTime: string | string[] = get(filterValue, 'joinTime', '');
    // zent的DatePicker默认值为""，如果选了值就是array
    if (!joinTime) {
      Notify.error('请选择活动参与时间');
      return false;
    }
    if (typeof filterValue !== 'string' && joinTime.length === 2) {
      const [joinTimeStart = '', joinTimeEnd = ''] = joinTime;
      if (!joinTimeStart && !joinTimeEnd) {
        Notify.error('请选择活动参与时间');
        return false;
      }
      if (!joinTimeStart || !joinTimeEnd) {
        Notify.error('活动参与时间需填写完整');
        return false;
      }
      const within3Months = compare(
        [parseDate(joinTimeStart, 'YYYY-MM-DD'), parseDate(joinTimeEnd, 'YYYY-MM-DD')],
        3,
        'month',
      );
      if (!within3Months) {
        Notify.error('导出数据不能超过3个月');
        return false;
      }
      return true;
    }
    Notify.error('网络错误');
    return false;
  }, []);

  const handleExport = React.useCallback(
    filter => {
      const filterValue = filter && filter.getCurrentValues();
      const joinTime: string | string[] = get(filterValue, 'joinTime', '');
      const parsedJoinTime = parseJoinTime(joinTime);
      return exportRewardList({
        query: omitBy(
          {
            activityId: id,
            ...omit(filterValue, 'joinTime'),
            ...parsedJoinTime,
          },
          val => isNil(val) || val === '' || val === 'ALL_ORDER_TYPE',
        ),
      });
    },
    [id],
  );

  const fetchData = React.useCallback<IListProps['onSubmit']>(
    (query): Promise<IFormatData> => {
      const { page = 1, pageSize, ...filterValue } = query;
      const joinTime = parseJoinTime(get(filterValue, 'joinTime', ''));

      toggleFilterHasChanged(Object.values(filterValue || {}).filter(item => item).length > 0);

      return getTuitionOffsetParticipantByPage({
        query: omitBy(
          {
            activityId: id,
            ...omit(filterValue, 'joinTime'),
            ...joinTime,
          },
          val => isNil(val) || val === '' || val === 'ALL_ORDER_TYPE',
        ),
        pageRequest: {
          pageNumber: page,
          pageSize,
        },
      })
        .then(res => {
          const { content, pageable, total } = res;
          const page = pageable?.pageNumber || 1;
          const pageSize = pageable?.pageSize || PAGE_SIZE;
          return {
            dataset: content.map((item, index) =>
              Object.assign(
                {
                  rowId: (page - 1) * pageSize + index,
                },
                item,
              ),
            ),
            pageInfo: {
              page,
              total,
              pageSize,
            },
          };
        })
        .catch(e => {
          throw Notify.error(e || '获取参与人明细失败，请稍后重试');
        });
    },
    [id],
  );

  const handleRenderExport = React.useCallback(
    filter => (
      <ExportActions
        samName="信息采集导出"
        filter={filter}
        withAgreementConfirm
        predicate={handlePredicate}
        onExport={handleExport}
        type={EXPORT_RECORD_TYPES.TUITION_OFFSET}
      />
    ),
    [handleExport, handlePredicate],
  );

  const memoColumns = React.useMemo(() => getDetailColumns({ enableInfoCollect }), [
    enableInfoCollect,
  ]);

  React.useEffect(() => {
    getTuitionOffsetDetailById({ id }).then(res => {
      if (res.needCollectInfo) {
        setEnableInfoCollect(true);
      }
    });
  }, [id]);

  return (
    <div className="tuition-offset-stats__detail">
      <h1>
        参与人明细
        <Pop trigger="hover" position="top-center" content={`数据统计至${curDateTime}`}>
          <Icon className="tooltip" type="help-circle" />
        </Pop>
      </h1>
      <List mode="none" onSubmit={fetchData}>
        <Filter config={detailFilterConfig} actionsOption={{ beforeReset: handleRenderExport }} />
        <EasyGrid
          rowKey="rowId"
          columns={memoColumns}
          emptyLabel={filterHasChanged ? '' : <p>暂无数据</p>}
        />
      </List>
    </div>
  );
};

export default Statistics;
