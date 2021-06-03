import React, { Component } from 'react';
import { Notify, ClampLines } from 'zent';
import { Table } from '@zent/compat';
import { Img } from '@youzan/ebiz-components';
import buildUrl from '@youzan/utils/url/buildUrl';

import { getColumnBaseJson } from '../../api';
const { ImgWrap } = Img;

export default class ColumnTable extends Component {
  state = {
    loading: true,
    datasets: [],
  };

  componentDidMount() {
    this.getColumnBase();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.alias !== this.props.alias) {
      this.getColumnBase();
    }
  }

  // 根据别名查询专栏基本信息;
  getColumnBase() {
    getColumnBaseJson(this.props.alias)
      .then(data => {
        if (!data) {
          Notify.error('关联的专栏已被删除！');
        } else {
          this.setState({
            datasets: [data],
          });
        }
      })
      .catch(msg => {
        Notify.error(msg || '获取专栏失败!');
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  }

  getColumns() {
    return [
      {
        title: '专栏',
        textAlign: 'left',
        width: '70%',
        bodyRender: item => {
          return (
            <div className="goods-name-col">
              <ImgWrap width="60px" height="60px" src={item.cover} alt="goods" />
              <div className="goods-name-col__detail">
                <a
                  className="ellipsis"
                  href={buildUrl(`https://h5.youzan.com/wscvis/knowledge/index?kdt_id=${_global.kdtId}&p=columnshow` +
                  `&alias=${item.alias}&qr=paidcolumn_${item.alias}`, '', _global.kdtId)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ClampLines lines={1} text={item.title} />
                </a>
                <div className="goods-name-col__rest">
                  <span className="goods-name-col__label">知识付费</span>
                  <span>￥{(item.price / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        title: '操作',
        bodyRender: item => {
          return (
            <span
              className={this.props.disabled ? 'gray' : 'cursor-link'}
              onClick={() => {
                this.props.onDelete();
              }}
            >
              删除
            </span>
          );
        },
      },
    ];
  }

  render() {
    const { datasets, loading } = this.state;

    return (
      <Table
        className="column__list-table"
        columns={this.getColumns()}
        datasets={datasets}
        emptyLabel="关联的专栏已被删除"
        loading={loading}
      />
    );
  }
}
