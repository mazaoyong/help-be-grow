import React, { useEffect, useState } from 'react';
import assign from 'lodash/assign';
import { findPageBySoldStatus } from '../../../api/course-manage';
import { SHOP_LIFECYCLE_STATUS } from '../../constants';
import SchoolConfigHeader from '../school-config-header';
import { Table } from '@zent/compat';
import './index.scss';
const defaultColumns = [
  {
    title: '校区',
    name: 'schoolName',
    bodyRender: data => {
      return <span>{data.shopName || ''}</span>;
    },
  },
  {
    title: '地址',
    name: 'address',
    bodyRender: data => {
      return (
        <span>
          {data.address || ''}
        </span>
      );
    },
  },
  {
    title: '校区状态/到期时间',
    name: 'status',
    bodyRender: data => {
      const days = new Date(data.lifecycleEndTime);
      return (
        <>
          <div>
            {SHOP_LIFECYCLE_STATUS[data.lifecycleStatus] || ''}
          </div>
          <div>
            {!!days && `${days.getFullYear()}-${days.getMonth() + 1}-${days.getDate()}` }
          </div>
        </>
      );
    },
  },
];

export default function SchoolList(props) {
  const { index = 0, rowKey, event, id, ...otherProps } = props;
  const [soldStatus, setSoldStatus] = useState(index);
  const [datasets, setDatasets] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    pageSize: 6,
    total: 0,
    current: 1,
  });
  const [loading, setLoading] = useState(false);
  const fetchData = (pageInfo, index) => {
    setLoading(true);
    if (isNaN(index)) {
      index = soldStatus;
    }
    findPageBySoldStatus({
      courseProductQuery: {
        itemId: id,
        status: index,
      },
      pageRequest: {
        pageSize: pageInfo.pageSize,
        pageNumber: pageInfo.current,
      },
    }).then(resp => {
      setLoading(false);
      if (resp && resp.content) {
        setDatasets(resp.content || []);
        setPageInfo({
          pageSize: pageInfo.pageSize,
          total: resp.total,
          current: pageInfo.current,
        });
      }
    }).catch(() => {
      setLoading(false);
    });
  };

  useEffect(
    () => {
      event.on('sellTabChange', onTabChanges);
      fetchData(pageInfo);
      return () => {
        event.off('sellTabChange');
      };
    },
    [],
  );

  const onTabChanges = (index) => {
    const currentPage = assign({}, pageInfo, { current: 1 });
    setSoldStatus(index);
    setPageInfo(currentPage);
    fetchData(currentPage, index);
  };

  const onPageChange = (conf) => {
    const page = assign({}, pageInfo, { current: conf.current });
    setPageInfo(page);
    fetchData(page);
  };
  return <div className='school-selltype-dialog'>
    <SchoolConfigHeader
      {...props}
      isShowConfig={false}
    />
    <Table
      columns={defaultColumns}
      sortBy={'created_at'}
      loading={loading}
      rowKey={rowKey || 'shopName'}
      datasets={datasets}
      onChange = {(conf) => onPageChange(conf) }
      pageInfo={pageInfo}
      {...otherProps}
    />
  </div>;
}
