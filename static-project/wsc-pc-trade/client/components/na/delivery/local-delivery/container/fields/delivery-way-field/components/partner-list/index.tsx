import React, { PureComponent } from 'react';
import {
  LayoutRow as Row,
  LayoutCol as Col,
  BlockLoading,
  Notify,
  Sweetalert,
  Pop,
  ClampLines,
} from 'zent';
import { IPartner } from 'definitions/local-delivery';

import * as api from '../../../../../api';
import { deliveryShopCommonParams } from '../../../../../constants/form';
import { PARTNER_STATUS } from '../../constants';
import FeeInfo from '../fee-info';

import './styles.scss';

interface IProps {
  businessType: number;
  /** 通知父组件服务商列表发生变化 */
  getPartnerList: () => Promise<any>;
  partners: IPartner[];
  loading: boolean;
}

/**
 * 服务商列表
 */
class PartnerList extends PureComponent<IProps> {
  static defaultProps = {
    businessType: 0,
  };

  /**
   * 开关服务商服务状态
   */
  togglePartner = (appId: string, channel: number, enable: number) => {
    const toggleEnable = enable === 1 ? 0 : 1;
    return api
      .togglePartners({
        appId,
        channel,
        enable: toggleEnable,
      })
      .then(data => {
        if (data) {
          Notify.success('切换成功');
          return this.props.getPartnerList();
        } else {
          Notify.error('申请失败，请稍候再试');
        }
      })
      .catch(err => {
        Notify.error(err);
      });
  };

  /**
   * 申请开通服务商
   */
  enablePartner = (
    appId: string,
    displayName: string,
    deliveryChannel: number,
    isCloudTag: boolean,
  ) => {
    const { contactName } = deliveryShopCommonParams;
    if (!contactName) {
      Sweetalert.confirm({
        title: '操作失败',
        content: <p>缺少负责人姓名，请前往店铺主体信息里完善负责人姓名</p>,
        closeBtn: true,
        maskClosable: true,
        confirmText: '立即前往',
        onConfirm: () => {
          window.open(`${_global.url.www}/setting/store/index#/`, '_blank');
        },
      });
      return;
    }
    return api
      .enablePartner({
        ...deliveryShopCommonParams,
        business: this.props.businessType,
        appId,
        displayName,
        deliveryChannel,
        isCloudTag,
      })
      .then(data => {
        if (data) {
          Notify.success('申请成功');
          return this.props.getPartnerList();
        } else {
          Notify.error('申请失败，请稍候再试');
        }
      })
      .catch(err => {
        Notify.error(err);
      });
  };

  /**
   * 渲染某个服务商信息
   */
  renderProviderX = (item: IPartner, index: number) => {
    let status = item.status;
    // -1 表示没有申请过，除1，2，3之外的状态码全部表示审核中，1也是审核中
    if (status === -1) {
      status = 0;
    }

    let currentStatus = PARTNER_STATUS[status] || PARTNER_STATUS[1];

    let action: React.ReactNode = '';
    let reason: string = item.isCitySupport ? '' : '没有配送点为你配送，请试试开通其他配送';

    if (item.reason !== '' && reason === '') {
      reason = item.reason || '';
    }

    if (status === 2) {
      // 开通成功
      action = (
        <a
          href="javascript:void(0);"
          onClick={() => this.togglePartner(item.appId, item.deliveryChannel, item.enable || 0)}
        >
          {item.enable ? '关闭服务' : '开启服务'}
        </a>
      );
    } else if (
      (status === 3 || status === 0) &&
      item.isCitySupport &&
      this.props.businessType !== 0
    ) {
      // 开通失败或者还没有开通
      const submit = () =>
        this.enablePartner(
          item.appId,
          item.deliveryChannelName,
          item.deliveryChannel,
          item.isCloudTag,
        );
      const onSubmitClick = () => {
        // 美团需额外提醒(5: 美团配送)
        if (+item.deliveryChannel === 5) {
          Sweetalert.confirm({
            content: (
              <p>请确保填写的取货地址包含详细的街道、门牌号信息，如果缺失将会导致审核失败。</p>
            ),
            onConfirm: submit,
            confirmText: '开通',
            parentComponent: this,
          });
        } else {
          submit();
        }
      };
      action = (
        <a href="javascript:void(0);" onClick={onSubmitClick}>
          申请开通
        </a>
      );
    } else {
      // 其他的状态码都表示待审核
      if (reason === '') {
        reason = item.auditPeriod;
      }
      action = <span className="disabled-button">申请开通</span>;
    }
    if (item.expired) {
      currentStatus = PARTNER_STATUS[4];
      action = (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://yingyong.youzan.com/cloud-app-detail/${item.appId}`}
        >
          前往续订
        </a>
      );
    }
    return (
      <Row className="partner-line" key={`provider-${index}`}>
        <Col span={5} className="partner-name">
          {item.deliveryChannelName}
          {item.isCloudTag ? (
            <Pop trigger="hover" position="top-center" content="此为应用市场订购的物流服务商">
              <div className="partner-cloud-tag">自购</div>
            </Pop>
          ) : null}
        </Col>
        <Col className="partner-reason" span={12}>
          <p style={{ color: currentStatus.color }}>{currentStatus.type}</p>
          {reason !== '' ? <ClampLines className="partner-msg" lines={1} text={reason} /> : null}
        </Col>
        <Col span={4}>
          <FeeInfo
            appId={item.appId}
            isCloudTag={item.isCloudTag}
            channelId={item.deliveryChannel}
            businessType={this.props.businessType}
          />
        </Col>
        <Col span={4}>{action}</Col>
      </Row>
    );
  };

  render() {
    const { loading, partners } = this.props;
    return (
      <div className="partner-list">
        <BlockLoading loading={loading}>{partners.map(this.renderProviderX)}</BlockLoading>
      </div>
    );
  }
}

export default PartnerList;
