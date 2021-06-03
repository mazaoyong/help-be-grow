import { Select } from '@zent/compat';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GoodsSelector as GoodsSelectorDialog } from '@youzan/react-components';
import { getGoodsList, getGroupList } from '../../api';
import get from 'lodash/get';
import { Notify } from 'zent';
import { GOODS_TYPES, GOODS_TYPE_MAP } from './constants';
const { getColumns } = GoodsSelectorDialog;

export default class GoodsSelector extends Component {
  static propTypes = {
    selected: PropTypes.array,
    onChange: PropTypes.func,
    singleMode: PropTypes.bool,
  };

  initialState = {
    groupData: [],
    currentGroup: '',
    currentType: 'all',
    currentChannel: 'online',
  };

  state = Object.assign({}, this.initialState);

  handleChange = selected => {
    this.setState(Object.assign({}, this.initialState));
    this.props.onChange(selected);
  };

  // 获取分组列表
  fetchGroups = (channel, { page, pageSize }, { keyword, type }) => {
    const { currentType } = this.state;
    type = type || currentType;
    return getGroupList({
      channel,
      type,
      keyword,
      page,
      pageSize,
    })
      .then(res => {
        let { items } = res;
        let currentGroup = '';
        // 知识付费不显示全部分组
        if (type !== GOODS_TYPE_MAP.knowledge) {
          items = [...items, { groupId: 'all', title: '全部分组' }];
          currentGroup = 'all';
        }
        this.setState({
          groupData: items,
          currentGroup: currentGroup || get(items, '[0].groupId', ''),
        });
        return res;
      })
      .catch(err => {
        Notify.error(err);
      });
  };

  // 获取商品列表
  fetchGoods = (channel, { page, pageSize }, { keyword, type, group }) => {
    let { currentChannel, currentGroup } = this.state;
    // channel 变化强制刷新过滤器
    if (channel !== currentChannel) {
      type = 'all';
      currentGroup = '';
      this.setState(Object.assign(this.initialState, { currentChannel: channel }), () =>
        this.fetchGroups(channel, { page: 1, pageSize: 20 }, { keyword: '', type: 'all' }),
      );
    }
    return getGoodsList({
      channel,
      type,
      group: currentGroup,
      keyword,
      page,
      pageSize,
    })
      .then(res => {
        return {
          items: res ? res.items : [],
          count: get(res, 'paginator.totalCount', 100),
        };
      })
      .catch(err => {
        Notify.error(err);
      });
  };

  getTableColumns = () => {
    let colomns = getColumns.getGoodsCols();
    colomns = colomns.slice(0, -2);
    return colomns;
  };

  renderFilters = onChange => {
    const { groupData, currentGroup, currentChannel, currentType } = this.state;
    return [
      <Select
        key="type"
        data={GOODS_TYPES}
        value={currentType}
        optionValue="value"
        optionText="label"
        emptyText="全部"
        onChange={e => {
          const type = e.target.value;
          this.setState({ currentType: type, currentGroup: 'all' }, () => onChange('type', type));
          this.fetchGroups(currentChannel, { page: 1, pageSize: 20 }, { keyword: '', type });
        }}
      />,
      <Select
        key="group"
        data={groupData}
        optionValue="groupId"
        optionText="title"
        value={currentGroup}
        emptyText="当前没有分组"
        onAsyncFilter={keyword =>
          this.fetchGroups(currentChannel, { page: 1, pageSize: 20 }, { keyword })
        }
        onChange={e => {
          const group = e.target.value;
          this.setState({ currentGroup: group }, () => onChange('group', group));
        }}
      />,
    ];
  };

  render() {
    const { singleMode, selected } = this.props;
    return singleMode ? (
      <GoodsSelectorDialog
        onOk={this.handleChange}
        mode="single"
        btnTxt="添加商品"
        dialogTitle="选择商品"
        dialogClassName="pctGoodsSelector"
        selected={selected}
        customize={{
          fetchGoods: this.fetchGoods,
          fetchGroups: this.fetchGroups,
          goodsList: {
            filters: this.renderFilters,
            columns: this.getTableColumns(),
          },
        }}
        channels={['online', 'distribution']}
      />
    ) : (
      <GoodsSelectorDialog
        onOk={this.handleChange}
        btnTxt="添加商品"
        dialogTitle="选择商品"
        dialogClassName="pct-goods-selector"
        selected={selected}
        customize={{
          fetchGoods: this.fetchGoods,
          fetchGroups: this.fetchGroups,
          goodsList: {
            filters: this.renderFilters,
            columns: this.getTableColumns(),
          },
        }}
        channels={['online', 'distribution']}
      />
    );
  }
}
