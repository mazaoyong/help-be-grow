import findIndex from 'lodash/findIndex';
import React, { PureComponent } from 'react';
import moneyFormat from '@youzan/utils/money/format';
import {
  Button,
  Checkbox,
  Dialog,
  Notify,
  Pop,
  Radio,
  Select,
  Sweetalert,
  ISelectProps,
  Icon,
} from 'zent';
import { Form } from '@zent/compat';
import { BlankLink } from '@youzan/react-components';
import { IDeliveryWayValue, IPartner } from 'definitions/local-delivery';

import PartnerList from './components/partner-list';
import { BUSINESS_TYPE } from './constants';

import * as api from '../../../api';
import { deliveryShopCommonParams, CLOUD_CHANNEL } from '../../../constants/form';
import { isExistAddr } from '../../../constants/global';
import { ISelectItem } from '../../../types';

import './styles.scss';

const RadioGroup = Radio.Group;
const { openDialog, closeDialog } = Dialog;
const prefix = 'custom-delivery-way';
const simulationDialogId = 'simulation-dialog-id';

/**
 * 生成自动呼叫的可选时间列表数据
 */
const genDelayTimeData = (num: number) => {
  const result: ISelectItem[] = new Array(Math.floor(num / 5)).fill(0).map((_, i) => ({
    value: i * 5,
    text: `${i * 5}`,
  }));
  return result;
};

const DELAY_TIME_OPTIONS = genDelayTimeData(60);
const SIMULATION_STRATEGY = [{ value: 1, text: '配费最低策略' }];

export interface IProps {
  value: IDeliveryWayValue;
  timingArrive: boolean;
  onChange: (v: IDeliveryWayValue) => void;
}

interface IState {
  saving: boolean;
  enableLoading: boolean;
  editingBusinessType: boolean;
  businessType: number;
  finallyBusinessType: number;
  partners: IPartner[];
  partnersLoading: boolean;
  popContentVisible: boolean;

  simulationLoading: boolean;
  strategyType: number;

  isOpenThird: boolean;
}

class DeliveryWay extends PureComponent<ZENT_FIELD_COMP<IProps>, IState> {
  constructor(props) {
    super(props);

    const { businessType } = props.value;
    const editingBusinessType = businessType === 0;

    this.state = {
      saving: false,
      enableLoading: false,
      popContentVisible: false,
      editingBusinessType,
      businessType,
      finallyBusinessType: businessType,
      partners: [],
      partnersLoading: false,
      // 仿真ing
      simulationLoading: false,
      // 仿真策略
      strategyType: 1,
      isOpenThird: false,
    };
  }

  /**
   * 可用的服务商（已开通且开启了服务）
   */
  get avaliablePartners() {
    return this.state.partners.filter(
      item => item.enable === 1 && item.status === 2 && !item.expired,
    );
  }

  /**
   * 优先呼叫服务商可选项
   */
  get preferredPartnerSelectOptions() {
    return [
      ...this.avaliablePartners.map(item => {
        return {
          ...item,
          value: item.isCloudTag ? item.appId : item.deliveryChannel,
          text: item.deliveryChannelName,
        };
      }),
      ...(this.props.value.alphaExpressEnable
        ? [
            {
              value: 0,
              text: '智选配送',
            },
          ]
        : []),
    ];
  }

  /**
   * 备选呼叫服务商可选项
   */
  get secondDistPartnerSelectOptions() {
    const { preferredDistChannel, preferAppId } = this.props.value;
    return [
      { value: 0, text: '无' },
      ...this.avaliablePartners
        .filter(item =>
          item.isCloudTag
            ? item.appId !== preferAppId
            : item.deliveryChannel !== preferredDistChannel,
        )
        .map(item => {
          return {
            ...item,
            value: item.isCloudTag ? item.appId : item.deliveryChannel,
            text: item.deliveryChannelName,
          };
        }),
    ];
  }

  componentDidMount() {
    if (isExistAddr) {
      this.getPartnerList().then(partners => {
        if (partners) {
          this.setState({
            isOpenThird: partners.some(partner => partner.enable === 1 && partner.status === 2),
          });
        }
      });
    }
  }

  /**
   * 更新数据
   */
  updatePropValue(newValue: Partial<IDeliveryWayValue>) {
    const data = Object.assign({}, this.props.value, newValue);
    this.props.onChange(data);
  }

  /**
   * 开关第三方同城配送
   */
  toggleOpenThird = evt => {
    this.setState({
      isOpenThird: evt.target.checked,
    });
  };

  /**
   * 切换业务类型的可编辑状态
   */
  toggleEditBusinessType = () => {
    this.setState({
      editingBusinessType: true,
    });
  };

  /**
   * 修改业务类型
   */
  selectBusinessType = evt => {
    this.setState({
      businessType: evt.target.value,
    });
  };

  /**
   * 保存业务类型
   */
  saveBusinessType = () => {
    const business = this.state.businessType;

    if (!business) {
      Notify.error('请选择业务类型');
      return;
    }

    const { contactName } = _global.shopInfo;
    if (!contactName) {
      // @ts-ignore
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

    this.setState({
      saving: true,
    });

    let savePromise: Promise<void>;

    if (this.state.finallyBusinessType === 0) {
      // 第一次保存
      savePromise = api.createLocalShop({
        ...deliveryShopCommonParams,
        business,
      });
    } else {
      savePromise = api.updateShop({
        ...deliveryShopCommonParams,
        business,
      });
    }

    // return api
    //   .saveBusinessType({
    //     kdtId: _global.kdtId,
    //     business,
    //   })
    return savePromise
      .then(() => {
        Notify.success('业务类型更改成功');
        this.setState(
          {
            editingBusinessType: false,
            finallyBusinessType: business,
          },
          () => {
            this.updatePropValue({ businessType: business });
            this.getPartnerList();
          },
        );
      })
      .catch(err => {
        Notify.error(err);
      })
      .finally(() => {
        this.setState({
          saving: false,
        });
      });
  };

  /**
   * 获取最新的服务商列表
   */
  getPartnerList = () => {
    this.setState({ partnersLoading: true });
    return api
      .getLocalPartnersList()
      .then(data => {
        this.setState(
          {
            partners: data,
          },
          // 放在 setState callback 是因为需要等待 state 更新后才能计算新的呼叫选项
          this.onPartnersChanged,
        );
        return data;
      })
      .catch(err => {
        Notify.error(err);
      })
      .finally(() => {
        this.setState({ partnersLoading: false });
      });
  };

  /**
   * 开启定时达
   */
  openTimingArrive = () => {
    window.scrollTo(0, 0);
  };

  /**
   * 切换自动呼叫开关
   */
  toggleAutoDeliveryEnable = event => {
    this.updatePropValue({ isAutoDeliveryEnable: event.target.value });
  };

  /**
   * 开启或关闭智选配送
   */
  toggleSmartDeliveryStatus = event => {
    const alphaExpressEnable = event.target.value;
    // 开启时，需先判断同城服务商开通数至少2家，否则无法开启
    const avaliablePartners = this.avaliablePartners;
    const { preferredDistChannel } = this.props.value;

    if (alphaExpressEnable && avaliablePartners.length < 2) {
      Notify.error('开启失败，请保证至少开启了2家同城服务商');
      return false;
    }

    // 关闭智选配送时，判断自动呼叫是否选择了智选配送
    if (preferredDistChannel === 0 && event.target.value === false) {
      Notify.error('请先移除自动呼叫的智选配送');
      return false;
    }

    this.updatePropValue({ alphaExpressEnable });
  };

  /**
   * 选择呼叫时间类型
   */
  selectCallTimeType = event => {
    this.updatePropValue({ callTimeType: event.target.value });
  };

  /**
   * 选择呼叫延迟时间
   */
  selectDelayTime: ISelectProps['onChange'] = event => {
    this.updatePropValue({ delayTime: event.target.value });
  };

  /**
   * 预约送达开始时间前的延时时间
   */
  selectAheadDeliveryStartTime: ISelectProps['onChange'] = event => {
    this.updatePropValue({ aheadDeliveryStartTime: event.target.value });
  };

  /**
   * 预约送达开始时间前的延时时间
   */
  selectAheadDeliveryEndTime: ISelectProps['onChange'] = event => {
    this.updatePropValue({ aheadDeliveryEndTime: event.target.value });
  };

  /**
   * 修改优先呼叫服务商
   */
  changePreferredDistChannel: ISelectProps['onChange'] = (event, item) => {
    const { secondDistChannel, secondAppId } = this.props.value;
    let preferredDistChannel, preferAppId;
    if (item.isCloudTag) {
      preferredDistChannel = CLOUD_CHANNEL;
      preferAppId = event.target.value;
    } else {
      preferredDistChannel = event.target.value;
      preferAppId = '';
    }
    if (
      item.isCloudTag ? secondAppId === preferAppId : secondDistChannel === preferredDistChannel
    ) {
      // 优先呼叫服务商选择了备选服务商时，备选服务商被清除
      this.updatePropValue({
        preferredDistChannel,
        preferAppId,
        secondDistChannel: 0,
        secondAppId: '',
      });
    } else {
      this.updatePropValue({ preferredDistChannel, preferAppId });
    }
  };

  /**
   * 修改备选呼叫服务商
   */
  changeSecondDistChannel: ISelectProps['onChange'] = (event, item) => {
    let secondDistChannel, secondAppId;
    if (item.isCloudTag) {
      secondDistChannel = CLOUD_CHANNEL;
      secondAppId = event.target.value;
    } else {
      secondDistChannel = event.target.value;
      secondAppId = '';
    }
    this.updatePropValue({ secondDistChannel, secondAppId });
  };

  /**
   * 服务商发生变化时，重新判断各个选项是否合法
   */
  onPartnersChanged = () => {
    // 获取当前已经选中的2个选项
    const { preferredDistChannel, preferAppId, secondDistChannel, secondAppId } = this.props.value;
    const { preferredPartnerSelectOptions, secondDistPartnerSelectOptions } = this;
    const avaliablePartners = this.avaliablePartners;

    const majorIsExist =
      findIndex(preferredPartnerSelectOptions, {
        value: preferredDistChannel === CLOUD_CHANNEL ? preferAppId : preferredDistChannel,
      }) > -1;
    if (!majorIsExist) {
      // 如果majorDist不存在，就报红让用户重新选
      this.updatePropValue({ preferredDistChannel: '', preferAppId: '' });
    }

    const juniorIsExist =
      findIndex(secondDistPartnerSelectOptions, {
        value: secondDistChannel === CLOUD_CHANNEL ? secondAppId : secondDistChannel,
      }) > -1;
    if (!juniorIsExist) {
      // 如果secDist不存在，就切换到无
      this.updatePropValue({ secondDistChannel: 0, secondAppId: '' });
    }

    if (avaliablePartners.length < 1) {
      this.updatePropValue({ isAutoDeliveryEnable: false });
    }
  };

  // 调整仿真策略
  handleChangeStrategyType = (_, selected: ISelectItem) => {
    this.setState({
      strategyType: selected.value as number,
    });
  };

  /**
   * 进行仿真请求
   */
  handleSimulation = () => {
    const { strategyType } = this.state;

    this.setState(
      {
        simulationLoading: true,
      },
      () => {
        api
          .querySimulation({
            strategyType,
          })
          .then(res => {
            const { startDate, endDate, savedMoney } = res;
            openDialog({
              dialogId: simulationDialogId,
              title: '仿真结果',
              children: (
                <div>
                  通过本店铺 {startDate} 至 {endDate}{' '}
                  的数据分析，若当时使用智选配送-配费最低策略可节约 {moneyFormat(savedMoney)} 元。
                </div>
              ),
              footer: (
                <Button
                  type="primary"
                  onClick={() => closeDialog(simulationDialogId, { triggerOnClose: true })}
                >
                  我知道了
                </Button>
              ),
            });
          })
          .catch(msg => {
            Notify.error(msg);
          })
          .finally(() => {
            this.setState({
              simulationLoading: false,
            });
          });
      },
    );
  };

  /**
   * 自动呼叫radio
   */
  renderAutoDeliveryRadio(isAutoDeliveryEnable: boolean, isCheckedProvider: boolean) {
    return (
      <div className="status-wrapper">
        <RadioGroup
          value={isAutoDeliveryEnable}
          onChange={this.toggleAutoDeliveryEnable}
          disabled={!isCheckedProvider}
        >
          <Radio value={true}>开启</Radio>
          <Radio value={false}>关闭</Radio>
        </RadioGroup>
        <p className="warning mt8">
          开启后将自动呼叫服务商，每个服务商呼叫10分钟，若无人接单则呼叫备选。若备选10分钟后仍无人接单将取消呼叫，由你手动处理。
        </p>
      </div>
    );
  }

  renderBusinessType() {
    const { saving, editingBusinessType, businessType } = this.state;
    return (
      <div className={`${prefix}__content--types clearfix`}>
        <label className="type-label">业务类型：</label>
        <div className="type-wrapper">
          {editingBusinessType ? (
            // 编辑状态
            <RadioGroup value={+businessType} onChange={this.selectBusinessType}>
              {Object.keys(BUSINESS_TYPE).map(key => (
                <Radio key={key} value={+key}>
                  {BUSINESS_TYPE[key]}
                </Radio>
              ))}
              <Button type="primary" size="small" loading={saving} onClick={this.saveBusinessType}>
                保存
              </Button>
            </RadioGroup>
          ) : (
            // 非编辑状态
            <p>
              <span className="type-name">{BUSINESS_TYPE[businessType]}</span>
              <a
                className="change"
                href="javascript:void(0);"
                onClick={this.toggleEditBusinessType}
              >
                修改
              </a>
            </p>
          )}
          <p className="warning">业务类型会影响配送费，请谨慎选择</p>
        </div>
      </div>
    );
  }

  /**
   * 智选配送
   */
  renderSmartDelivery() {
    const { simulationLoading, strategyType } = this.state;
    const {
      value: { alphaExpressEnable },
    } = this.props;
    return (
      <div className={`${prefix}__content--auto`}>
        <label className="type-label">智选配送：</label>
        <div className="type-wrapper">
          <div className="status-wrapper">
            <RadioGroup value={alphaExpressEnable} onChange={this.toggleSmartDeliveryStatus}>
              <Radio value={true}>开启</Radio>
              <Radio value={false}>关闭</Radio>
            </RadioGroup>
          </div>
          {alphaExpressEnable ? (
            <div className="smart-simulation-info">
              请选择希望的智选偏向：
              <Select
                width={130}
                autoWidth
                data={SIMULATION_STRATEGY}
                value={strategyType}
                onChange={this.handleChangeStrategyType}
                className="smart-simulation-select-wrap"
                popupClassName="smart-simulation-select-pop"
              />
              {simulationLoading ? (
                <span style={{ color: '#999' }}>仿真中，请稍候...</span>
              ) : (
                <span>
                  根据历史数据进行仿真，看看能减少多少
                  <span className="simulation-btn" onClick={this.handleSimulation}>
                    进行仿真
                  </span>
                </span>
              )}
            </div>
          ) : (
            <p className="warning">
              还在为不知道哪家配送服务便宜而纠结吗，开启智选配送，系统帮你算出最优方案。
            </p>
          )}
        </div>
      </div>
    );
  }

  /**
   * 自动呼叫
   */
  renderAutoDelivery() {
    const {
      value: { isAutoDeliveryEnable },
    } = this.props;
    const preferredPartners = this.preferredPartnerSelectOptions;
    const hasAvaliablePartner = preferredPartners.length > 0;
    return (
      <div className={`${prefix}__content--auto`}>
        <label className="type-label">自动呼叫：</label>
        <div className="type-wrapper">
          {hasAvaliablePartner ? (
            this.renderAutoDeliveryRadio(isAutoDeliveryEnable, hasAvaliablePartner)
          ) : (
            <Pop
              trigger="hover"
              position="bottom-left"
              content={'当前暂未开通第三方配送商'}
              wrapperClassName={'pop-wraper'}
            >
              {this.renderAutoDeliveryRadio(isAutoDeliveryEnable, hasAvaliablePartner)}
            </Pop>
          )}
        </div>
      </div>
    );
  }

  /**
   * 呼叫顺序
   */
  renderAutoCallQueue() {
    const {
      value: { preferredDistChannel, preferAppId, secondDistChannel, secondAppId },
    } = this.props;
    const preferredPartners = this.preferredPartnerSelectOptions;
    const secondDistPartners = this.secondDistPartnerSelectOptions;
    return (
      <div className={`${prefix}__content--auto`}>
        <label className="type-label-select">呼叫顺序：</label>
        <div className="type-wrapper">
          <div className="delay-settings">
            优先呼叫
            <Select
              data={preferredPartners}
              value={preferredDistChannel === CLOUD_CHANNEL ? preferAppId : preferredDistChannel}
              onChange={this.changePreferredDistChannel}
              width={88}
            />
            配送，备选呼叫
            <Select
              data={secondDistPartners}
              value={secondDistChannel === CLOUD_CHANNEL ? secondAppId : secondDistChannel}
              onChange={this.changeSecondDistChannel}
              disabled={!secondDistPartners.length || !(preferredPartners.length > 1)}
              width={88}
            />
          </div>
        </div>
      </div>
    );
  }

  /**
   * 呼叫时间-非定时达配置项
   */
  renderNormalCallOption() {
    const {
      value: { delayTime },
      timingArrive,
    } = this.props;
    return (
      <div>
        <Radio value={1} className="radio">
          <span className="radio_prev">支付成功</span>
          <Select
            data={DELAY_TIME_OPTIONS}
            value={delayTime !== 0 && !delayTime ? 20 : delayTime}
            disabled={timingArrive}
            onChange={this.selectDelayTime}
            width={88}
          />
          分钟后，开始呼叫
        </Radio>
      </div>
    );
  }

  /**
   * 呼叫时间-定时达配置项
   */
  renderAutoCallOption() {
    const {
      value: { aheadDeliveryStartTime, aheadDeliveryEndTime },
      timingArrive,
    } = this.props;
    return (
      <div>
        <div className="call_time_row">
          <Radio value={2} className="radio" disabled={!timingArrive}>
            <span className="radio_prev">按照预计送达开始时间，提前</span>
            <Select
              data={DELAY_TIME_OPTIONS}
              value={
                aheadDeliveryStartTime !== 0 && !aheadDeliveryStartTime
                  ? 20
                  : aheadDeliveryStartTime
              }
              disabled={!timingArrive}
              onChange={this.selectAheadDeliveryStartTime}
              width={88}
            />
            分钟，开始呼叫
          </Radio>
        </div>
        <div className="call_time_row">
          <Radio value={3} className="radio" disabled={!timingArrive}>
            <span className="radio_prev">按照预计送达结束时间，提前</span>
            <Select
              data={DELAY_TIME_OPTIONS}
              value={
                aheadDeliveryEndTime !== 0 && !aheadDeliveryEndTime ? 20 : aheadDeliveryEndTime
              }
              disabled={!timingArrive}
              onChange={this.selectAheadDeliveryEndTime}
              width={88}
            />
            分钟，开始呼叫
          </Radio>
        </div>
      </div>
    );
  }

  /**
   * 呼叫时间-ALL
   */
  renderAutoCallTime() {
    const {
      value: { callTimeType },
      timingArrive,
    } = this.props;
    const normalCallPopContent = (
      <div className="pop_content">
        <div className="pop_content_text">
          当前已开启定时达，关闭定时达功能可使用该配置项，是否关闭？
        </div>
        <div className="pop_content_btns">
          <Button className="pop_content_btn" type="primary" onClick={this.openTimingArrive}>
            去关闭
          </Button>
        </div>
      </div>
    );
    const autoCallPopContent = (
      <div className="pop_content">
        <div className="pop_content_text">开启定时达功能可使用该设置项，是否开启？</div>
        <div className="pop_content_btns">
          <Button className="pop_content_btn" type="primary" onClick={this.openTimingArrive}>
            去开启
          </Button>
        </div>
      </div>
    );
    return (
      <div className={`${prefix}__content--auto`}>
        <label className="type-label-select">呼叫时间：</label>
        <div className="type-wrapper">
          <RadioGroup
            disabled={timingArrive}
            value={timingArrive ? (callTimeType === 1 ? 2 : callTimeType) : 1}
            onChange={this.selectCallTimeType}
          >
            {!timingArrive ? (
              this.renderNormalCallOption()
            ) : (
              <Pop
                trigger="hover"
                position="top-left"
                className="pop"
                content={normalCallPopContent}
              >
                {this.renderNormalCallOption()}
              </Pop>
            )}
            {timingArrive ? (
              this.renderAutoCallOption()
            ) : (
              <Pop trigger="hover" position="top-left" className="pop" content={autoCallPopContent}>
                {this.renderAutoCallOption()}
              </Pop>
            )}
          </RadioGroup>
        </div>
      </div>
    );
  }

  render() {
    const {
      value: { isAutoDeliveryEnable },
    } = this.props;
    const { finallyBusinessType, partners, partnersLoading, isOpenThird } = this.state;
    const preferredPartners = this.preferredPartnerSelectOptions;
    const hasAvaliablePartner = preferredPartners.length > 0;
    const showEditContent = isExistAddr && isOpenThird;
    const link = 'https://www.youzan.com/intro/rule/detail?alias=76eedh29&pageType=rules';
    return (
      <div className={prefix}>
        <div className={`${prefix}__business`}>
          <Checkbox checked disabled>
            商家自配送
          </Checkbox>
        </div>
        <div className={`${prefix}__third`}>
          <Checkbox
            disabled={!isExistAddr}
            checked={showEditContent}
            onChange={this.toggleOpenThird}
          >
            第三方同城配送
          </Checkbox>
          {!isExistAddr && (
            <div className="address">
              无法获取地址信息
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`${_global.url.www}/setting/store#contact`}
              >
                去设置
              </a>
            </div>
          )}
        </div>
        {showEditContent && (
          <div className={`${prefix}__content`}>
            <div className="desc">
              开启后可以选择第三方配送帮你配送，该服务产生的配送费用将从店铺余额/服务商余额中扣除，请保证店铺余额充足。
              注：商家自结算模式除外。
              <Pop
                trigger="hover"
                className="pop-self-settlement"
                position="top-right"
                centerArrow={true}
                content="自结算模式：商家自行与配送服务商签订合作协议，获取对应平台帐号，有赞提供系统对接服务。在有赞系统内关联该帐号，服务保障、资金结算等均以商家与服务商自行约定的条款为准，有赞仅做发单、轨迹数据同步等信息传递。"
              >
                <Icon type="help-circle" />
              </Pop>
              开启后表示已同意
              <a target="_blank" rel="noopener noreferrer" href={link}>
                《第三方配送服务协议》
              </a>
            </div>
            {this.renderBusinessType()}
            <div className={`${prefix}__content--types clearfix`}>
              <label className="type-label">开通服务商：</label>
              <div className="type-wrapper" id="partner-list">
                <PartnerList
                  getPartnerList={this.getPartnerList}
                  partners={partners}
                  loading={partnersLoading}
                  businessType={+finallyBusinessType}
                />
                <p className="youzan-app-store-tip">
                  更多服务商，请前往&nbsp;
                  <BlankLink href="https://yingyong.youzan.com/category/638991?categoryId=639328">
                    有赞应用市场
                  </BlankLink>
                  &nbsp;订购
                </p>
              </div>
            </div>

            {/* 零售还不支持自动呼叫，需要禁用 */ !_global.isSuperStore &&
              this.renderSmartDelivery()}
            {this.renderAutoDelivery()}
            {hasAvaliablePartner && isAutoDeliveryEnable && (
              <React.Fragment>
                {this.renderAutoCallQueue()}
                {this.renderAutoCallTime()}
              </React.Fragment>
            )}
          </div>
        )}
      </div>
    );
  }
}

// @ts-ignore
export default Form.getControlGroup(DeliveryWay);
