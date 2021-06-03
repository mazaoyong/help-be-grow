import React, { PureComponent } from 'react';
import {
  LayoutRow as Row,
  LayoutCol as Col,
  BlockLoading,
  Button,
  Dialog,
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
import BindShopForm from '../bind-shop-form';
import { isWscBranchStore } from '@youzan/utils-shop';

import './styles.scss';

const shopBindDialogId = 'SHOP_BIND_DIALOG';
const { openDialog, closeDialog } = Dialog;
const businessBindDialogId = 'BUSINESS_BIND_DIALOG';
const goAuthorizeDialogId = 'GO_AUTHORIZE_DIALOG';
const LOCAL_DELIVERY_URL = '/v4/trade/local-delivery';
const HASH = '#partner-list';

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

  componentDidMount() {
    const { hash, href, search } = window.location;
    // 将query移到hash值前面
    if (hash.indexOf(HASH) !== -1 && hash.indexOf('?') > hash.indexOf('#')) {
      const reg = href.match(/(\?.+)/);
      const query = reg && reg[1];
      window.location.href = `${LOCAL_DELIVERY_URL}${query ? query : ''}${HASH}`;
    } else if (hash === HASH) {
      window.location.href = `${LOCAL_DELIVERY_URL}${search}${HASH}`;
    }
  }

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
   * 绑定商家帐号/解绑商家帐号(针对自结算)
   * @param item
   * @param index
   */
  deAuthorize = (deliveryChannel: number) => {
    openDialog({
      dialogId: businessBindDialogId,
      title: '解绑商家帐号',
      style: { width: '560px' },
      children:
        '解除授权后，所有已绑定的门店将会自动解绑。如需再次授权同一商家帐号，请先在达达管理平台将开发者解绑。请谨慎操作，确定解绑？',
      footer: (
        <div>
          <Button onClick={() => closeDialog(businessBindDialogId)}>取消</Button>
          <Button
            type="primary"
            onClick={() => {
              api
                .deAuthorize({ deliveryChannel })
                .then(data => {
                  if (data) {
                    Notify.success('解绑成功');
                    closeDialog(businessBindDialogId);
                    return this.props.getPartnerList();
                  } else {
                    Notify.error('解绑失败');
                  }
                })
                .catch(e => {
                  Notify.error(e);
                });
            }}
          >
            解除授权
          </Button>
        </div>
      ),
    });
  };

  /**
   * 点击去授权，打开弹窗&获取授权参数
   * @param deliveryChannel
   */
  goAuthorize(deliveryChannel: number) {
    openDialog({
      dialogId: goAuthorizeDialogId,
      title: '提示',
      children: '请在新窗口中完成达达（自结算）授权。',
      footer: (
        <div>
          <Button onClick={() => this.getAuthorizeParams(deliveryChannel)}>
            遇到问题，点击重试
          </Button>
          <Button
            type="primary"
            onClick={() => {
              closeDialog(goAuthorizeDialogId);
              window.location.hash = HASH;
              window.location.reload();
            }}
          >
            已完成授权
          </Button>
        </div>
      ),
    });
    this.getAuthorizeParams(deliveryChannel);
  }

  /**
   * 获取授权参数
   * @param deliveryChannel
   */
  getAuthorizeParams(deliveryChannel: number) {
    return api
      .getAuthorizeParams({ deliveryChannel })
      .then(data => {
        if (data) {
          let url = `${data.authorityUrl}?`;
          for (const key in data) {
            if (key !== 'authorityUrl') {
              url += `${key}=${data[key]}&`;
            }
          }
          url += `redirectUrl=${window.location.origin}${LOCAL_DELIVERY_URL}${encodeURIComponent(
            HASH,
          )}`;
          window.open(url);
        } else {
          Notify.error('跳转失败，请稍后重试');
        }
      })
      .catch(e => {
        Notify.error(e);
      });
  }

  /**
   * 刷新授权结果
   * @param deliveryChannel
   */
  refreshAuthorizeResult(deliveryChannel: number) {
    return api
      .refreshAuthorizeResult({ deliveryChannel })
      .then(data => {
        if (data) {
          return this.props.getPartnerList().then(() => {
            Notify.success('刷新授权结果成功');
          });
        }
      })
      .catch(e => {
        Notify.error(e);
      });
  }

  /**
   * 绑定门店/解绑门店(针对自结算)
   * @param item
   * @param index
   */
  saveOrUpdateBandShop = (
    deliveryChannel: number,
    appId: string,
    displayName: string,
    isCloudTag: boolean,
    operation: Array<{
      type: string;
    }>,
  ) => {
    const { businessType } = this.props;
    const params = {
      ...deliveryShopCommonParams,
      deliveryChannel,
      appId,
      displayName,
      isCloudTag,
      business: businessType,
    };
    const title =
      operation.findIndex(item => item.type === 'BIND_SHOP') !== -1 ? '绑定门店' : '更换门店';
    openDialog({
      dialogId: shopBindDialogId,
      title,
      children: (
        <BindShopForm
          onCancelClick={() => {
            closeDialog(shopBindDialogId);
          }}
          params={params}
          onSubmit={() => {
            Notify.success(`${title}成功`);
            closeDialog(shopBindDialogId);
            return this.props.getPartnerList();
          }}
        />
      ),
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

    let reason: string = item.isCitySupport ? '' : '没有配送点为你配送，请试试开通其他配送';
    let action: React.ReactNode = '';
    const isSelfSettlement = +item.deliveryChannel === 11;
    const ifSupportLocalDelivery = +this.props.businessType !== 0; // 0表示未选择业务类型
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

    let shopAction: React.ReactNode = '';
    let refresh: React.ReactNode = '';
    let statusTips: Array<{ content: string }> | [] = [];
    if (isSelfSettlement) {
      // deliveryChanner = 11 针对达达自结算服务商
      const operations = item.operationView?.operations || [];
      const statusOperations = item.statusView?.operations || [];
      statusTips = item.statusView?.tips || [];
      const operationTips = item.operationView?.tips || [];
      if (operations.findIndex(item => item.type === 'GOTO_AUTHORIZE') !== -1) {
        action = ifSupportLocalDelivery ? (
          <a href="javascript:void(0);" onClick={() => this.goAuthorize(item.deliveryChannel)}>
            去授权
          </a>
        ) : (
          <span className="disabled-button">去授权</span>
        );
      } else if (operations.findIndex(item => item.type === 'RELEASE_AUTHORIZATION') !== -1) {
        action = (
          <a href="javascript:void(0);" onClick={() => this.deAuthorize(item.deliveryChannel)}>
            解除授权
          </a>
        );
      }
      if (statusOperations.findIndex(item => item.type === 'REFRESH_AUTHORIZATION_RESULT') !== -1) {
        refresh = ifSupportLocalDelivery ? (
          <a
            className="refresh"
            href="javascript:void(0);"
            onClick={() => this.refreshAuthorizeResult(item.deliveryChannel)}
          >
            刷新授权结果
          </a>
        ) : (
          <span className="disabled-button refresh">刷新授权结果</span>
        );
      }
      if (
        operations.findIndex(item => item.type === 'BIND_SHOP') !== -1 ||
        operations.findIndex(item => item.type === 'CHANGE_SHOP') !== -1
      ) {
        shopAction = (
          <a
            href="javascript:void(0);"
            onClick={() =>
              this.saveOrUpdateBandShop(
                item.deliveryChannel,
                item.appId,
                item.deliveryChannelName,
                item.isCloudTag,
                item.operationView.operations,
              )
            }
          >
            {operations.findIndex(item => item.type === 'BIND_SHOP') !== -1
              ? '绑定门店'
              : '更换门店'}
          </a>
        );
      }
      if (isWscBranchStore) {
        action = (
          <div className="operation-tips">
            {(operationTips[0] && operationTips[0].content) || ''}
          </div>
        );
      }
    }
    return (
      <Row className="partner-line" key={`provider-${index}`}>
        <Col span={6} className="partner-name">
          {item.deliveryChannelName}
          {item.isCloudTag ? (
            <Pop trigger="hover" position="top-center" content="此为应用市场订购的物流服务商">
              <div className="partner-cloud-tag">自购</div>
            </Pop>
          ) : null}
        </Col>
        <Col className="partner-reason" span={12}>
          <span style={{ color: currentStatus.color }}>{currentStatus.type}</span>
          {refresh}
          {isSelfSettlement ? (
            <div>
              {(statusTips as Array<{ content: string }>).map(
                (value: { content: string }, index: number) => {
                  return (
                    <ClampLines
                      className="partner-msg"
                      lines={1}
                      text={value.content}
                      key={index}
                    />
                  );
                },
              )}
            </div>
          ) : reason !== '' ? (
            <ClampLines className="partner-msg" lines={1} text={reason} />
          ) : null}
        </Col>
        <Col span={4}>
          {isSelfSettlement ? (
            '-'
          ) : (
            <FeeInfo
              appId={item.appId}
              isCloudTag={item.isCloudTag}
              channelId={item.deliveryChannel}
              businessType={this.props.businessType}
            />
          )}
        </Col>
        <Col span={8} className="partner-operation">
          <span className={isWscBranchStore ? '' : 'shop-action'}>{shopAction}</span>
          {action}
        </Col>
      </Row>
    );
  };

  render() {
    const { loading, partners } = this.props;

    return (
      <div className="partner-list">
        <BlockLoading loading={loading}>
          <Row className="partner-head">
            <Col span={6} className="partner-name">
              服务商
            </Col>
            <Col span={12} className="partner-reason">
              状态
            </Col>
            <Col span={4}>配费说明</Col>
            <Col span={8} className="partner-operation">
              操作
            </Col>
          </Row>
          {partners.map(this.renderProviderX)}
        </BlockLoading>
      </div>
    );
  }
}

export default PartnerList;
