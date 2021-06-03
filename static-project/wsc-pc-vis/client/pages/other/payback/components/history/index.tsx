import React, { Component } from 'react';
import { Actions } from 'zan-shuai';
import formatDate from 'zan-utils/date/formatDate';
import get from 'lodash/get';
import { BlockHeader } from 'zent';
import { Table, ITableColumn } from '@zent/compat';
import { EffectTypes } from '../../effects';
import { ISecuredInfoResult } from '../../definitions';
import './index.scss';

const defaultName = '有赞风控';

const COLUMNS: ITableColumn[] = [
  {
    title: '操作时间',
    name: 'time',
    bodyRender: item => {
      const date = new Date(item.createTime);
      return <div>{`${formatDate(new Date(date), 'YYYY-MM-DD HH:mm:ss')}`}</div>;
    },
  },
  {
    title: '操作人',
    name: 'operator',
    bodyRender: item => {
      return get(item, 'operator.nickName', defaultName) || defaultName;
    },
  },
  {
    title: '操作',
    textAlign: 'left',
    name: 'recordDesc',
  },
];

interface Props {
  title: string;
  emptyLabel: string;
  data: ISecuredInfoResult['records'];
  loading: boolean;
}

interface States {
  current: number;
  pageSize: number;
}

export default class History extends Component<Props, States> {
  private $$ = Actions as EffectTypes;

  public static defaultProps = {
    title: '操作记录',
    emptyLabel: '暂无任何操作记录',
  };

  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      pageSize: 8,
    };
  }

  public render() {
    const {
      title,
      emptyLabel,
      loading,
      data: { content, total, pageable },
    } = this.props;

    const { current } = this.state;

    return (
      <div className="history-wrapper">
        <BlockHeader title={title} />
        <Table
          className="operation-history-table"
          columns={COLUMNS}
          datasets={content}
          rowKey="item_id"
          emptyLabel={emptyLabel}
          onChange={this.onChange}
          loading={loading}
          pageInfo={{
            pageSize: pageable.pageSize,
            current,
            totalItem: total,
          }}
        />
      </div>
    );
  }

  public onChange = conf => {
    this.setState(conf, () => {
      this.$$.fetchInfoData(this.state.current);
    });
  };
}
