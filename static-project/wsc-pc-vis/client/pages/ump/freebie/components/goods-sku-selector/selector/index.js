import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Notify } from 'zent';
import Big from 'big.js';
import get from 'lodash-es/get';
import isNil from 'lodash-es/isNil';
import pick from 'lodash-es/pick';
import uniq from 'lodash-es/uniq';
import full from '@youzan/utils/url/full';
import { PopSku, PopContent, PopEllipsisText } from '@youzan/react-components';

import { getSkuName } from '../common/utils';
import { CHANNEL_NUMBER_MAPPING } from '../common/constants';
import Channel from '../common/widgets/channel';
import GoodsBrief from '../common/widgets/goods-brief';

// Widgets
import Header from '../widgets/header';
import Footer from '../widgets/footer';

const globalUrl = get(window, '_global.url', {});
const defautlLableConfig = {
  VIRTUAL: '虚拟商品', // 虚拟商品，默认展示
  KNOWLEDGE: '课程商品', // 课程商品（课程商品），默认展示
  DISTRIBUTION: '', // 分销商品，默认不展示
};
const noStock = [1, 2, 4];

export default class Selector extends Component {
  /**
   * 获取当前已选的渠道状态
   * @return {boolean}
   */
  getIsOnline = () => {
    return this.state.channel === 'online';
  };

  /**
   * 获取选择的 key 值
   * @return {string}
   */
  getSelectedKey() {
    return this.getIsOnline() ? 'selectedOnlineSkuList' : 'selectedOfflineSkuList';
  }

  /**
   * 获取当前未选择的 key 值
   * @return {string}
   */
  getUnSelectedKey() {
    return this.getIsOnline() ? 'selectedOfflineSkuList' : 'selectedOnlineSkuList';
  }

  /**
   * 获取选择的 row key 值
   * @return {string}
   */
  getSelectedRowKey() {
    return this.getIsOnline() ? 'selectedOnlineRowKeys' : 'selectedOfflineRowKeys';
  }

  /**
   * 获取未选择的 row key 值
   * @return {string}
   */
  getUnSelectedRowKey() {
    return this.getIsOnline() ? 'selectedOfflineRowKeys' : 'selectedOnlineRowKeys';
  }

  /**
   * 获取半选的 row key 值
   * @return {string}
   */
  getIndeterminateRowKeys() {
    return this.getIsOnline() ? 'indeterminateOnlineRowKeys' : 'indeterminateOfflineRowKeys';
  }

  /**
   * 通过自定义 label 配置获取商品对应的 label
   * @return {string}
   */
  getGoodsLabelByConfig(goods) {
    const { goodsType, isVirtual } = goods;
    const { labelConfig = defautlLableConfig } = this.props;
    if (goodsType === 0) {
      if (isVirtual) {
        return labelConfig.VIRTUAL || '';
      }
    } else if (goodsType === 31) {
      return labelConfig.KNOWLEDGE || '';
    } else if (goodsType === 10) {
      return labelConfig.DISTRIBUTION || '';
    }
    return '';
  }

  /**
   * 获取列信息
   */
  getColumns() {
    const _this = this;
    return [
      {
        title: '课程商品',
        name: 'title',
        width: 278,
        fixed: true,
        bodyRender(goods) {
          const imageUrl = get(goods, 'pictures[0].url');
          const label = _this.getGoodsLabelByConfig(goods);
          return (
            <GoodsBrief
              {...goods}
              label={label}
              image={imageUrl}
              price=""
              size="large"
            />
          );
        },
      },
      {
        title: '价格',
        width: 120,
        textAlign: 'right',
        bodyRender({ skuSize, price, skuInfo }) {
          if (!skuSize) {
            return '¥' + Big(price).div(100).toFixed(2);
          }
          if (skuInfo && skuInfo.sku) {
            const _sku = skuInfo.sku.concat([]);
            _sku.sort((pre, cur) => {
              if (pre.price < cur.price) {
                return -1;
              } else if (pre.price === cur.price) {
                return 0;
              }
              return 1;
            });
            const startPrice = (_sku[0] && _sku[0].price) || 0;
            const endPrice = (_sku[_sku.length - 1] && _sku[_sku.length - 1].price) || 0;
            if (startPrice === endPrice) {
              return '¥' + Big(startPrice).div(100).toFixed(2);
            }
            return (
              <>
                <div>¥{Big(startPrice).div(100).toFixed(2)}</div>
                <div>-¥{Big(endPrice).div(100).toFixed(2)}</div>
              </>
            );
          }
          return '-';
        },
      },
      {
        title: '规格',
        width: 120,
        bodyRender: (goods, { row }) => {
          const { isSku, skuInfo, goodsId } = goods;
          const { channel } = this.state;
          const { multiple, enableNegativeStock } = this.props;

          if (!isSku) return '-';

          const { selectedOnlineSkuList, selectedOfflineSkuList, visibleSkuIndex } = this.state;
          const selectedSkuList =
            channel === 'online' ? selectedOnlineSkuList : selectedOfflineSkuList;

          const selectedSkuIds = (multiple
            ? get(selectedSkuList, `[${goodsId}].skuInfo.sku`, [])
            : get(selectedSkuList, `[${goodsId}]`, [])
          ).map(item => item.skuId);

          const { disabled } = this.getCheckboxProps(goods);

          return (
            <PopSku
              multiple={multiple}
              disabled={disabled}
              data={skuInfo}
              enableNegativeStock={enableNegativeStock}
              visible={row === visibleSkuIndex}
              selected={selectedSkuIds}
              onVisibleChange={visible => {
                this.setState({
                  visibleSkuIndex: visible ? row : null,
                });
              }}
              onChange={selected => {
                // 不管有没有选中 SKU 都需要设置一遍
                if (multiple) {
                  this.onMultipleSelectionChange(goods, selected);
                } else {
                  this.onSingleSelectionChange(goods, selected);
                }

                this.setState({
                  visibleSkuIndex: null,
                });
              }}
            />
          );
        },
      },
      {
        title: '课程分组',
        width: 120,
        bodyRender({ groups }) {
          // todo
          if (!groups) {
            return '-';
          }
          return (
            <PopContent
              omitNum={3}
              datasets={groups.map(group => (
                <span key={group.groupId}>{group.title}</span>
              ))}
            />
          );
        },
      },
      {
        title: '近30天销量/累积销量',
        width: 200,
        bodyRender({ thirtyDaysSoldNum = '-', totalSoldNum = '-' }) {
          return `${thirtyDaysSoldNum}/${totalSoldNum}`;
        },
      },
      {
        title: '库存',
        name: 'totalStock',
        width: 120,
        bodyRender: rowData => {
          for (const i of noStock) {
            if (i === rowData.owlItemType) {
              return '不限库存';
            }
          }
          return rowData.totalStock;
        },
      },
      {
        title: '已参加活动',
        width: 120,
        bodyRender: rowData => {
          return '-';
        },
      },
      {
        title: '状态',
        width: 120,
        fixed: 'right',
        bodyRender: rowData => {
          const { isConflict, error = '-' } = rowData;

          if (error) {
            return (
              <div className="goods-status-col">
                <PopEllipsisText type="line" line={2} text={error} position="bottom-right" />
              </div>
            );
          }

          if (isConflict) {
            return (
              <div className="goods-status-col">
                <p>状态冲突</p>
                <p>不可用</p>
              </div>
            );
          }

          return '-';
        },
      },
    ];
  }

  /**
   * 单选的修改
   *
   * @param {Object} goods 商品信息
   * @param {Array<Number>} selected 已选择的数组
   */
  onSingleSelectionChange = (goods, selected) => {
    const { goodsId } = goods;
    const selectedSku = get(
      get(goods, 'skuInfo.sku').filter(({ skuId }) => selected.includes(skuId)),
      '[0]',
      {},
    );

    this.setState({
      [this.getSelectedRowKey()]: [goodsId],
      [this.getUnSelectedRowKey()]: [],
      [this.getUnSelectedKey()]: [],
      [this.getSelectedKey()]: {
        [goodsId]: [
          Object.assign({}, pick(goods, ['title', 'price']), {
            image: get(goods, 'pictures[0].url', ''),
            alias: get(goods, 'alias', ''),
            isVirtual: get(goods, 'isVirtual'),
            goodsType: get(goods, 'goodsType'),
            skuId: get(selectedSku, 'skuId'),
            stock: get(selectedSku, 'stock', 0),
            rawSku: get(goods, 'skuInfo.sku', []),
            sku: getSkuName(selectedSku),
          }),
        ],
      },
    });
  };

  /**
   * 多选的修改
   *
   * @param {Object} goods
   * @param {Array<Number>} selected
   */
  onMultipleSelectionChange = (goods, selected) => {
    const { goodsId } = goods;
    const currentGoodsSkuList = get(goods, 'skuInfo.sku', []).filter(
      sku => sku.canSelect || isNil(sku.canSelect),
    );
    const selectedSku = currentGoodsSkuList.filter(({ skuId }) => selected.includes(skuId));

    const isCurrentGoodsSkuAllSelected = currentGoodsSkuList.length === selected.length;
    const isCurrentGoodsSkuIndeterminate = selected.length > 0 && !isCurrentGoodsSkuAllSelected;

    this.setState(prevState => {
      const selectedSkuKey = this.getSelectedKey();

      const selectedRowKey = this.getSelectedRowKey();
      const indeterminateRowKey = this.getIndeterminateRowKeys();
      const selectedRows = prevState[selectedRowKey];
      const indeterminateRows = prevState[indeterminateRowKey];

      // 组合已选的数据结构 key: goodsId, value: goodsInfo
      const prevSelectedGoodsInfo = Object.assign({}, prevState[selectedSkuKey]);

      if (selectedSku.length === 0) {
        // 选中的 SKU 为空数组时，移除选择的商品
        delete prevSelectedGoodsInfo[goodsId];
      } else {
        // 不为空的时候更新商品 SKU 信息
        Object.assign(prevSelectedGoodsInfo, {
          [goodsId]: {
            ...pick(goods, ['goodsId', 'id', 'title', 'price', 'alias', 'isVirtual', 'goodsType']),
            isSku: true,
            image: get(goods, 'pictures[0].url', ''),
            stock: get(goods, 'totalStock', 0),
            skuInfo: Object.assign({}, goods.skuInfo, {
              sku: selectedSku,
              rawSku: get(goods, 'skuInfo.sku', []),
            }),
          },
        });
      }

      return {
        // 全选的 Key
        [selectedRowKey]: isCurrentGoodsSkuAllSelected
          ? uniq(selectedRows.concat([goodsId]))
          : selectedRows.filter(key => key !== goodsId),
        // 半选的 Key
        [indeterminateRowKey]: isCurrentGoodsSkuIndeterminate
          ? uniq(indeterminateRows.concat([goodsId]))
          : indeterminateRows.filter(key => key !== goodsId),
        // 选中的 SKU 信息
        [selectedSkuKey]: prevSelectedGoodsInfo,
      };
    });
  };

  /**
   * 搜索内容修改的回调
   *
   * @param {Event} evt
   */
  onSearchChange = (key, value, refresh) => {
    this.setState({ [key]: value });
    if (refresh) {
      this.setState({ current: 1 }, () => {
        this.fetchData();
      });
    }
  };

  /**
   * 渠道切换
   * @param {String} channel
   */
  onChannelChange = channel => {
    this.setState({ channel, current: 1, search: '' }, this.fetchData);
  };

  /**
   * 触发回调
   */
  onConfirm = () => {
    const { multiple, onChange } = this.props;
    const { selectedOnlineSkuList, selectedOfflineSkuList } = this.state;
    const selectedData = multiple
      ? {
        online: {
          type: 'part',
          value: Object.values(selectedOnlineSkuList),
        },
        offline: {
          type: 'part',
          value: Object.values(selectedOfflineSkuList),
        },
      }
      : {
        online: selectedOnlineSkuList,
        offline: selectedOfflineSkuList,
      };

    onChange && onChange(selectedData);
  };

  /**
   * 请求数据
   */
  fetchData = (cb = () => {}) => {
    this.setState({ loading: true });
    const { search, subType, current, channel } = this.state;

    this.props
      .fetchApi({
        keyword: search,
        subType,
        pageNo: current,
        pageSize: 5,
        channel: CHANNEL_NUMBER_MAPPING[channel],
      })
      .then(({ items, count }) => {
        this.setState({ data: items, total: count }, cb);
      })
      .catch(err => {
        Notify.error(err.msg || '数据加载失败');
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  /**
   * 获取不能选的原因
   *
   * @param {Object} rowData
   */
  getUnSelectReason(rowData) {
    if (rowData.isSerialItem) return '串码商品不能参加';
    if (rowData.preSale) return '预售商品不能参加';
    if (+rowData.pricingStrategy === 10) return '称重商品不能参加';

    return '';
  }

  /**
   * 获取行配置
   *
   * @params {Object} rowData
   */
  getCheckboxProps = rowData => {
    const skuList = get(rowData, 'skuInfo.sku', []);

    // 如果设置了串码或者称重商品不可选

    // 多 SKU 商品
    if (rowData.isSku && skuList.length) {
      // 每个都不能选
      if (
        skuList.every(sku => {
          return sku.canSelect === false || sku.price === 0;
        })
      ) {
        return {
          disabled: true,
        };
      }
    }

    // 单 sku 商品
    // 有报错
    if (rowData.error) {
      return {
        disabled: true,
      };
    }

    return {
      disabled: false,
    };
  };

  /**
   * 初始化选中的状态
   */
  initialSelectedState = () => {
    const { selected } = this.props;
    const { data } = this.state;

    const getSelectedKeys = key =>
      get(selected, key, [])
        .map(item => item.goodsId)
        .map(id => parseInt(id, 10));

    let selectedOnlineKeys = getSelectedKeys('online.value');
    let selectedOfflineKeys = getSelectedKeys('offline.value');

    const selectedOnlineSkuList = get(selected, 'online.value', []);
    const selectedOfflineSkuList = get(selected, 'offline.value', []);

    const selectedOnlineValues = {};
    const selectedOfflineValues = {};

    selectedOnlineSkuList.forEach(item => {
      Object.assign(selectedOnlineValues, {
        [item.goodsId]: item,
      });
    });

    selectedOfflineSkuList.forEach(item => {
      Object.assign(selectedOfflineValues, {
        [item.goodsId]: item,
      });
    });

    const indeterminateOnlineRowKeys = [];
    const indeterminateOfflineRowKeys = [];

    // 处理半选状态
    data.forEach(goods => {
      const goodsSkuList = get(goods, 'skuInfo.sku', []);
      const currentSelectedOnlineGoods = selectedOnlineValues[goods.goodsId];
      const currentSelectedOfflineGoods = selectedOfflineValues[goods.goodsId];

      // 有这个商品的 SKU 信息
      // 网点商品
      if (currentSelectedOnlineGoods) {
        if (goodsSkuList.length > get(currentSelectedOnlineGoods, 'skuInfo.sku', []).length) {
          indeterminateOnlineRowKeys.push(goods.goodsId);
          // 过滤 selected row Key
          selectedOnlineKeys = selectedOnlineKeys.filter(key => key !== goods.goodsId);
        }
      }

      // 门店商品
      if (currentSelectedOfflineGoods) {
        if (goodsSkuList.length > get(currentSelectedOfflineGoods, 'skuInfo.sku', []).length) {
          indeterminateOfflineRowKeys.push(goods.goodsId);
          selectedOfflineKeys = selectedOfflineKeys.filter(key => key !== goods.goodsId);
        }
      }
    });

    this.setState({
      /** 已选数据 */
      selectedOnlineRowKeys: selectedOnlineKeys,
      /** 已选门店数据 */
      selectedOfflineRowKeys: selectedOfflineKeys,
      indeterminateOnlineRowKeys,
      indeterminateOfflineRowKeys,
      /** 已选择的 SKU 数据 */
      selectedOnlineSkuList: selectedOnlineValues,
      /** 已选择的门店 SKU 数据 */
      selectedOfflineSkuList: selectedOfflineValues,
    });
  };

  constructor(props) {
    super(props);

    const { selected, channels } = props;
    const getSelectedKeys = key => get(selected, key, { value: [] }).value.map(id => parseInt(id, 10));
    const selectedOnlineKeys = getSelectedKeys('online');
    const selectedOfflineKeys = getSelectedKeys('offline');
    const activeChannel =
      (selectedOnlineKeys.length === 0 && selectedOfflineKeys.length > 0) ||
      (channels.length === 1 && get(channels, '[0]') === 'offline')
        ? 'offline'
        : 'online';

    this.state = {
      /** 当前的渠道 */
      channel: activeChannel,
      /** 加载状态 */
      loading: false,
      /** 搜索内容 */
      search: '',
      /** 当前页码 */
      current: 1,
      /** 总数 */
      total: 0,
      /** 数据 */
      data: [],
      /** 已选数据 */
      selectedOnlineRowKeys: [],
      /** 已选门店数据 */
      selectedOfflineRowKeys: [],
      indeterminateOnlineRowKeys: [],
      indeterminateOfflineRowKeys: [],
      /** 已选择的 SKU 数据 */
      selectedOnlineSkuList: {},
      /** 已选择的门店 SKU 数据 */
      selectedOfflineSkuList: {},
      /** 展示的 sku */
      visibleSkuIndex: null,
    };
  }

  static propTypes = {
    /** 是否支持多选 */
    multiple: PropTypes.bool,
    /** 渠道 */
    channels: PropTypes.array,
    /** 门店商品管理 URL */
    offlineManageUrl: PropTypes.string,
    /** 网店商品管理 URL */
    onlineManageUrl: PropTypes.string,
    /** 是否允许负库存 */
    enableNegativeStock: PropTypes.bool,
    /** 是否允许选择称重商品 */
    supportWeighItem: PropTypes.bool,
    /** 是否允许选择串码商品 */
    supportSerialItem: PropTypes.bool,
    /** 是否允许选择预售商品 */
    supportPreSale: PropTypes.bool,
    /** 请求 API */
    fetchApi: PropTypes.func.isRequired,
    /** 是否展示清空全部 */
    showClearAll: PropTypes.bool,
    /** 确认 */
    onConfirm: PropTypes.func,
    /** 取消 */
    onCancel: PropTypes.func,
    /** 已选中的商品 SKU 数据 */
    selected: PropTypes.object,
    /** 商品标签的文案配置 */
    labelConfig: PropTypes.object,
    /** onChange回调 */
    onChange: PropTypes.func,
  };

  static defaultProps = {
    multiple: false,
    channels: ['online', 'offline'],
    offlineManageUrl: full('/goods/goods/store', 'store', globalUrl),
    onlineManageUrl: full('/goods/goods/shop', 'store', globalUrl),
    enableNegativeStock: false,
    supportWeighItem: true,
    supportSerialItem: true,
    supportPreSale: true,
    showClearAll: true,
    // 对应文案为空时则不显示 label
    labelConfig: defautlLableConfig,
    onConfirm: () => {},
    onCancel: () => {},
    selected: {
      offline: {},
      online: {},
    },
  };

  componentDidMount() {
    this.fetchData(this.initialSelectedState);
  }

  render() {
    const { channels, multiple, onCancel, offlineManageUrl, onlineManageUrl } = this.props;
    const {
      channel,
      loading,
      data,
      current,
      total,
      search,
      subType,
      selectedOnlineRowKeys,
      selectedOfflineRowKeys,
      indeterminateOnlineRowKeys,
      indeterminateOfflineRowKeys,
      selectedOnlineSkuList,
      selectedOfflineSkuList,
    } = this.state;

    const isOffline = channel === 'offline';
    const selectedRowKeys = isOffline
      ? (selectedOfflineRowKeys || []).concat(indeterminateOfflineRowKeys || [])
      : (selectedOnlineRowKeys || []).concat(indeterminateOnlineRowKeys || []);

    return (
      <div className="rc-goods-sku-selector_wrapper">
        <Channel active={channel} items={channels} onChange={this.onChannelChange} />
        <div className="rc-goods-sku-selector_container">
          <Header
            url={isOffline ? offlineManageUrl : onlineManageUrl}
            value={{ subType, search }}
            onSearch={() => this.fetchData()}
            onChange={this.onSearchChange}
          />
          <Grid
            loading={loading}
            datasets={data}
            columns={this.getColumns()}
            className="rc-goods-sku-selector_grid"
            scroll={{ x: 1242 }}
            pageInfo={{
              pageSize: 5,
              current,
              total,
            }}
            onChange={pageInfo => {
              this.setState({ current: pageInfo.current }, this.fetchData);
            }}
            selection={{
              isSingleSelection: !multiple,
              needCrossPage: true,
              selectedRowKeys,
              getCheckboxProps: this.getCheckboxProps,
              onSelect: (selectedKeys, selectedRows, currentRow) => {
                const currentMulti = Array.isArray(currentRow);
                const currentSingle = !currentMulti;
                const selectingSingle = currentSingle && selectedRows.includes(currentRow);
                const unSelectingSingle = currentSingle && !selectingSingle;

                // 单个勾选
                if (selectingSingle) {
                  // 非多规格商品
                  if (!currentRow.isSku) {
                    this.setState(prevState => {
                      const selectedSkuKey = this.getSelectedKey();
                      const currentSku = {
                        [currentRow.goodsId]: Object.assign(
                          {},
                          pick(currentRow, [
                            'goodsId',
                            'id',
                            'title',
                            'price',
                            'alias',
                            'skuInfo',
                            'isVirtual',
                            'goodsType',
                          ]),
                          {
                            isSku: false,
                            image: get(currentRow, 'pictures[0].url', ''),
                            skuId: get(currentRow, 'skuInfo.id'),
                            stock: get(currentRow, 'totalStock', 0),
                          },
                        ),
                      };

                      // 多选
                      if (multiple) {
                        return {
                          [this.getSelectedRowKey()]: selectedKeys,
                          [this.getSelectedKey()]: Object.assign(
                            prevState[selectedSkuKey],
                            currentSku,
                          ),
                        };
                      }

                      return {
                        [this.getSelectedRowKey()]: selectedKeys,
                        [this.getUnSelectedRowKey()]: [],
                        [this.getUnSelectedKey()]: {},
                        [this.getSelectedKey()]: currentSku,
                      };
                    });
                  } else {
                    this.setState({
                      visibleSkuIndex: data.findIndex(item => item.id === currentRow.id),
                    });
                  }
                } else {
                  // 取消勾选，只有在多选的情况下会发生
                  // 或者全选、全部取消
                  this.setState(prevState => {
                    const selectedSkuKey = this.getSelectedKey();
                    const indeterminateKey = this.getIndeterminateRowKeys();
                    const selectedSkuList = prevState[selectedSkuKey];
                    const newSelectedSkuList = {};

                    // 生成 SKU 列表
                    // 半选的 SKU 列表
                    Object.keys(selectedSkuList)
                      .filter(
                        key => {
                          if (unSelectingSingle && (String(key) === String(currentRow.goodsId))) {
                            return false;
                          }
                          return prevState[indeterminateKey].includes(+key) || selectedKeys.includes(+key);
                        },
                      )
                      .forEach(key => {
                        newSelectedSkuList[key] = selectedSkuList[key];
                      });

                    const newInterminateKeyList = prevState[indeterminateKey].filter(
                      key => {
                        if (unSelectingSingle && (String(key) === String(currentRow.goodsId))) {
                          return false;
                        }
                        return !selectedKeys.includes(key);
                      },
                    );

                    // 包含所有 单SKU 和 多SKU全含的部分
                    selectedRows.forEach(item => {
                      newSelectedSkuList[item.goodsId] = Object.assign(
                        {},
                        pick(item, [
                          'goodsId',
                          'id',
                          'title',
                          'price',
                          'alias',
                          'isSku',
                          'isVirtual',
                          'goodsType',
                        ]),
                        {
                          image: get(item, 'pictures[0].url', ''),
                          stock: get(item, 'totalStock', 0),
                          skuId: get(item, 'skuInfo.id'),
                          skuInfo: Object.assign({}, item.skuInfo, {
                            sku: get(item, 'skuInfo.sku', []).filter(
                              sku => {
                                return isNil(sku.canSelect) || sku.canSelect;
                              },
                            ),
                            rawSku: get(item, 'skuInfo.sku', []),
                          }),
                        },
                      );
                    });

                    return {
                      [this.getSelectedRowKey()]: selectedKeys,
                      [selectedSkuKey]: newSelectedSkuList,
                      [indeterminateKey]: newInterminateKeyList,
                    };
                  });
                }
              },
            }}
          />
          <Footer
            channels={channels}
            onConfirm={this.onConfirm}
            onCancel={onCancel}
            selected={{
              online: selectedOnlineSkuList,
              offline: selectedOfflineSkuList,
            }}
          />
        </div>
      </div>
    );
  }
}
