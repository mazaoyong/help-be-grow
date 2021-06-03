// 已购课程
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Notify } from 'zent';
import { Table } from '@zent/compat';
import { number } from '@youzan/utils';
import { isEduChainStore } from '@youzan/utils-shop';
import store from '../../store';
import { findPageByMobileWithCourseAPI } from '../../../../api';

import { arrayColumnWrapper } from 'fns/chain';
import StudentStatus from './StudentStatus';

const PurchasedList = () => {
  const storeState = store.useStoreState();
  const [loading, setLoading] = useState(true);
  const [datasets, setDatasets] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const findCourse = useCallback(() => {
    findPageByMobileWithCourseAPI({
      query: {
        mobile: storeState.telephone,
        name: storeState.name,
      },
      pageRequest: {
        pageNumber: page,
        countEnabled: true,
        pageSize: 10,
        sort: {
          orders: [{
            property: 'created_at',
            direction: 'DESC',
          }],
        },
      },
    })
      .then((res = {}) => {
        const { content = [], total = 0 } = res;
        setTotal(total);
        setDatasets(content);
      })
      .catch(msg => {
        Notify.error(msg || '获取体验课列表失败');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, storeState.telephone, storeState.name]);

  useEffect(() => findCourse(), [findCourse]);

  const columns = useMemo(() => {
    return arrayColumnWrapper([{
      title: '线下课/课程',
      name: 'course',
      bodyRender: ({ course }) => <div className="ellipsis">{course.title || '-'}</div>,
    }, {
      title: '状态',
      name: 'eduCourseState',
      bodyRender: ({ eduCourseState }) => (
        <StudentStatus type={eduCourseState} />
      ),
    }, {
      title: '上课地点',
      nowrap: true,
      chainState: isEduChainStore,
      bodyRender: ({ courseAttendDTO = {} }) => (courseAttendDTO ? courseAttendDTO.address : '-'),
    }, {
      title: '有效期',
      name: 'eduCourseValidDescription',
      bodyRender: ({ eduCourseValidDescription }) => eduCourseValidDescription || '-',
    }, {
      title: '课时(剩余/总数)',
      name: 'courseTime',
      bodyRender: ({ courseTime = {} }) => {
        if (courseTime) {
          const { total, remaining } = courseTime;
          if (total) {
            return `${number.accDiv(remaining, 100)}/${number.accDiv(total, 100)}`;
          }
        }
        return '-';
      },
    }]);
  }, []);

  return (
    <Table
      columns={columns}
      loading={loading}
      datasets={datasets}
      emptyLabel="没有已购课程"
      pageInfo={{
        pageSize: 10,
        current: page,
        totalItem: total,
      }}
      onChange={({ current }) => setPage(current)}
    />
  );
};

export default PurchasedList;
