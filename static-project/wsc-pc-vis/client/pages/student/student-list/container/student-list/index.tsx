import React from 'react';
import { Grid, Notify } from 'zent';
import { format } from 'date-fns';

import Header from './components/list-filter';
import getStudentColumns from './util';
import { ICategoryEnum, LIST_TYPE } from '../../constant';
import { getStudentListStatistic } from '../../../api/student-list';
import { findPageByQueryV2 } from '../../../api';

interface IProps {
  category: ICategoryEnum;
  learnStatus: number;
}

interface IFilter {
  learnStatus: number;
}

interface IPageInfo {
  sortType: 'desc' | 'asc';
  sortBy: string;
  pageSize: number;
  current: number;
}

const StudentList: React.FC<IProps> = ({ category, learnStatus }) => {
  const [statistic, setStatistic] = React.useState({
    total: 0,
    finish: 0,
    study: 0,
    trial: 0,
  });
  const [filter, setFilter] = React.useState<IFilter>({
    learnStatus: Number(learnStatus) || 0,
  });
  const [loading, setLoading] = React.useState(false);
  const [pageInfo, setPageInfo] = React.useState<IPageInfo>({
    sortBy: 'createdAt',
    sortType: 'desc',
    pageSize: 10,
    current: 1,
  });
  const [total, setTotal] = React.useState(0);
  const [studentList, setStudentList] = React.useState([]);

  const getStatistic = React.useCallback(() => {
    getStudentListStatistic(
      Object.assign({}, filter, {
        kdtId: window._global.kdtId,
      }),
    )
      .then((res) => {
        const { allCount = 0, graduateCount = 0, studyCount = 0, trialCount = 0 } = res;
        setStatistic({
          total: allCount,
          finish: graduateCount,
          study: studyCount,
          trial: trialCount,
        });
      })
      .catch(Notify.error);
  }, [filter]);

  const getStudentList = React.useCallback(() => {
    setLoading(true);
    const fetchApi = category ? LIST_TYPE[category].api : findPageByQueryV2;
    const orders = [
      {
        direction: 'DESC',
        property: 'createdAt',
      },
    ];
    if (pageInfo.sortType) {
      orders.unshift({
        direction: pageInfo.sortType.toUpperCase(),
        property: pageInfo.sortBy,
      });
    }
    fetchApi({
      query: filter,
      pageRequest: {
        pageSize: pageInfo.pageSize,
        pageNumber: pageInfo.current,
        sort: {
          orders,
        },
      },
    })
      .then(({ content = [], total = 0 }) => {
        setStudentList(content.map((c, index) => Object.assign({}, c, { id: index })));
        setTotal(total);
      })
      .catch((msg) => {
        Notify.error(msg || '获取列表失败');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category, filter, pageInfo]);

  const onTableChange = React.useCallback((pageInfo) => {
    setPageInfo((prev) => {
      return {
        ...prev,
        ...pageInfo,
        current: pageInfo.current || 1,
      };
    });
  }, []);

  const onSearch = React.useCallback(
    (val = {}) => {
      // 保留上次的状
      const curFilter = Object.assign({}, { learnStatus: filter.learnStatus }, val);

      // 对时间范围进行分离格式化
      const { dateRange = [] } = curFilter;
      if (dateRange.length) {
        dateRange[0] && (curFilter.startDate = format(dateRange[0], 'YYYY-MM-DD 00:00:00'));
        dateRange[1] && (curFilter.endDate = format(dateRange[1], 'YYYY-MM-DD 23:59:59'));
      }
      delete curFilter.dateRange;

      if (curFilter.learnStatus === 'all' || !curFilter.learnStatus) {
        delete curFilter.learnStatus;
      }

      if (curFilter.targetKdtId === 'all' || !curFilter.targetKdtId) {
        delete curFilter.targetKdtId;
      }

      if (!curFilter.hasSubMp) {
        delete curFilter.hasSubMp;
      }
      setFilter(curFilter);
      setPageInfo((prev) => {
        return {
          ...prev,
          current: 1,
        };
      });
    },
    [filter.learnStatus],
  );

  React.useEffect(() => {
    getStudentList();
    getStatistic();
  }, [getStatistic, getStudentList]);

  return (
    <>
      <Header
        statistic={statistic}
        category={category}
        total={total}
        onSearch={onSearch}
        defaultValues={filter}
      />
      <Grid
        columns={getStudentColumns({ category })}
        scroll={{
          x: 1100,
        }}
        datasets={studentList}
        loading={loading}
        onChange={onTableChange}
        sortBy={pageInfo.sortBy}
        sortType={pageInfo.sortType}
        pageInfo={{
          current: pageInfo.current,
          pageSize: pageInfo.pageSize,
          total,
        }}
        ellipsis={true}
      />
    </>
  );
};

export default StudentList;
