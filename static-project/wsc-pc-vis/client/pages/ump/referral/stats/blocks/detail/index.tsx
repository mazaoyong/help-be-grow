import React, { FC, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Button, Notify } from 'zent';
import { omit } from 'lodash';
import { format } from 'date-fns';
import { EasyList } from '@youzan/ebiz-components';
import { IFormatData, IRenderPropsType } from '@youzan/ebiz-components/es/types/easy-list';
import { isEduHqStore } from '@youzan/utils-shop';
import { findListAllCampus } from 'common/api/shop';

import { findDetailDataByPage, exportReferralRewardData } from '../../../api/stats';
import { detailFilterConfig, detailColumns } from '../../constants';
import { DateFormat } from '../../../constants';
import { getExportRecordUrl, EXPORT_RECORD_TYPES } from '@ability-center/ump/export-record';

import './styles.scss';

interface IDetailProps {
  id: string;
}

const exportListUrl = getExportRecordUrl({ type: EXPORT_RECORD_TYPES.REFERRAL_DETAIL });

const { List, Filter, EasyGrid } = EasyList;

const Statistics: FC<IDetailProps> = (props) => {
  const { id } = props;
  const [campusList, setCampusList] = useState<any[]>([]);

  const filterConfig = useMemo(() => {
    return detailFilterConfig(campusList);
  }, [campusList]);

  useEffect(() => {
    if (isEduHqStore) {
      filterCampusList();
    }
  }, []);

  const filterCampusList = async () => {
    const data = await findListAllCampus({});
    let _campusList = [{ value: 0, text: '全部' }];
    if (data.length === 0) {
      _campusList = [{ value: -1, text: '暂无校区' }];
    }
    _campusList = _campusList.concat(
      data.map((campus) => {
        // 生成符合select组件的数据格式
        const obj: any = {};
        obj.value = campus.kdtId;
        obj.text = campus.shopName;
        return obj;
      }),
    );
    setCampusList(_campusList);
  };

  const [filterHasChanged, toggleFilterHasChanged] = useState(false);

  const filterRef = useRef<IRenderPropsType | null>(null);

  const handleExport = useCallback(() => {
    const filterValue = filterRef.current && filterRef.current.getCurrentValues();
    if (!filterValue) return;
    const { timeRange, ...query } = filterValue;
    const params: any = {
      activityId: id,
      ...query,
    };

    if (timeRange && timeRange.length > 0) {
      params.rewardTimeStart = timeRange[0][0];
      params.rewardTimeEnd = timeRange[0][1];
      if (!params.rewardTimeStart || !params.rewardTimeEnd) {
        Notify.error(
          !params.rewardTimeStart ? '奖励发放开始时间不能为空' : '奖励发放结束时间不能为空',
        );
        return;
      }
      params.rewardTimeStart = format(params.rewardTimeStart, DateFormat);
      params.rewardTimeEnd = format(params.rewardTimeEnd, DateFormat);
    } else {
      Notify.error('请选择奖励发放起始时间');
      return;
    }

    for (let key of Object.keys(params)) {
      if (params[key] == null || params[key] === '') {
        delete params[key];
      }
    }

    exportReferralRewardData({
      params,
    })
      .then(() => {
        Notify.success('申请导出数据成功');
        window.open(exportListUrl);
      })
      .catch((e) => {
        Notify.error(e || '导出数据失败，请稍后重试');
      });
  }, [id]);

  const filterActions = useMemo(
    () => ({
      beforeReset: [
        <Button key="stats-detail-export" onClick={handleExport}>
          导出
        </Button>,
        <Button
          key="stats-detail-export-redirect"
          bordered={false}
          outline={true}
          className="link-btn"
          type="primary"
          onClick={() => window.open(exportListUrl)}
        >
          查看已导出列表
        </Button>,
      ],
    }),
    [handleExport],
  );

  const fetchData = useCallback(
    (query): Promise<IFormatData> => {
      const filterValue = filterRef.current && filterRef.current.getCurrentValues();
      const { ...filterQuery } = filterValue || {};
      const { timeRange } = filterQuery;
      const params: any = {
        activityId: id,
        ...omit(filterQuery, 'timeRange'),
      };

      const { page = 1, pageSize } = query;

      toggleFilterHasChanged(
        Object.values(filterValue || {}).filter((item) =>
          Array.isArray(item) ? item.length : item,
        ).length > 0,
      );

      if (timeRange && timeRange.length > 0) {
        params.rewardTimeStart = timeRange[0][0];
        params.rewardTimeEnd = timeRange[0][1];
        if (params.rewardTimeStart) {
          params.rewardTimeStart = format(params.rewardTimeStart, DateFormat);
        }
        if (params.rewardTimeEnd) {
          params.rewardTimeEnd = format(params.rewardTimeEnd, DateFormat);
        }
      }

      for (let key of Object.keys(params)) {
        if (params[key] == null || params[key] === '') {
          delete params[key];
        }
      }

      return findDetailDataByPage({
        page,
        pageSize,
        params,
      })
        .then((res) => {
          const { total, content } = res;
          return {
            dataset: content,
            pageInfo: {
              total,
              page,
            },
          };
        })
        .catch((e) => {
          throw Notify.error(e || '获取被推荐人数据失败，请稍后重试');
        });
    },
    [id],
  );

  return (
    <div className="referral-stats__detail">
      <h1>被推荐人数据</h1>
      <List mode="none" onSubmit={fetchData}>
        <Filter ref={filterRef} config={filterConfig} actionsOption={filterActions} />
        <EasyGrid
          ellipsis
          rowKey="orderNo"
          columns={detailColumns}
          emptyLabel={filterHasChanged ? '' : <p>暂无数据</p>}
        />
      </List>
    </div>
  );
};

export default Statistics;
