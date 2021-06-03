import React, { FC, useState, useEffect, useMemo, useCallback } from 'react';
import { Grid, GridSortType, IGridColumn, Notify, Button } from 'zent';
import { Select, EasyList } from '@youzan/ebiz-components';
import { IOption, IPageRequest } from '@youzan/ebiz-components/es/types/select';
import toSnakeCase from '@youzan/utils/string/toSnakeCase';
import fullfillImage from '@youzan/utils/fullfillImage';
import { getParticipantList, getCustomerList } from '../../api';
import { hashHistory } from 'react-router';
import { IViewCellData, ITableProps } from '../../types';
import { optionTextGen } from '../../utils';
import throttle from 'lodash/throttle';
import './styles.scss';

const { Filter } = EasyList;

// select下拉读取店铺客户信息
const fetchOptions = throttle((keyword, pageRequest): Promise<{ options: IOption[]; pageInfo: IPageRequest; }> => {
  return getCustomerList({
    pageRequest: {
      pageNumber: pageRequest.current || 1,
      pageSize: pageRequest.pageSize || 20,
    },
    query: {
      keyword,
      kdtId: _global.kdtId, // 暂不支持校区选择
    },
  })
    .then(data => {
      const { content = [], pageable, total } = data;
      const options = content.map(customer => {
        const text = optionTextGen({ name: customer.name, nickName: customer.nickName, mobile: customer.mobile });
        return {
          text: text,
          value: customer.userId,
        };
      }).filter(customer => customer.text && !(/^(.*?)(匿名用户)$/).test(customer.text));
      return {
        options,
        pageInfo: {
          current: pageable.pageNumber || 1,
          total: total || 0,
        },
      };
    });
}, 200);

const columns: IGridColumn[] = [
  {
    title: '客户',
    bodyRender: (data: IViewCellData) => {
      const { userInfo } = data;
      if (!userInfo) {
        return;
      };
      const { avatar, mobile, nickName, anonymity, userId } = userInfo;

      return (<div className="detailtable-user">
        <img
          className="avatar"
          src={fullfillImage(avatar || 'https://b.yzcdn.cn/public_files/2716f8a2b107145929624c375c68afbe.png', '!60x60.jpg')}
          alt={`${nickName}的头像`}
        />
        <div className="detail">
          {anonymity
            ? <span className="name-anonymous">匿名用户</span>
            : <a
              className="name"
              href={`/v4/scrm/customer/manage#/detail?yzUid=${userId}`}
              target="_blank"
              rel="noopener noreferrer"
            >{nickName}</a>
          }
          <span className="mobile">{mobile}</span>
        </div>
      </div>);
    },
  },
  {
    title: '答对数',
    name: 'correctNum',
    needSort: true,
  },
  {
    title: '错题数',
    name: 'errorNum',
    needSort: true,
  },
  {
    title: '测试时间',
    name: 'examTime',
    needSort: true,
  },
  {
    title: '操作',
    textAlign: 'right',
    bodyRender: (data: IViewCellData) => {
      const { examRecordId = 0 } = data;
      return (<span className="view-answersheet" onClick={() => hashHistory.push(`/sheet/${examRecordId}`)}>查看答卷</span>);
    },
  },
];

const FilterList: FC<ITableProps> = ({ examId }) => {
  const [participant, setParticipant] = useState<IViewCellData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortType, setSortType] = useState<GridSortType>('');
  const [current, setCurrent] = useState<number>(1);
  const [total, setTotal] = useState<number>();
  const [sort, setSort] = useState<object>({});
  const [userIdList, setUserIdList] = useState<number[] | null>(null);

  const pageSize = 20;

  const filterConfig = useMemo<any[]>(() => {
    return [
      {
        name: 'name',
        label: '客户：',
        type: 'Custom',
        renderField: Select,
        inheritProps: {
          className: 'exam-detail-select-customer',
          filter: true,
          width: '260px',
          mode: 'async',
          fetchOnOpened: true,
          fetchOptions,
        },
      },
    ];
  }, []);

  const getParticipants = useCallback((values: Record<string, any>) => {
    setLoading(true);
    setUserIdList(values.name || null);
    getParticipantList({
      examId,
      userIdList: values.name,
      pageRequest: {
        pageNumber: current,
        pageSize,
        sort,
      },
    })
      .then(res => {
        setParticipant(res.content || []);
        setLoading(false);
        setTotal(res.total || 0);
      })
      .catch(err => {
        Notify.error(err || '网络错误');
      });
  }, [examId, current, sort]);

  useEffect(() => {
    getParticipants({ name: userIdList });
  }, [current, sort]);

  const onGridChange = conf => {
    const { sortType, sortBy, current } = conf;
    if (current) {
      setCurrent(current);
    }

    setSortBy(sortBy);
    setSortType(sortType);
    setSort({
      orders: [
        {
          property: sortBy === 'examTime' ? 'exam_start_time' : toSnakeCase(sortBy),
          direction: sortType ? (sortType.toUpperCase() as any) : 'DESC',
        },
      ],
    });
  };

  const bottomActions = ({ filter }) => {
    const { submit, reset } = filter;
    return <>
      <Button type="primary" onClick={submit}>筛选</Button>
      <span className="table-filter-text" onClick={reset}>重置筛选条件</span>
    </>;
  };

  return (
    <div style={{ display: 'block' }}>
      <Filter
        config={filterConfig}
        onSubmit={getParticipants}
        onReset={() => getParticipants({})}
        renderActions={bottomActions}
      />
      <Grid
        columns={columns}
        datasets={participant}
        onChange={onGridChange}
        sortBy={sortBy}
        sortType={sortType}
        loading={loading}
        pageInfo={{
          current,
          pageSize,
          total,
        }}
      />
    </div>
  );
};

export default FilterList;
