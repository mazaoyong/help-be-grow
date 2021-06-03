import React, { Component } from 'react';
// import ajax from 'common/ajax';
import SKU from '../../components/sku';
import Env from '../../common/env';
import Model from '../../common/model';
import appCache from '../../common/app-cache';
import {
  findSkuPropNamesApi,
  findSkuPropValuesApi,
  postCreateSkuPropNameApi,
  postCreateSkuPropValApi,
} from '../../../api/course-manage';
import getMutiControlGroup from './get-muti-control-group';

const MESSAGE = '当前商品启用了门店网店库存同步，需要关闭同步才能新建规格项。';

class SkuFieldComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skuTree: [],
    };
  }
  componentWillReceiveProps(nextProps) {}

  componentWillMount() {
    // this.onGetListSkuPropNames();
  }

  // 获取规格列表
  onGetListSkuPropNames = () => {
    return findSkuPropNamesApi().then(res => {
      const skuTree = res;
      this.setState({
        skuTree,
      });
      return res;
    });
  };

  // 获取规格值列表
  onGetListSkuPropValues(params) {
    return findSkuPropValuesApi(params).then(res => {
      return res;
    });
  }

  // 创建规格名
  onCreateSkuPropName(text) {
    return postCreateSkuPropNameApi({ text }).then(res => {
      return res;
    });
  }

  // 创建规格值
  onCreateSkuPropVal(params) {
    return postCreateSkuPropValApi(params).then(res => {
      return res;
    });
  }

  handleSkuChange = value => {
    appCache.set({
      skuError: false,
    });
    this.props.onChange(value);
  };

  render() {
    let { disabled, disabledMsg, value } = this.props;
    disabled = disabled || Model.get('stock_locked') || Env.isReadOnly('sku');
    const { skuTree } = this.state;
    let lockedMsg = '';

    if (disabled) {
      lockedMsg = Env.lockedMsg('sku') || disabledMsg || MESSAGE;
    }

    return (
      <div>
        <SKU
          optionValue="dictId"
          value={value}
          skuTree={skuTree}
          onFetchSKU={this.onGetListSkuPropValues}
          onFetchGroup={this.onGetListSkuPropNames}
          onCreateGroup={this.onCreateSkuPropName}
          onCreateSKU={this.onCreateSkuPropVal}
          onChange={this.handleSkuChange}
          maxSize={3}
          maxLeafSize={10}
          disabled={disabled}
          lockedMsg={lockedMsg}
        />
      </div>
    );
  }
}

export default getMutiControlGroup(SkuFieldComponent);
