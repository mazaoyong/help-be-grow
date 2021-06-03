import React, { useState, useMemo, useCallback } from 'react';
import { Button, Grid, ClampLines, Notify, Pagination } from 'zent';
import ajax from 'fns/ajax';
import formatDate from '@youzan/utils/date/formatDate';
import fullfillImage from '@youzan/utils/fullfillImage';
import createDialog from './base';
import Filter from './hotel-filter';
import useList from './use-list';
import style from './index.m.scss';

const dataCache = {};
const hotelListLink = '/v4/industry/hotel/manage';
const hotelCreateLink = '/v4/industry/hotel/manage-detail';
const columns = [
  {
    title: '酒店',
    name: 'name',
    width: '200px',
    bodyRender(data) {
      let { cover: { url = '' } = {} } = data;
      url = fullfillImage(url, '!60x60.png');
      return (
        <div className={style.cell}>
          <img width="60" height="60" src={url} />
          <ClampLines lines={2} popWidth={200} text={data.name} />
        </div>
      );
    },
  },
  {
    title: '地址',
    name: 'address',
    width: '200px',
    bodyRender(data) {
      return (
        <div className={style.cell}>
          <ClampLines lines={2} popWidth={200} text={data.address} />
        </div>
      );
    },
  },
  {
    title: '创建时间',
    name: 'createdAt',
    width: '200px',
    bodyRender(data) {
      return (
        <div className={style.cell}>
          <ClampLines lines={2} popWidth={200} text={data.createdAt} />
        </div>
      );
    },
  },
];

const hotelListDialog = props => {
  const { onConfirm: propsOnConfirm, onCancel, selectedIds } = props;
  const { listData, page, setPage, total, loading, filter, setFilter } = useList({
    history: false,
    getData(params) {
      const { page, name } = params;
      return ajax('/v4/shop/design/hotel/getHotelByPage.json', {
        data: {
          page,
          name,
          pageSize: 5,
        },
      });
    },
    formatData(data) {
      const { totalItems: total, list: listData } = data;
      listData.forEach(one => {
        one.createdAt = formatDate(one.createdAt, 'YYYY-MM-DD HH:mm:ss');
        dataCache[one.id] = one;
      });
      return {
        total,
        listData,
      };
    },
    formatParams(page, filter) {
      const { hotelId, roomTypeId, ...other } = filter;
      return {
        ...other,
        page,
        hotelId: hotelId === 'all' ? null : hotelId,
        roomTypeId: roomTypeId === 'all' ? null : roomTypeId,
      };
    },
    defaultFilter: {
      hotelId: 'all',
      name: '',
      pageSize: 5,
    },
  });
  const [select, setSelect] = useState(selectedIds);
  const { pageSize } = filter;
  const onChange = conf => {
    if (conf.current) {
      setPage(conf.current);
    }
  };
  const selectedContent = useMemo(() => `已选 ${select.length} 个酒店`, [select]);
  const refresh = useCallback(() => {
    setPage(page);
  }, [page, setPage]);
  const onConfirm = useCallback(() => {
    if (select.length > 50) {
      Notify.error('所选酒店已经超过最大上限50个');
      return;
    }
    const data = select.map(one => {
      return dataCache[one];
    });
    propsOnConfirm(data);
  }, [select]);
  return (
    <div className={style.dialog}>
      <div className={style.header}>
        <div>
          <Button target="_blank" href={hotelCreateLink}>
            新建
          </Button>
          <Button target="_blank" href={hotelListLink}>
            酒店管理
          </Button>
          <Button onClick={refresh}>刷新</Button>
        </div>
        <div>
          <Filter filter={filter} setFilter={setFilter} />
        </div>
      </div>
      <div className={style.body}>
        <Grid
          columns={columns}
          datasets={listData}
          loading={loading}
          emptyLabel="暂无搜索结果"
          selection={{
            selectedRowKeys: select,
            onSelect: selectedRowKeys => {
              setSelect(selectedRowKeys);
            },
            getCheckboxProps: data => ({
              disabled: selectedIds.includes(data.id),
            }),
          }}
        />
        <div className={style.gridfooter}>
          <div>{selectedContent}</div>
          <Pagination current={page} pageSize={pageSize} total={total} onChange={onChange} />
        </div>
      </div>
      <div className={style.footer}>
        <Button onClick={onCancel}>取消</Button>
        <Button onClick={onConfirm} type="primary">
          确定
        </Button>
      </div>
    </div>
  );
};

export default createDialog(hotelListDialog);
