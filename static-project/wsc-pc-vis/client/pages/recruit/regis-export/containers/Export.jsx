import React, { Component } from 'react';
import { withRouter } from 'react-router';
import cx from 'classnames';
import { BlockLoading, Notify } from 'zent';
import format from 'date-fns/format';
import throttle from 'lodash/throttle';
import * as api from '../api';

// 导出记录头部字段
const headFieldList = [
  {
    label: '报表申请时间',
    key: 'createdAt',
  },
  {
    label: '申请人',
    key: 'operatorName',
  },
];

// 导出记录详细字段
const bodyFieldList = [
  {
    label: '学员姓名',
    key: 'stuName',
  },
  {
    label: '手机号码',
    key: 'stuTel',
  },
  {
    label: '预约状态',
    key: 'apptStatus',
  },
  {
    label: '来源',
    key: 'featureTitle',
  },
  {
    label: '报表时间',
    key: 'createAt',
  },
];

/**
 * 报名记录导出列表页
 */
class Export extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [], // 导出列表数据
      loading: {
        list: false,
      },
      pageable: {
        pageNumber: 1,
        pageSize: 40,
      },
    };
    this.fetchable = true; // 是否可以获取数据
  }

  componentDidMount() {
    window.addEventListener('scroll', this.scrollHanlder, false);
    this.fetchData();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollHanlder, false);
  }

  render() {
    const { list, loading } = this.state;

    return (
      <div className="regis-export">
        <BlockLoading loading={loading.list}>
          {(list.length < 1 && !loading.list)
            ? <p className="export__text">暂无数据</p>
            : (
              <>
                <ul className="export__list">
                  {list.map(item => {
                    const { exptFilterCond = {}, createdAt, operatorMobile, operatorName } = item;
                    return (
                      <li className="export__item" key={`${createdAt}${operatorMobile}${operatorName}`}>
                        <div className="hd">
                          {headFieldList.map(({ label, key }) => {
                            return (
                              <dl key={key}>
                                <dt>{label}：</dt>
                                {key === 'createdAt' && <dd>{format(item[key], 'YYYY-MM-DD HH:mm:ss')}</dd>}
                                {key === 'operatorName' && <dd>{`${item['operatorName']} ${item['operatorMobile']}`}</dd>}
                              </dl>
                            );
                          })}
                          {this.downloadBlock(item)}
                        </div>
                        <div className="bd">
                          {bodyFieldList.map(bodyFieldItem => {
                            return (
                              <dl
                                className={cx({
                                  'bd__createAt': bodyFieldItem.key === 'createAt',
                                })}
                                key={bodyFieldItem.key}
                              >
                                <dt>{bodyFieldItem.label}：</dt>
                                <dd>{this.getBodyFieldItemValueStr(bodyFieldItem, exptFilterCond)}</dd>
                              </dl>
                            );
                          })}
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {!loading.list &&
                  <p className="export__text">已经加载完毕</p>
                }
              </>
            )
          }
        </BlockLoading>
      </div>
    );
  }

  /**
   * 滚动加载
   */
  scrollHanlder = throttle(() => {
    if (this.fetchable) {
      const offsetY = document.body.getBoundingClientRect().height - window.scrollY - window.innerHeight;
      if (offsetY < 2000 && !this.state.loading.list) {
        this.fetchData();
      }
    }
  }, 100)

  /**
   * 字段值展示
   */
  getBodyFieldItemValueStr = (bodyFieldItem, exptFilterCond) => {
    const { key } = bodyFieldItem;
    exptFilterCond = exptFilterCond || {};
    const formatDate = (timestamp) => format(timestamp, 'YYYY-MM-DD HH:mm:ss');
    let str = exptFilterCond[bodyFieldItem.key];
    if (key === 'createAt') {
      str = exptFilterCond.beginAt && exptFilterCond.endAt
        ? `${formatDate(exptFilterCond.beginAt)} 至 ${formatDate(exptFilterCond.endAt)}`
        : exptFilterCond.beginAt
          ? formatDate(exptFilterCond.beginAt) + ' 之后'
          : exptFilterCond.endAt
            ? formatDate(exptFilterCond.endAt) + ' 之前'
            : '-';
    }
    if (key === 'apptStatus') {
      str = exptFilterCond.apptStatus === 1
        ? '已预约'
        : exptFilterCond.apptStatus === 2
          ? '未预约'
          : '全部';
    }
    return str || '-';
  }

  /**
   * 渲染下载按钮
   */
  downloadBlock = (item) => {
    const { status, fileUrl, exptFilterCond } = item;
    let block = (<span className={cx(['export__btn'])}>未知状态</span>);
    if (status === 0) {
      block = (
        <span className={cx(['export__btn', `export__btn--${status}`])}>已过期，
          <span className="export__exportAgain" onClick={() => this.exportRecord(exptFilterCond)}>重新生成</span>
        </span>
      );
    }
    if (status === 1) {
      block = (
        <span className={cx(['export__btn', `export__btn--${status}`])}>
          正在生成报表，请耐心等待...
        </span>
      );
    }
    if (status === 2) {
      block = (
        <a className={cx(['export__btn', `export__btn--${status}`])} href={fileUrl} target="_blank" rel="noopener noreferrer">
          下载报表
        </a>
      );
    }
    return block;
  }

  /**
   * 修改加载状态
   */
  onChangeLoading = (type, bool) => {
    this.setState({
      loading: {
        ...this.state.loading,
        [type]: bool,
      },
    });
  }

  fetchData = () => {
    this.onChangeLoading('list', true);

    const { pageable } = this.state;
    const { pageSize, pageNumber } = pageable;
    return api.findPageExportedReportForm({ pageSize, pageNumber })
      .then(res => {
        const { content = [] } = res || {};
        this.setState({
          list: this.state.list.concat(content),
          pageable: {
            pageSize,
            pageNumber: pageNumber + 1,
          },
        });

        if (content.length < pageSize) {
          this.fetchable = false;
        }
      })
      .catch(err => {
        Notify.error(err);
      })
      .finally(() => {
        this.onChangeLoading('list', false);
      });
  }

  /**
   * 点击重新生成报表
   */
  exportRecord = (exptFilterCond) => {
    const { _global } = window;
    const { userInfo = {} } = _global;
    api.createExportRecord({
      ...exptFilterCond,
      operatorMobile: userInfo.mobile,
      operatorName: userInfo.nickName,
    })
      .then(res => {
        Notify.success('正在重新生成报表，请耐心等待...');
        this.fetchData();
        if ('scrollBehavior' in document.documentElement.style) {
          window.scrollTo(0, 0);
        }
      })
      .catch(err => {
        Notify.error(err);
      });
  }
}

export default withRouter(
  Export
);
