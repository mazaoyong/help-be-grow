import React, { Component } from 'react';
import { Notify } from 'zent';
import { Table } from '@zent/compat';
import get from 'lodash/get';
import { date } from '@youzan/utils';
import { EXPORT_RECORD_TYPES } from '../constants';

import { findPageByCondition, getDownLoadUrlById } from '../api';

export default class ExportPage extends Component {
  state = {
    loading: true,
    datasets: [],
    size: 20,
    page: 1,
    total: 0,
  };

  componentDidMount() {
    this.getList(1);
  }

  getList = current => {
    this.setState({ loading: true });

    const req = {
      page: current || this.state.page,
      size: this.state.size,
      type: this.props.params.type,
    };

    findPageByCondition(req)
      .then(({ content = [], pageable = {}, total = 0 }) => {
        const { pageNumber = 1, pageSize = 20 } = pageable;
        this.setState({
          datasets: content,
          page: pageNumber,
          size: pageSize,
          total: total,
        });
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };

  download = (id) => {
    getDownLoadUrlById({ id }).then(res => {
      if (res.fileUrl) {
        window.open(res.fileUrl, '_blank');
      }
    }).catch((msg) => {
      Notify.error(msg || '下载失败');
    });
  }

  getColumns() {
    return [
      {
        title: '申请时间',
        name: 'createdAt',
        bodyRender: item => {
          return <>
            <div>{date.formatDate(item.createdAt, 'YYYY-MM-DD')}</div>
            <div>{date.formatDate(item.createdAt, 'HH:mm:ss')}</div>
          </>;
        },
      },
      {
        title: '导出数据时间段',
        bodyRender: item => {
          const exportParam = get(item, 'exportParam', {});
          const { orderBookStartTime = 0, orderBookEndTime = 0 } = exportParam;
          const createdAt = get(item, 'createdAt', '');
          if (!orderBookStartTime && !orderBookEndTime) {
            /** 我知道这里是一坨 Shit，但是产品有这个需求：
             * @菜菜：算了，还是显示 - 吧，有可能筛选了别的时间段，这里显示全部可能会有歧义，
             *       后面找个机会把导出记录优化下，现在过于简陋了。
             * 如果你看到这段注释的时候，还没有进行优化，请立马提着刀去找她。
             */
            return [
              EXPORT_RECORD_TYPES.CLUE_ALL,
              EXPORT_RECORD_TYPES.CLUE_POOL,
            ].includes(Number(this.props.params.type)) ? '-' : '全部';
          }
          if (orderBookStartTime && orderBookEndTime) {
            return `${date.formatDate(orderBookStartTime, 'YYYY-MM-DD HH:mm:ss')} 至 ${date.formatDate(orderBookEndTime, 'YYYY-MM-DD HH:mm:ss')}`;
          }
          if (orderBookStartTime && !orderBookEndTime) {
            return `${date.formatDate(orderBookStartTime, 'YYYY-MM-DD HH:mm:ss')} 至${createdAt ? ' ' + date.formatDate(createdAt, 'YYYY-MM-DD HH:mm:ss') : '今'}`;
          }
          if (!orderBookStartTime && orderBookEndTime) {
            return `截止到 ${date.formatDate(orderBookEndTime, 'YYYY-MM-DD HH:mm:ss')}`;
          }
          return (orderBookStartTime ? `${date.formatDate(orderBookStartTime, 'YYYY-MM-DD HH:mm:ss ')}` : '-') + '至' + (orderBookEndTime ? `${date.formatDate(
            orderBookEndTime,
            'YYYY-MM-DD HH:mm:ss'
          )}` : '-');
        },
      },
      {
        title: '申请人',
        name: 'operator_name',
        bodyRender: item => {
          return item.operatorName + ' ' + item.operatorMobile;
        },
      },
      {
        title: '操作',
        bodyRender: item => {
          // 导出文件状态
          const status = {
            0: '文件已失效，请重新导出',
            1: '生成中请刷新查看',
            2: '上传完成',
            3: '导出失败',
          };
          const exportParam = get(item, 'exportParam', {});
          const { orderBookStartTime = 0, orderBookEndTime = 0 } = exportParam;
          const startData = orderBookStartTime ? date.formatDate(orderBookStartTime, 'YY-MM-DD') : '';
          const endData = orderBookEndTime ? date.formatDate(orderBookEndTime, 'YY-MM-DD') : '';
          return (
            <div>
              {item.status === 2 && (
                <a onClick={() => this.download(item.id)} download={!startData && !endData ? `订购记录${startData || '-'}至${endData || '-'}` : '全部'}>
                  下载
                </a>
              )}
              {item.status !== 2 && <span className="gray">{status[item.status]}</span>}
            </div>
          );
        },
      },
    ];
  }

  render() {
    const { datasets, loading, page, size, total } = this.state;

    return (
      <Table
        columns={this.getColumns()}
        datasets={datasets}
        loading={loading}
        emptyLabel="还没有导出记录"
        onChange={({ current }) => this.getList(current)}
        pageInfo={{
          limit: size,
          current: page,
          total,
        }}
      />
    );
  }
}
