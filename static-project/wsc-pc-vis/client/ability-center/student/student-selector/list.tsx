import React, { FC, useState, useCallback, useEffect } from 'react';
// import { EasyList } from '@youzan/ebiz-components';
import { columns } from './list-config';
import { IStudentListProps } from './types';
import { Button, Input } from 'zent';
import { Table, ITablePageInfo } from '@zent/compat';
import { findPageByQueryV2 } from './api';
import './style.scss';
import get from 'lodash/get';

// const { List, Search, InlineFilter } = EasyList;

const EduCourseList: FC<IStudentListProps> = ({ onConfirm, onClose }) => {
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
    const { page, keyword } = state;
    if (!loading) {
      setLoading(true);
    }
    return findPageByQueryV2({
      pageRequest: {
        pageNumber: page,
        pageSize: 5,
      },
      query: {
        keyword: keyword,
        learnStatus: 1
      }
    }).then((resp) => {
      const { content = [], pageable = {}, total = 0 } = resp;
      const { pageNumber = 0, pageSize = 0 } = pageable;
      let list = content.map(item => { item.id = item.student.id; return item; });
      setDataSets(list);
      setPageInfo({
        pageSize,
        total,
        current: pageNumber,
      });
      setLoading(false);
      return {
        dataset: list,
        pageInfo: { page: pageNumber, pageSize, total },
      };
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const onSearch = useCallback((e) => {
    setPageInfo({
      ...pageInfo,
      current: 1
    });
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
      keyword: filter,
    });
  }, [pageInfo.current, filter]);

  return <div>
    <span className='student-dialog__filter'>
      <span>只能选择状态为在读的学员</span>
      <Input width='180px' icon="search" placeholder="学员姓名/联系人手机" onPressEnter={onSearch} />
    </span>
    <Table
      selection={{
        selectedRowKeys: selectItem ? [get(selectItem, 'id')] : [],
        isSingleSelection: true,
        onSelect: onItemSelect,
      }}
      datasets={datasets}
      columns={columns}
      emptyLabel="没有学员信息"
      rowKey="id"
      loading={loading}
      pageInfo={pageInfo}
      onChange={onPageChange}
    />
    <div className='student-dialog__footer'>
      <Button onClick={onClose}>取消</Button>
      <Button type='primary' onClick={() => onConfirm(selectItem)}>确定</Button>
    </div>
  </div>;
};

export default EduCourseList;
