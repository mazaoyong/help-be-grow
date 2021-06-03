import React from 'react';
import ajax from 'zan-pc-ajax';
import { Notify } from 'zent';
import { DesignEditor } from '../editor-base/design-editor';
import ComponentTitle from '../common/component-title';
import { WEAPP_VERSION_MAP, IS_WEAPP_SETTING } from '../common/config';
import { COM_STATUS } from '../common/constants';

export default class UnicashierEditor extends DesignEditor {
  componentWillMount() {
    const { value = {} } = this.props;
    const { activity = '', enable = false } = value;
    if (!enable || !activity) {
      this.getUnicashierActivity();
    }
  }

  getUnicashierActivity = () => {
    ajax({
      url: `${window._global.url.www}/apps/cashier/qrCodeListV2.json`,
      method: 'GET',
      data: {
        need_promotion_info: true,
        qr_types: [8],
      },
    })
      .then(({ qr_code_d_t_o_s: qrcodeList = [] }) => {
        if (qrcodeList.length === 0) {
          return;
        }

        const qrcodeData = qrcodeList[0] || {};
        if (qrcodeData.promotionInfo_d_t_o) {
          this.props.onChange({
            activity: qrcodeData.promotionInfo_d_t_o.enable
              ? qrcodeData.promotionInfo_d_t_o.desc
              : '',
            qrcodeId: qrcodeData.qr_id || 0,
            enable: qrcodeData.promotionInfo_d_t_o.enable,
          });
        }
      })
      .catch(msg => {
        Notify.error(msg);
      });
  };

  render() {
    const { value, globalConfig } = this.props;
    const { qrcodeId, activity, enable } = value;
    const noticeMsg =
      globalConfig.is_weapp_setting === IS_WEAPP_SETTING
        ? `（需要小程序 v${WEAPP_VERSION_MAP.unicashier} 版本及以上）`
        : '';
    return (
      <div className="rc-design-component-unicashier-editor">
        <ComponentTitle
          name="买单"
          noticeMsg={noticeMsg}
          url="https://help.youzan.com/qa?cat_sys=K#/menu/3045/detail/11762?_k=89wyun"
        />
        <div className="unicashier-editor-content">
          当前买单活动：{enable ? activity || '无' : '无优惠'}
          <span className="refresh-btn" onClick={() => this.getUnicashierActivity()}>
            刷新
          </span>
          <a
            className="change-activity-btn"
            href={`${_global.url.www}/apps/cashier#/weapp`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {qrcodeId === 0 ? '新建活动' : '修改活动'}
          </a>
        </div>
        <p className="notice-msg">仅小程序支持买单功能，该组件只在小程序显示</p>
      </div>
    );
  }

  static getInitialValue() {
    return {
      type: 'unicashier',
      qrcodeId: 0,
      activity: '',
      enable: true,
    };
  }

  static info = {
    icon: 'https://img.yzcdn.cn/public_files/12fb7fb0d03b9df3f8a959f6ee288bb1.png',
    type: 'unicashier',
    name: '买单',
    description: '买单',
    maxNum: 1,
    usedNum: 0,
    status: COM_STATUS.NORMAL,
  };
}
