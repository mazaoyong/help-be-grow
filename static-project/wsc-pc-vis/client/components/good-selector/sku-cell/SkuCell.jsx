import { Pop } from '@zent/compat';
import React, { Component } from 'react';
import { Notify, BlockLoading, Button } from 'zent';
import _uniq from 'lodash/uniq';
import _compact from 'lodash/compact';
import _get from 'lodash/get';
import * as API from './api';
import SkuContent from './SkuContent';

class GoodsCell extends Component {
  constructor(props) {
    // format props
    const { data, singleSkuMode } = props;
    let value = (data && data.skuInfo) || (singleSkuMode ? {} : []);

    if (singleSkuMode && Array.isArray(value)) {
      value = value[0];
    }

    super(props);
    this.state = {
      value,
      tempValue: value,
      visible: false,
      isLoading: true,
      skuInfo: [],
    };
  }

  setTempValue = value => {
    this.setState({
      tempValue: value,
    });
  };

  confirmHandler = () => {
    this.setState({
      value: this.state.tempValue,
    });
    // 注入属性
    this.props.data.skuInfo = this.state.tempValue;
  };

  onBeforeShow = () => {
    if (this.hasGet) return;
    const id = this.props.data.alias;
    this.setState({
      isLoading: true,
    });
    API.getSkuInfo({
      alias: id,
    })
      .then(resp => {
        this.hasGet = true;
        this.setState({
          isLoading: false,
          skuInfo: this.formatResp(_get(resp, 'stocks', [])),
        });
        this.instance && this.instance.adjustPosition();
      })
      .catch(err => {
        Notify.error(err);
      });
  };

  formatResp = resp => {
    const skuInfo = {};
    // resp = mapKeysToSnakeCase(resp, true);
    if (resp.length === 0) return skuInfo;

    skuInfo.sku_name_1 = resp[0].k1;
    skuInfo.sku_name_2 = resp[0].k2;
    skuInfo.sku_name_3 = resp[0].k3;
    skuInfo.sku_name_1_value_length = _compact(_uniq(resp.map(item => item.v1Id))).length;
    skuInfo.sku_name_2_value_length = _compact(_uniq(resp.map(item => item.v2Id))).length;
    skuInfo.sku_name_3_value_length = _compact(_uniq(resp.map(item => item.v3Id))).length;
    skuInfo.stock = resp;
    return skuInfo;
  };

  renderSkuContent(pop) {
    const { isLoading, skuInfo } = this.state;
    const { handleChange, data, singleSkuMode } = this.props;
    const closeFun = pop.close;
    if (isLoading) {
      return (
        <BlockLoading loading className="loading-frame">
          <div className="loading-frame-content" />
        </BlockLoading>
      );
    }
    return (
      <div className="sku-content">
        <SkuContent
          tempValue={this.state.tempValue}
          setTempValue={this.setTempValue}
          sku={skuInfo}
          singleSkuMode={singleSkuMode}
        />
        <div className="button-group">
          <Button
            type="primary"
            onClick={() => {
              this.confirmHandler();
              handleChange(data);
              closeFun();
            }}
          >
            确认
          </Button>
          <Button onClick={closeFun}>取消</Button>
        </div>
      </div>
    );
  }

  render() {
    const { value } = this.state;
    const { disabled } = this.props;
    let className = 'goods-sku-col';
    if (disabled) {
      className += ' disabled';
    }
    let trigger = 'click';
    const Content = Pop.withPop(({ pop }) => {
      return this.renderSkuContent(pop);
    });

    if (disabled) {
      trigger = 'focus'; // 使pop不显示content
    }
    return (
      <Pop
        trigger={trigger}
        position="right-center"
        centerArrow
        className="sku-cell"
        onBeforeShow={this.onBeforeShow}
        content={<Content />}
        ref={instance => {
          this.instance = instance;
        }}
      >
        <div className={className}>
          {value.value || '选择规格'}
          <i className="zenticon zenticon-plus" />
        </div>
      </Pop>
    );
  }
}

export default GoodsCell;
