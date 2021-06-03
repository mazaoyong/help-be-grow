import { Pop } from '@zent/compat';
import React from 'react';
import { Checkbox, Notify } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import VipCutoffPop from './vip-cutoff-pop';
import handleBatchActions from '../utils/batch-action-config';
import '../style.scss';
// 批处理
export default class BatchAction extends React.Component {
  state = {
    selectedData: [],
  };

  static defaultProps = {
    selected: [],
    onAction: () => {},
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { selectedData } = prevState;
    const { selected, sourceData } = nextProps;
    if (selected.length !== selectedData.length) {
      // 如果selected发生改变，那么触发相对应的更改
      const filtered = sourceData.filter(item => selected.findIndex(e => e === item.alias) > -1);

      return {
        ...prevState,
        selectedData: filtered,
      };
    }
    return null;
  }

  /**
   * 点击全选
   */
  handleSelectAll = () => {
    const checked = !this.state.checked;
    this.setState({ checked });
    // 触发父组件的全选事件，联动表格
    if (this.props.selectAll) {
      this.props.selectAll(checked);
    }
  };

  /**
   * 处理各种行为的点击事件
   *
   * @param {string} type 根据传入的参数，返回不同的处理
   */
  handleActions(type) {
    // 需要先取出用户选中的项目，并对其进行操作
    const { selectedData } = this.state;

    const aliasList = selectedData.map(i => i.alias);
    if (selectedData.length === 0) {
      Notify.error('请选择至少一个商品进行批量操作');
      return 0;
    }
    const methods = handleBatchActions.call(this, aliasList);

    try {
      // eslint-disable-next-line prefer-rest-params
      methods[type].apply(this, [].slice.call(arguments, 1));
    } catch (err) {
      Notify.error(err);
      this.props.refreshList(true);
      throw new Error(err);
    }
  }

  getDisabledConfig = selectedData => {
    const disabledConfig = {
      stopSale: false,
      inSale: false,
      removeItem: false,
    };
    const mapTypeToLockType = {
      stopSale: 'publish',
      inSale: 'publish',
      removeItem: 'delete',
    };
    // 选中数据并且数据中有商品锁字段
    if (selectedData.length && selectedData[0].lockType) {
      selectedData.forEach(selectedItem => {
        selectedItem.lockType.forEach(atomicLock => {
          Object.keys(disabledConfig).forEach(disabledConfigKey => {
            const _type = mapTypeToLockType[disabledConfigKey];
            if (atomicLock.fields.findIndex(field => _type === field) !== -1) {
              disabledConfig[disabledConfigKey] = true;
            }
          });
        });
      });
    }
    return disabledConfig;
  };

  render() {
    const { selected, sourceData } = this.props;
    const { selectedData } = this.state;
    const aliasList = selectedData.map(i => i.alias);
    const selectedLen = selected.length;
    const sourceLen = sourceData.length;
    const disabledConfig = this.getDisabledConfig(selectedData);

    return (
      <div className="batch-action__container">
        <Checkbox
          checked={selectedLen !== 0 && selectedLen === sourceLen}
          onChange={this.handleSelectAll}
        >
          当页全选
        </Checkbox>
        {/* <SamButton onClick={this.handleActions.bind(this, 'editGroup')}>修改分组</SamButton> */}
        <SamButton
          onClick={this.handleActions.bind(this, 'inSale')}
          ref={btn => (this.stopSale = btn)}
          disabled={disabledConfig.inSale}
        >
          上架销售
        </SamButton>
        <SamButton
          onClick={this.handleActions.bind(this, 'stopSale')}
          disabled={disabledConfig.stopSale}
        >
          停止销售
        </SamButton>
        <SamButton
          name='编辑'
          onClick={this.handleActions.bind(this, 'removeItem')}
          ref={btn => (this.removeBtn = btn)}
          disabled={disabledConfig.removeItem}
        >
          删除
        </SamButton>
        <span style={{ marginLeft: '10px' }}>
          <Pop
            trigger="click"
            position="top-left"
            content={
              <VipCutoffPop alias={aliasList} onOk={this.handleActions.bind(this, 'vipDiscount')} />
            }
          >
            <SamButton>会员折扣</SamButton>
          </Pop>
        </span>
      </div>
    );
  }
}
