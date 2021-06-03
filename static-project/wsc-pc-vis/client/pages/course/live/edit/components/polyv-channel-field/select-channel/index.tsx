import React, { useCallback, useState, useEffect } from 'react';
import { Dialog, Button, Grid, RadioGroup, Radio, Notify, IGridColumn } from 'zent';
import createChannel from './create-channel';
import { Scene, FilterCode } from './enums';
import { findPoliyvLives, Channel } from './api';
import style from './index.m.scss';

const { openDialog, closeDialog } = Dialog;

const sceneMap = {
  [Scene.threeScreen]: '三分屏直播',
  [Scene.normal]: '普通直播',
};

const filterMap = {
  [FilterCode.notFilter]: '-',
  [FilterCode.bound]: '已关联其他直播商品，不可选',
  [FilterCode.bigClass]: '暂不支持大班课',
};

const columns: IGridColumn[] = [{
  title: <span className={style['column-name']}>频道名称</span>,
  width: '250px',
  bodyRender: data => <Radio value={data} disabled={Boolean(data.filterCode)}>{data.name}</Radio>,
}, {
  title: '频道号',
  name: 'channelId',
}, {
  title: '直播场景',
  bodyRender: data => sceneMap[data.scene],
}, {
  title: '备注',
  textAlign: 'right',
  bodyRender: data => filterMap[data.filterCode],
}];

function ChannelDialog(props) {
  const { resolve, reject } = props;
  const pageSize = 5;
  const [list, setList] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Channel | null>(null);

  const fetchList = useCallback(() => {
    setLoading(true);
    findPoliyvLives({ pageNumber: page, pageSize })
      .then(res => {
        setLoading(false);
        setList(res.content);
        setTotal(res.total);
      })
      .catch(err => {
        setLoading(false);
        Notify.error(err || '频道信息获取失败，请稍后重试');
      });
  }, [page]);

  const create = useCallback(() => {
    createChannel()
      .then(() => {
        fetchList();
      })
      .catch(() => {});
  }, [fetchList]);

  const handlePageChange = useCallback(({ current }) => {
    setPage(current);
  }, []);

  const handleRadioChange = useCallback(e => {
    setSelected(e.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    if (selected) {
      resolve(selected);
    } else {
      Notify.error('请选择一个直播频道');
    }
  }, [resolve, selected]);

  const handleCancel = useCallback(() => reject(), [reject]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <div className={style['select-channel']}>
      <div className={style['create-wrap']}>
        <Button type="primary" onClick={create}>创建频道</Button>
      </div>
      <RadioGroup className={style['list-wrap']} value={selected} onChange={handleRadioChange}>
        <Grid
          rowKey="channelId"
          columns={columns}
          datasets={list}
          loading={loading}
          pageInfo={{
            total,
            pageSize,
            current: page,
          }}
          onChange={handlePageChange}
          emptyLabel={<p>还没有直播频道，<a onClick={create} href="javascript:;">点击创建</a></p>}
        />
      </RadioGroup>
      <div className={style['submit-wrap']}>
        <Button onClick={handleCancel}>取消</Button>
        <Button type="primary" onClick={handleSubmit}>确定</Button>
      </div>
    </div>
  );
}

// 可以抽离 getOpenDialog 逻辑，当前没时间做了。。。
export default function selectChannel(): Promise<Channel> {
  const dialogId = Date.now().toString();
  return new Promise((resolve, reject) => {
    const res = (args) => {
      closeDialog(dialogId);
      resolve(args);
    };
    const rej = (...args) => {
      closeDialog(dialogId);
      reject(...args);
    };
    openDialog({
      dialogId,
      title: '选择直播频道',
      children: <ChannelDialog resolve={res} reject={rej} />,
      maskClosable: false,
      onClose: () => reject(),
    });
  });
}
