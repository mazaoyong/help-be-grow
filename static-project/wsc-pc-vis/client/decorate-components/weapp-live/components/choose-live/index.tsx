import React, { useState, useCallback } from 'react';
import { Dialog, Button, ClampLines, Notify } from 'zent';
import { Table } from '@zent/compat';
import { BlankLink } from '@youzan/react-components';
import fullfillImage from '@youzan/utils/fullfillImage';
import useList from './use-list';
import bem from '../../../utils/bem';
import { Room } from '../../types';
import './style.scss';

interface ContentProps {
  onOk: (selectedRooms: Room[]) => void;
}

const b = bem('decorate-weapp-live-choose-live');

const dialogId = 'decorate-weapp-live-choose-live-dialog';

const pageSize = 5;

const columns = [
  {
    title: '直播间信息',
    name: 'coverImg',
    width: '116px',
    bodyRender: ({ coverImg }) => (
      <img className={b('img')} src={fullfillImage(coverImg, '!100x100.jpg')} alt="直播间封面" />
    ),
  },
  {
    title: '',
    name: 'name',
    width: '206px',
    bodyRender: ({ name }) => <ClampLines text={name} lines={2} />,
  },
  {
    title: '房间号',
    name: 'roomId',
  },
  {
    title: '直播时间',
    name: 'startTime',
    textAlign: 'right',
    bodyRender: ({ startTime, endTime }) => `${startTime} ~ ${endTime}`,
  },
];

const Content: React.FC<ContentProps> = props => {
  const { onOk } = props;
  const [selected, setSelected] = useState<Room[]>([]);
  const { list, page, total, loading, setPage, refresh } = useList();

  const handleTableChange = useCallback(({ current }) => {
    setPage(current);
  }, []);

  const handleSelect = useCallback((_, selectedRows) => {
    setSelected(selectedRows);
  }, []);

  const handleCancel = useCallback(() => {
    Dialog.closeDialog(dialogId);
  }, []);

  const handleOk = useCallback(() => {
    if (!selected.length) {
      Notify.error('请选择直播间');
      return;
    }

    Dialog.closeDialog(dialogId);
    onOk(selected);
  }, [selected]);

  return (
    <div className={b()}>
      <div className={b('header')}>
        <Button type="primary" outline onClick={refresh}>
          刷新
        </Button>
        <span className={b('info')}>
          创建及管理直播间请登录{' '}
          <BlankLink href="https://mp.weixin.qq.com">微信小程序后台</BlankLink> - “直播”
        </span>
      </div>
      <Table
        loading={loading}
        datasets={list}
        // @ts-ignore
        columns={columns}
        rowKey="roomId"
        selection={{
          isSingleSelection: true,
          selectedRowKeys: selected.map(item => item.roomId),
          onSelect: handleSelect,
        }}
        pageInfo={{ current: page, total, pageSize }}
        onChange={handleTableChange}
      />
      <div className={b('footer')}>
        <Button onClick={handleCancel}>取消</Button>
        <Button type="primary" onClick={handleOk}>
          确认
        </Button>
      </div>
    </div>
  );
};

export default (options: ContentProps) => {
  Dialog.openDialog({
    dialogId,
    className: b(),
    style: { minWidth: '672px' },
    title: '直播间列表',
    children: <Content {...options} />,
  });
};
