import { Select, Pop } from '@zent/compat';
import React, { useState, useEffect, useMemo, useCallback, FC } from 'react';
import { IGridColumn, Grid, BlockLoading, Notify, Input } from 'zent';
import { Link as SamLink, Button as SamButton } from '@youzan/sam-components';
import { date } from '@youzan/utils';
import { isInStoreCondition, isEduHqStore, isEduBranchStore } from 'fns/chain';
import { IVisListTableColunms } from 'components/vis-list/ultis/type';
import { CustomHolidayData, findHolidayPage } from '../../api/holiday';
import { findListAllCampus } from '../../../../common/api/shop';
import './index.scss';

const { makeDateStr } = date;

interface HolidayListProps {
  // 类型：节假日设置页｜排课选择节假日弹窗
  type: 'setting' | 'select';
  // 点击新建节假日
  onCreate: () => void;
  // 点击编辑节假日，只在setting页需要
  onModify?: (item: CustomHolidayData) => void;
  // 点击删除节假日，只在setting页需要
  onDelete?: (id: number) => void;
  // 选中的节假日id，只在选择节假日弹窗中需要
  selected?: number[];
  // 选择节假日回调
  onSelect?: (selectedRowKeys, selectedrows) => void;
  // 用于外部强制组件更新数据，可以用类似ref的方式获取
  refetcherRef?: React.MutableRefObject<any> | ((ref: () => void) => void);
  // 只查询指定校区+总部节假日
  queryKdtId?: number;
  // 每页展示条数，默认20
  pageSize?: number;
}

export const HolidayList: FC<HolidayListProps> = ({
  type, onCreate, onSelect, onModify, onDelete, selected = [], refetcherRef, queryKdtId, pageSize = 20,
}) => {
  const [holidayData, setHolidayData] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    total: 0,
    current: 1,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState(selected);
  const [campus, setCampus] = useState<{ shopName: string, kdtId: number }[]>([]);
  const [campusQuery, setCampusQuery] = useState(-1);
  const [nameQuery, setNameQuery] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEduHqStore) return;
    findListAllCampus().then(data => {
      setCampus(data);
    }).catch((err) => Notify.error(err));
  }, []);

  const columns = useMemo(() => {
    const cols: IGridColumn<CustomHolidayData>[] & IVisListTableColunms = [
      {
        title: '节假日名称',
        bodyRender: (item) => item.name,
      },
      {
        title: '起止日期',
        bodyRender: (item) => `${makeDateStr(item.startTime)}至${makeDateStr(item.endTime)}`,
      },
    ];

    if (isInStoreCondition({ supportEduChainStore: true })) {
      cols.push({
        title: '来源',
        bodyRender: (item) => item.source,
      });
    }

    if (type === 'setting') {
      cols.push({
        title: '操作',
        bodyRender(item) {
          if (isEduBranchStore && item.kdtId !== _global.kdtId) {
            return <span className="holiday-list-operation-disabled">总部创建，无法修改</span>;
          }

          return <>
            <SamLink
              name="编辑节假日设置"
              onClick={() => onModify!(item)}
              className="holiday-list-operation"
            >
              编辑
            </SamLink>
            <span className="holiday-list-split">|</span>
            <Pop
              trigger="click"
              content="确定删除吗？删除后不影响已排课的日程。"
              onConfirm={() => onDelete!(item.id)}
              confirmText="确定"
              position="top-right"
            >
              <SamLink
                name="编辑节假日设置"
                href="javascript:void(0);"
                className="holiday-list-operation"
              >
                删除
              </SamLink>
            </Pop>
          </>;
        },
      });
    }
    cols[cols.length - 1].textAlign = 'right';
    return cols;
  }, [type, onDelete, onModify]);

  const fetchData = useCallback(async (resetQuery: any = false, resetPage: number | boolean = resetQuery) => {
    const queryConfig = {
      name: nameQuery,
      campus: campusQuery,
    };
    let pageNumber = pageInfo.current;

    if (typeof resetQuery === 'object') {
      Object.assign(queryConfig, resetQuery);
    }

    if (typeof resetPage === 'number') {
      pageNumber = resetPage;
    }

    if (resetQuery === true) {
      setCampusQuery(-1);
      setNameInput('');
      setNameQuery('');
      queryConfig.name = '';
      queryConfig.campus = -1;
    }

    if (resetPage === true) {
      setPageInfo({ ...pageInfo, current: 1 });
      pageNumber = 1;
    }

    setLoading(true);
    const query = {
      name: queryConfig.name,
    } as any;

    if (isEduBranchStore) {
      if (queryConfig.campus === -1) query.campusQueryMode = 0;
      else if (queryConfig.campus === -2) query.campusQueryMode = 1;
      else if (queryConfig.campus === -3) query.campusQueryMode = 2;
    }
    if (isEduHqStore) {
      if (queryConfig.campus === -1) {
        if (queryKdtId) query.kdtId = queryKdtId;
        query.campusQueryMode = 0;
      } else if (queryConfig.campus === -2) {
        query.kdtId = _global.kdtId;
        query.campusQueryMode = 1;
      } else {
        query.kdtId = queryConfig.campus;
        query.campusQueryMode = 2;
      }
    }
    try {
      const data = await findHolidayPage({
        query,
        pageRequest: {
          pageSize,
          sort: {
            orders: [{
              direction: 'DESC',
              property: 'created_at',
            }],
          },
          pageNumber: pageNumber,
        },
      });
      const { content, total, pageable } = data;
      setHolidayData(content || []);
      setPageInfo({
        total,
        current: pageable.pageNumber || 1,
      });
    } catch (err) {
      Notify.error(err);
    }
    setLoading(false);
  }, [campusQuery, nameQuery, pageInfo, queryKdtId, pageSize]);

  useEffect(() => {
    if (refetcherRef) {
      if (typeof refetcherRef === 'function') refetcherRef(fetchData);
      else if (typeof refetcherRef === 'object') refetcherRef.current = fetchData;
    }
  }, [fetchData, refetcherRef]);

  const selection = useMemo(() => type === 'select' ? {
    selectedRowKeys,
    onSelect: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      onSelect!(selectedRowKeys, selectedRows);
    },
  } : undefined, [type, selectedRowKeys, onSelect]);

  const displayCampus = useMemo(() => {
    const result = [{
      shopName: '全部来源',
      kdtId: -1,
    }, {
      shopName: '总部',
      kdtId: -2,
    }].concat(campus);

    if (isEduBranchStore) {
      result.push({
        kdtId: -3,
        shopName: _global.shopName,
      });
    }

    if (queryKdtId) {
      return result.filter(it => it.kdtId === queryKdtId || it.kdtId < 0);
    }

    return result;
  }, [campus, queryKdtId]);

  useEffect(() => {
    fetchData();
  }, []);

  const showCreateWhenEmpty = useMemo(() => {
    if (campusQuery === -1) return true;
    if (isEduHqStore && campusQuery === -2) return true;
    if (isEduBranchStore && campusQuery === -3) return true;
    return false;
  }, [campusQuery]);

  return (
    <BlockLoading loading={loading}>
      <div className="holiday-top">
        <div className="holiday-action">
          {type === 'setting' && <SamButton name="编辑节假日设置" type="primary" onClick={onCreate}>新建节假日</SamButton>}
          {type === 'select' &&
          <SamLink name="编辑节假日设置" href={`${_global.url.v4}/vis/edu/page/settings/holiday`} blank>
            节假日设置
          </SamLink>}
        </div>
        <div className="holiday-filter">
          {isInStoreCondition({ supportEduChainStore: true }) &&
          <Select
            value={campusQuery}
            onChange={e => {
              setCampusQuery(e.target.value);
              fetchData({ campus: e.target.value }, 1);
            }}
            className="holiday-source-select"
            data={displayCampus.map(it => ({ value: it.kdtId, text: it.shopName }))}
            filter={(item, keyword) => item.name.includes(keyword)}
          />}
          <Input
            value={nameInput}
            className="holiday-search"
            name="name"
            placeholder="搜索节假日名称"
            autoComplete="off"
            icon="search"
            onPressEnter={() => {
              setNameQuery(nameInput);
              fetchData({ name: nameInput }, 1);
            }}
            onChange={(e) => setNameInput(e.target.value)}
          />
        </div>
      </div>
      <div className="holiday-list">
        <Grid
          columns={columns}
          emptyLabel={showCreateWhenEmpty ? (
            <span>暂无节假日，<SamLink name="编辑节假日设置" onClick={onCreate}>立即新建</SamLink></span>
          ) : (
            <span>暂无节假日</span>
          )}
          datasets={holidayData}
          selection={selection as any}
          rowKey="id"
          pageInfo={{
            current: pageInfo.current,
            pageSize,
            total: pageInfo.total,
          }}
          onChange={({ current }) => {
            setPageInfo({ ...pageInfo, current: current || 1 });
            fetchData(false, current || 1);
          }}
        />
      </div>
    </BlockLoading>
  );
};
