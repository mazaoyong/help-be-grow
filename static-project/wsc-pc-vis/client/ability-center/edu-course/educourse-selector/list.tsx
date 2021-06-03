import React, { FC, useState, useCallback, useEffect } from 'react';
// import { EasyList } from '@youzan/ebiz-components';
import { columns } from './list-config';
import { IEduCourseListProps } from './types';
import { Button, Input } from 'zent';
import { Table, ITablePageInfo } from '@zent/compat';
import { getCourseList } from './api';
import './style.scss';
// const { List, Search, InlineFilter } = EasyList;

const EduCourseList: FC<IEduCourseListProps> = ({ onConfirm, kdtId, onClose }) => {
  // const filterRef = useRef(null);
  // const listRef = useRef(null);
  const [ selectItem, setSelectItem ] = useState<any>(null);
  const [datasets, setDataSets] = useState<any[]>([]);
  const [pageInfo, setPageInfo] = useState<ITablePageInfo>({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [filter, setFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback((state) => {
    const { page, educourseName } = state;
    if (!loading) {
      setLoading(true);
    }
    return getCourseList({
      pageNumber: page,
      pageSize: 5,
      name: educourseName || '',
      kdtId,
      isTrial: 0
    }).then((resp) => {
      const { content = [], pageable = {}, total = 0 } = resp;
      const { pageNumber = 0, pageSize = 0 } = pageable;
      setDataSets(content);
      setPageInfo({
        pageSize,
        total,
        current: pageNumber,
      });
      setLoading(false);
      return {
        dataset: content,
        pageInfo: { page: pageNumber, pageSize, total },
      };
    });
  }, [kdtId]);

  const onSearch = useCallback((e) => {
    setFilter(e.target.value);
  }, []);

  const onPageChange = useCallback(({ current }) => {
    setPageInfo({ ...pageInfo, current });
  }, [pageInfo]);

  const onItemSelect = useCallback((_, selectedRows) => {
    setSelectItem(selectedRows[0]);
  }, []);

  useEffect(() => {
    fetchData({
      page: pageInfo.current,
      educourseName: filter,
    });
  }, [pageInfo.current, filter]);

  return <div>
    <span className='educourse-dialog__filter'>
      <span>
        <Button type="primary" onClick={() => window.open(`${_global.url.v4}/vis/edu/page/educourse#/add`)}>新建课程</Button>
        <Button onClick={() => fetchData({
          page: pageInfo.current,
          educourseName: filter,
        })}>刷新</Button>
      </span>
      <Input width='150px' icon="search" placeholder="课程名称" onPressEnter={onSearch} />
    </span>
    <Table
      selection={{
        selectedRowKeys: selectItem ? [selectItem.alias] : [],
        isSingleSelection: true,
        onSelect: onItemSelect,
      }}
      datasets={datasets}
      columns={columns}
      emptyLabel="还没有教务课程"
      loading={loading}
      rowKey="alias"
      pageInfo={pageInfo}
      onChange={onPageChange}
      className="educourse-dialog__table"
    />
    <div className='educourse-dialog__footer'>
      <Button onClick={onClose}>取消</Button>
      <Button type='primary' onClick={() => onConfirm(selectItem)}>确定</Button>
    </div>
  </div>;
};

export default EduCourseList;
