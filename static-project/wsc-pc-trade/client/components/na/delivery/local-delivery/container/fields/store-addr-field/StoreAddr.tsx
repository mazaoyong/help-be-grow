import React, { Component } from 'react';
import { Sweetalert } from 'zent';
import { Form } from '@zent/compat';
import { IDeliveryShop } from 'definitions/local-delivery/config';
import { address, isExistAddr } from '../../../constants/global';
import { isWscBranchStore, checkWscBranchStore } from '@youzan/utils-shop';
import args from '@youzan/utils/url/args';
import _get from 'lodash/get';
import { BlankLink } from '@youzan/react-components';
import { isPureWscShop, isRetailSingleStore } from '@youzan/utils-shop';

type IProps = ZENT_FIELD_COMP<{
  value: IDeliveryShop;
}>;

const posotionSettingUrl = '/v4/setting/team?anchor=localDeliveryPosition#/payment';

const getStoreEditUrl = () => {
  const kdtId = Number(args.get('kdtId', window.location.href)) || _global.kdtId;
  const wscHqDeliverySetting = _get(_global, 'wscHqDeliverySetting', false);
  // 总部下查看分店同城配送，需要传shopInfo, _global.shopInfo是分店的shopInfo
  return checkWscBranchStore(_global.shopInfo) && wscHqDeliverySetting
    ? `/v4/shop/online-store#/edit/${kdtId}`
    : `${_global.url.www}/setting/store#contact`;
};
/**
 * 取货地址
 */
class StoreAddr extends Component<IProps> {
  onConfirm = () => {
    setTimeout(() => {
      const url = getStoreEditUrl();
      const win = window.open(url, '_blank');
      win && win.focus();
    }, 200);
  };

  showAlertInfo = () => {
    const content = (
      <div className={'custom-store-address__dialog'}>
        <p>取货地址修改后，将影响你以下两点：</p>
        <p>1.已设置的配送范围信息将被清空：请修改地址后记得重新配置配送范围；</p>
        <p>2.已开通的第三方配送都会重新审核，请准备3～7天审核期的其他配送方式；</p>
      </div>
    );
    // @ts-ignore
    Sweetalert.confirm({
      closeBtn: true,
      title: '地址修改提示',
      maskClosable: true,
      content,
      onConfirm: this.onConfirm,
      confirmText: '去修改',
      parentComponent: this,
    });
  };

  render() {
    const url = getStoreEditUrl();
    // 地图选点提示 仅零售单店或微商城非连锁店铺(不包括教育)可见
    const isShowPosotionSettingTips = isRetailSingleStore || (isPureWscShop && !isWscBranchStore);
    return (
      <div className="custom-store-address">
        <div>
          {isExistAddr ? (
            <>
              {address}
              <a onClick={this.showAlertInfo} href="javascript:void(0)">
                修改
              </a>
            </>
          ) : (
            <>
              无法获取地址信息
              <a target="_blank" rel="noopener noreferrer" href={url}>
                去设置
              </a>
            </>
          )}
        </div>
        {isShowPosotionSettingTips && (
          <div>
            为提高买家下单后同城配送的准确性，可开启买家同城定位选点功能
            <BlankLink className="custom-store-address__link" href={posotionSettingUrl}>
              去开启
            </BlankLink>
          </div>
        )}
      </div>
    );
  }
}

// @ts-ignore
export default Form.getControlGroup(StoreAddr);
