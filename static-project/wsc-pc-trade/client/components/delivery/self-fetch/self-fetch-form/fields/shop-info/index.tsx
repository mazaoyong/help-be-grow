import React, { Component } from 'react';
import _at from 'lodash/at';
import _every from 'lodash/every';
import _get from 'lodash/get';
import './styles.scss';

interface IProps {
  shopInfo: any;
  shopContact: any;
  id: number;
}
/**
 * 店铺信息
 */
class ShopInfo extends Component<IProps> {
  render() {
    const { shopInfo, shopContact, id } = this.props;
    const isExistAddr = _every(
      _at(shopContact, ['setAddress', 'setAreaCode', 'setCounty', 'setCountyId']),
    );
    const areaCode = shopContact.areaCode !== '' ? `${shopContact.areaCode}-` : '';
    const area = `${shopInfo.province}${shopInfo.city}${shopInfo.county}${shopInfo.address}`;
    const address = `${area}（电话：${areaCode}${shopContact.phoneNumber}）`;
    const wscHqDeliverySetting = _get(_global, 'wscHqDeliverySetting', false);
    return (
      <div className="zent-form__control-group ">
        <label className="zent-form__control-label">提货地址：</label>
        <div className="zent-form__controls">
          <div className="shop-info">
            {isExistAddr ? (
              <>
                {address}&nbsp;&nbsp;
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={
                    wscHqDeliverySetting
                      ? `/v4/shop/online-store#/edit/${id}`
                      : `${_global.url.www}/setting/store#contact`
                  }
                >
                  修改
                </a>
              </>
            ) : (
              <>
                无法获取地址信息&nbsp;&nbsp;
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={
                    wscHqDeliverySetting
                      ? `/v4/shop/online-store#/edit/${id}`
                      : `${_global.url.www}/setting/store#contact`
                  }
                >
                  去设置
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

// @ts-ignore
export default ShopInfo;
