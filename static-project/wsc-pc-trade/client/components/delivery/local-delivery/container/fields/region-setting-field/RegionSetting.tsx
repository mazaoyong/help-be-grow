import React, { Component } from 'react';
import { Form } from '@zent/compat';
import { MultiRegion, BlankLink } from '@youzan/react-components';

import { IDeliveryWayValue, IRegionSettingData } from 'definitions/local-delivery';

import { isExistAddr } from '../../../constants/global';

const prefix = 'custom-region-setting';

export interface IProps {
  mode: number;
  value: IRegionSettingData;
  onChange: (v: IRegionSettingData) => void;
  deliveryWay: IDeliveryWayValue;
}

class RegionSetting extends Component<ZENT_FIELD_COMP<IProps>> {
  shouldComponentUpdate(nextProps) {
    if (nextProps.mode === this.props.mode && nextProps.value === this.props.value) {
      return false;
    }
    return true;
  }

  handleMapChange = data => {
    this.props.onChange(data);
  };

  render() {
    const { value, mode } = this.props;

    /**
     * 容错机制
     * MultiRegion组件的mode参数只接收1或2
     */
    const fixedMode = mode !== 3 ? mode : 1;

    return (
      <div className={prefix}>
        {isExistAddr ? (
          <MultiRegion newVersion mode={fixedMode} data={value} onChange={this.handleMapChange} />
        ) : (
          <div className="no-address">
            无法获取发货地址信息，不能设置配送区域哦
            <BlankLink href={`${window._global.url.www}/setting/store#contact`}>去设置</BlankLink>
          </div>
        )}
      </div>
    );
  }
}

// @ts-ignore
export default Form.getControlGroup(RegionSetting);
