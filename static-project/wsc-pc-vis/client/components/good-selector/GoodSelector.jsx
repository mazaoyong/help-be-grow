import { Select } from '@zent/compat';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { GoodsSelector } from '@youzan/react-components';
import { CHANNELS } from '@youzan/react-components/es/components/goods-selector/constant';
import { Notify, Button } from 'zent';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import findIndex from 'lodash/findIndex';
import cloneDeep from 'lodash/cloneDeep';
import isPlainObject from 'lodash/isPlainObject';

import SkuCell from './sku-cell/SkuCell.jsx';

import { getGoodsList, getGroupList } from './api';
import {
  GOODS_TYPE_MAP,
  GOODS_TYPES,
  GOODS_ONLY_EDU_TYPES,
  PCT_GROUPS_MAP,
  CHANNEL_TYPE_VALUE_MAP,
  SELECTED,
  IGNORE_ITEMS,
} from './constant';
import { addSkuinfo, checkSkuinfo, filterSkuinfo, getMediaType, filterNeededItems } from './utils';

// import '@youzan/goods-selector/lib/index.css';

const { getColumns } = GoodsSelector;

class GoodSelector extends Component {
  static propTypes = {
    isOnlyEdu: PropTypes.bool, // 是否只有知识付费 默认 true
    hasFx: PropTypes.bool, // 是否有分销
    eduDetailGroup: PropTypes.bool, // 是否展示详细的知识付费 groups
    ignoreGroup: PropTypes.object, // 需要不展示的知识商品 group（不同活动对 group 的支持不同）
    activityType: PropTypes.number, // 活动 typeid 可选
    activityId: PropTypes.number, // 当前活动的 id 可选
    hasSku: PropTypes.bool, // 是否需要选择 sku 规格
    singleSkuMode: PropTypes.bool, // 是否支持 sku 多选
    singleMode: PropTypes.bool, // 是否是单选模式
    selected: PropTypes.object, // 已选择的数据
    maxSelectedNum: PropTypes.number, // 选择数据的数量限制
    column: PropTypes.array, // 自定义表格数据
    btnTxt: PropTypes.string, // 按钮文字
    dialogClassName: PropTypes.string, // 弹框样式
    className: PropTypes.string, // 按钮样式
    disabled: PropTypes.bool, // 不可使用商品选择组件
    onChange: PropTypes.func,
    shouldSelect: PropTypes.func, // 不可选行的设置 参照 zent
    shouldSelectSku: PropTypes.func, // 不可选择 sku 的设置 参照 shouldSelect

    channels: PropTypes.array,
    customize: PropTypes.object,
    ext: PropTypes.string, // 教育商品附加字段
    customChannels: PropTypes.array,
  };

  static defaultProps = {
    isOnlyEdu: true,
    hasFx: false,
    eduDetailGroup: false,
    ignoreGroup: IGNORE_ITEMS,
    activityType: 0,
    hasSku: true,
    singleSkuMode: true,
    singleMode: false,
    selected: SELECTED,
    btnTxt: '',
    dialogClassName: '',
    className: '',
    column: [],
    disabled: false,
    activityId: 0,

    channels: [],
    customize: {},
    customChannels: CHANNELS,
  };

  constructor(props) {
    super(props);
    const { isOnlyEdu, isOnlyGroup, selected } = props;

    this.getInitSkuDataBind = this.getInitSkuData.bind(this);
    this.state = {
      groupData: [],
      currentGroup: isOnlyGroup || (isOnlyEdu ? PCT_GROUPS_MAP.all.groupId : 'all'), // 分组
      currentMediaType: getMediaType(PCT_GROUPS_MAP.all.groupId), // 知识付费的 mediaType（图文下属的 type）
      currentType: isOnlyEdu ? GOODS_TYPE_MAP.knowledge : GOODS_TYPE_MAP.all, // 分类
      currentChannel: 'online', // 频道
      skuData: this.getInitSkuDataBind(selected),
      tempSelected: selected,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { selected } = nextProps;
    if (this.props.selected !== selected) {
      this.setState({
        tempSelected: selected || SELECTED,
        skuData: this.getInitSkuData(selected || SELECTED),
      });
    }
  }

  // 将有 selected 中有 skuInfo 信息的 item 筛选出来
  getInitSkuData(selected) {
    const { singleMode } = this.props;
    if (singleMode) {
      return filterSkuinfo([[selected]]);
    } else {
      const distribution = get(selected, 'distribution.value', []);
      const offline = get(selected, 'offline.value', []);
      const online = get(selected, 'online.value', []);

      return filterSkuinfo([distribution, offline, online]);
    }
  }

  formatSelected = selected => { };

  transformPartToValue = selected => {
    const { singleMode } = this.props;
    if (singleMode) {
      return selected;
    } else {
      return {
        distribution: {
          type: 'part',
          value: get(selected, 'distribution.part', []),
        },
        offline: {
          type: 'part',
          value: get(selected, 'offline.part', []),
        },
        online: {
          type: 'part',
          value: get(selected, 'online.part', []),
        },
      };
    }
  };

  handleBeforeOk = selected => {
    const { singleMode, hasSku, maxSelectedNum } = this.props;
    const { tempSelected } = this.state;

    if (!singleMode) {
      const distribution = get(tempSelected, 'distribution.value', []);
      const offline = get(tempSelected, 'offline.value', []);
      const online = get(tempSelected, 'online.value', []);

      return checkSkuinfo(
        [
          {
            items: distribution,
            error: '分销',
          },
          {
            items: offline,
            error: '门店',
          },
          {
            items: online,
            error: '网店',
          },
        ],
        hasSku,
        maxSelectedNum,
      );
    } else {
      const selectedList = [tempSelected];
      return checkSkuinfo(
        [
          {
            items: selectedList,
            error: '',
          },
        ],
        hasSku,
        maxSelectedNum,
      );
    }
  };

  handleOnOk = selected => {
    const { onChange } = this.props;
    const { tempSelected } = this.state;

    onChange(tempSelected);
  };

  handleChange = selected => {
    const transSelected = this.transformPartToValue(selected);
    this.setState({
      tempSelected: transSelected,
    });
  };

  // 将所有设置过 sku 的存一个列表
  handleSkuChange = changed => {
    const { skuData } = this.state;
    const skuDataCopy = cloneDeep(skuData);

    // when changed is an array
    if (Array.isArray(changed)) {
      changed.forEach(changedItem => {
        const indexOfSku = findIndex(skuDataCopy, o => o.id === changedItem.id);
        if (indexOfSku > -1) {
          skuDataCopy[indexOfSku].skuInfo = changedItem.skuInfo;
        } else {
          skuDataCopy.push(changedItem);
        }
      });
    } else {
      const indexOfSku = findIndex(skuDataCopy, o => o.alias === changed.alias);
      if (indexOfSku > -1) {
        skuDataCopy[indexOfSku].skuInfo = changed.skuInfo;
      } else {
        skuDataCopy.push(changed);
      }
    }

    const selectedWithSku = this.getSelectedWithSku(changed);

    this.setState({
      skuData: skuDataCopy,
      tempSelected: selectedWithSku,
    });
  };

  // 已选与规格状态保持一致
  getSelectedWithSku = changed => {
    const { currentChannel, tempSelected } = this.state;
    const { singleMode } = this.props;
    const tempSelectedCopy = cloneDeep(tempSelected);
    if (singleMode) {
      return changed;
    } else {
      const items = get(tempSelectedCopy[currentChannel], 'value', []);
      if (Array.isArray(changed)) {
        changed.forEach(changedItem => {
          const indexOfChanged = findIndex(items, item => item.id === changedItem.id);
          if (indexOfChanged > -1) {
            items[indexOfChanged] = changedItem;
          } else {
            items.push(changedItem);
          }
        });
      } else {
        const indexOfChanged = findIndex(items, o => o.alias === changed.alias);
        if (indexOfChanged > -1) {
          items[indexOfChanged] = changed;
        } else {
          items.push(changed);
        }
      }
      return tempSelectedCopy;
    }
  };

  fetchGoods = (channel, { page, pageSize }, { keyword, type, group }) => {
    const { currentChannel, currentGroup, currentType, skuData, currentMediaType } = this.state;
    const { activityType, activityId, isOnlyEdu, eduDetailGroup, ext } = this.props;

    let scopeType = currentType;
    let scopeGroup = currentGroup;

    // channel 变化强制刷新过滤器
    // 所有状态刷新初始值
    if (channel !== currentChannel) {
      scopeType = isOnlyEdu ? GOODS_TYPE_MAP.knowledge : 'all';
      scopeGroup = isOnlyEdu ? PCT_GROUPS_MAP.all.groupId : 'all';
      this.setState(
        Object.assign(this.state, {
          currentChannel: channel,
          currentType: scopeType,
          currentGroup: scopeGroup,
        }),
        () =>
          this.fetchGroups(channel, { page: 1, pageSize: 20 }, { keyword: '', type: scopeType }),
      );
    }

    const reqGroup =
      isPlainObject(scopeGroup) && GOODS_TYPE_MAP.knowledge === scopeType
        ? scopeGroup.subType
        : scopeGroup;

    const req = {
      channel,
      eduChannel: CHANNEL_TYPE_VALUE_MAP[channel],
      type: scopeType,
      group: reqGroup,
      subType: reqGroup,
      keyword,
      page,
      pageSize,
    };

    // 开启详细 知识付费 groups 的情况下才传 mediaType 字段
    eduDetailGroup && (req.mediaType = currentMediaType);
    activityType && (req.activityType = activityType);
    // 根据活动id判断冲突商品是否是这个活动的商品
    req.activityId = activityId || 0;

    // 附加字段
    if (ext) {
      req.ext = ext;
    }

    return getGoodsList(req)
      .then(res => {
        // 添加 skuInfo 对象
        const items = scopeType === GOODS_TYPE_MAP.knowledge ? res.content : res.items;
        addSkuinfo(items, skuData);
        return {
          items: items,
          count:
            scopeType === GOODS_TYPE_MAP.knowledge
              ? res.total
              : get(res, 'paginator.totalCount', 100),
        };
      })
      .catch(err => {
        Notify.error(err);
      });
  };

  fetchGroups = (channel, { page, pageSize }, { keyword, type }) => {
    const { currentType } = this.state;
    const { eduDetailGroup, ignoreGroup } = this.props;
    type = currentType;
    return getGroupList({
      channel,
      eduChannel: CHANNEL_TYPE_VALUE_MAP[channel],
      type,
      eduDetailGroup: eduDetailGroup ? 1 : 0,
      keyword,
      page,
      pageSize,
    })
      .then(res => {
        let { items } = res;
        // 知识付费不显示全部分组
        if (type !== GOODS_TYPE_MAP.knowledge) {
          items = [...items, { groupId: 'all', title: '全部分组' }];
        }
        if (type === GOODS_TYPE_MAP.knowledge) {
          items = filterNeededItems(items, ignoreGroup)[channel];
        }
        this.setState({
          groupData: items,
        });
        return res;
      })
      .catch(err => {
        Notify.error(err);
      });
  };

  renderFilters = onChange => {
    const { groupData, currentGroup, currentChannel, currentType } = this.state;
    const { isOnlyEdu } = this.props;

    const typeData = isOnlyEdu ? GOODS_ONLY_EDU_TYPES : GOODS_TYPES;
    const typeValue = currentType;

    const GoodsTypeSelect = (
      <Select
        key="type"
        data={typeData}
        value={typeValue}
        optionValue="value"
        optionText="label"
        emptyText="全部"
        onChange={e => {
          const type = e.target.value;
          this.setState(
            {
              currentType: type,
              currentGroup: type === GOODS_TYPE_MAP.knowledge ? PCT_GROUPS_MAP.all.groupId : 'all',
              currentMediaType: getMediaType(PCT_GROUPS_MAP.all.groupId),
            },
            () => {
              onChange('type', type);
              this.fetchGroups(currentChannel, { page: 1, pageSize: 20 }, { keyword: '', type });
            },
          );
        }}
      />
    );
    const GroupSelect = (
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
          const groupValue = e.target.value;
          let mediaType = 0;

          // 如果 groupValue 是个对象，代表这是知识付费的 group
          if (isPlainObject(groupValue)) {
            mediaType = groupValue.mediaType;
          }
          this.setState({ currentGroup: groupValue, currentMediaType: mediaType }, () =>
            onChange('group', groupValue),
          );
        }}
      />
    );

    return isOnlyEdu ? [GroupSelect] : [GoodsTypeSelect, GroupSelect];
  };

  getTableColumns = () => {
    const {
      activityType,
      hasSku,
      column,
      shouldSelect,
      shouldSelectSku,
      singleSkuMode,
    } = this.props;
    const hasShouldSelect = typeof shouldSelect === 'function';
    const hasShouldSelectSku = typeof shouldSelectSku === 'function';

    if (column.length) {
      return column;
    }

    let columns = getColumns.getGoodsCols();

    // 去掉商品分组
    columns.splice(1, 1);

    // 修改库存
    columns.splice(2, 1, {
      title: '库存',
      bodyRender: data => {
        if (data.owlItemType === 10) {
          if (data.totalStock === 0) {
            return '无库存';
          }
          return data.totalStock;
        }
        // 针对专栏、内容、直播，库存显示为不限库存
        if ([1, 2, 4].includes(data.owlItemType)) {
          return '不限库存';
        }
        return '无库存';
      },
    });

    // 如果不是活动选择商品
    // 需要把 已参与活动 && 不可选理由去掉
    if (!activityType) {
      columns = columns.slice(0, -2);
    } else {
      columns.pop();
      columns.push({
        title: '状态',
        bodyRender: data => {
          if (!data.isConflict) {
            return '_';
          }
          return data.error;
        },
      });
    }

    if (hasSku) {
      columns.splice(1, 0, {
        title: '规格',
        width: 11,
        bodyRender: data => {
          let canSelect = !data.isConflict;
          if (hasShouldSelect) {
            const outerCanSelect = shouldSelect(data);
            canSelect = canSelect && outerCanSelect;
          }
          if (hasShouldSelectSku) {
            const outerCanSelectSku = shouldSelectSku(data);
            canSelect = canSelect && outerCanSelectSku;
          }
          if (!data.skuSize) {
            return '_';
          }

          return (
            <SkuCell
              data={data}
              singleSkuMode={singleSkuMode}
              disabled={!canSelect}
              handleChange={this.handleSkuChange}
            />
          );
        },
      });
    }
    return columns;
  };

  getRowConf = () => {
    const { shouldSelect } = this.props;
    const hasShouldSelect = typeof shouldSelect === 'function';

    return data => {
      // 如果有自定义的 shouldSelect 传入，则对两个结果取且操作
      if (hasShouldSelect) {
        const outerCanSelect = shouldSelect(data);
        const canSelect = !data.isConflict && outerCanSelect;
        return {
          canSelect,
        };
      } else {
        const canSelect = !data.isConflict;
        return {
          canSelect,
        };
      }
    };
  };

  getChannels = () => {
    const { channels, hasFx } = this.props;
    if (hasFx) {
      return ['online', 'distribution'];
    } else if (channels.length) {
      return channels;
    } else {
      return ['online'];
    }
  };

  getBaseCustomize = () => {
    return {
      goodsList: {
        filters: this.renderFilters,
        getRowConf: this.getRowConf(),
        columns: this.getTableColumns(),
      },
      fetchGroups: this.fetchGroups,
      fetchGoods: this.fetchGoods,
    };
  };

  getCustomize = () => {
    const { isOnlyEdu, customize } = this.props;

    if (isOnlyEdu) {
      return this.getBaseCustomize();
    } else if (!isEmpty(customize)) {
      return customize;
    } else {
      return this.getBaseCustomize();
    }
  };

  render() {
    const {
      singleMode,
      className,
      btnTxt,
      dialogClassName,
      disabled,
      identifier,
      customChannels,
    } = this.props;
    const { tempSelected } = this.state;
    const channels = this.getChannels();
    const customize = this.getCustomize();

    const clasBtn = cx('pct-goods-selector-button', className);
    const clasDialog = cx('pct-goods-selector', dialogClassName);

    return (
      <span className="goods-select-wrapper">
        {disabled ? (
          <Button style={{
            padding: '0',
            border: '0 none',
            backgroundColor: '#fff',
          }} disabled>{btnTxt}</Button>
        ) : (<GoodsSelector
          selected={tempSelected}
          identifier={identifier}
          dialogClassName={clasDialog}
          className={clasBtn}
          btnTxt={btnTxt}
          mode={singleMode ? 'single' : 'multiple'}
          singleMode={singleMode}
          customize={customize}
          channels={channels}
          beforeOk={this.handleBeforeOk}
          onOk={this.handleOnOk}
          onChange={this.handleChange}
          customChannels={customChannels}
        />
        )}
      </span>
    );
  }
}

export default GoodSelector;
