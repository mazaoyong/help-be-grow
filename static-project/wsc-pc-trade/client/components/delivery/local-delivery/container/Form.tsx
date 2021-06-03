import React, { PureComponent } from 'react';
import { Button, Notify, Pop } from 'zent';
import { Form } from '@zent/compat';

import FooterButtonContainer from 'components/footer-button-container';
import { ILocalDeliveryFormData, IRegionSettingData } from 'definitions/local-delivery';
import { IBusinessHour } from 'definitions/delivery-time/index';

import AppointmentLongField from './fields/appointment-long-field';
import AppointmentOrderField from '../../common/appointment-order-field';
import DeliveryModeField from './fields/delivery-mode-field';
import DeliveryWeightField from './fields/delivery-weight-field';
import DeliverySimple from './fields/delivery-simple';
import TimeField from 'components/delivery/common/time-field';
import DeliveryWayField from './fields/delivery-way-field';
import DivideUnitField from './fields/divide-unit-field';
import RegionSettingField from './fields/region-setting-field';
import StoreAddrField from './fields/store-addr-field';
import TimingArriveField from './fields/timing-arrive-field';
import TicketPrintConfig from 'components/delivery/common/ticket-print-config';

import { isEduShop, isRetailSingleStore } from '@youzan/utils-shop';
import { COVERS_TYPE, DELIVERY_MODE, CLOUD_CHANNEL } from '../constants/form';
import { isNil } from 'lodash';
import './styles.scss';

// 是否开启履约备货提醒，零售单店白名单生效
const isShowAutoPrintTicket = isRetailSingleStore && window._global.isShowAutoPrintTicket;

interface IProps {
  saving: boolean;
  onSubmit: () => void;
  onChange: (data) => void;
  data: ILocalDeliveryFormData;
}

class LocalDeliveryForm extends PureComponent<ZENTFORM<IProps>> {
  mapWrapperRef = React.createRef<HTMLDivElement>();
  deliveryWayFieldRef = React.createRef<any>();

  refreshMapWrapperStyle() {
    const seniorDiv = this.mapWrapperRef.current;
    // 使用display的形式去隐藏区域选择组件
    if (this.props.data.mode !== DELIVERY_MODE.SIMPLE) {
      seniorDiv && (seniorDiv.style.display = 'block');
    } else {
      seniorDiv && (seniorDiv.style.display = 'none');
    }
  }

  componentDidMount() {
    this.refreshMapWrapperStyle();
  }

  componentDidUpdate() {
    this.refreshMapWrapperStyle();
  }

  /**
   * 配送方式校验
   */
  validatorDeliveryWay() {
    const {
      deliveryWay: { businessType },
    } = this.props.data;
    const isOpenThird =
      this.deliveryWayFieldRef.current &&
      this.deliveryWayFieldRef.current.getWrappedComponent().getControlInstance().state.isOpenThird;

    // 只在开启状态才去校验是否有选择类型
    return isOpenThird && +businessType < 1 ? '请选择配送类型' : null;
  }

  /**
   * 校验配送区域设置表单
   */
  validatorRegionSetting() {
    const { mode, seniorData } = this.props.data;
    const {
      regions,
      covers,
      baseDist,
      gradDist,
      basePrice,
      gradPrice,
    } = seniorData as IRegionSettingData;
    const baseDistNum = baseDist && parseFloat(baseDist);
    const gradDistNum = gradDist && parseFloat(gradDist);
    const basePriceNum = basePrice && parseFloat(basePrice);
    const gradPriceNum = gradPrice && parseFloat(gradPrice);

    // 非简易版，且有设置配送区域时，对配送区域进行校验
    if (mode !== DELIVERY_MODE.SIMPLE && regions.length !== 0 && covers.length !== 0) {
      // 不同区域
      if (mode === DELIVERY_MODE.AREA) {
        for (let i = 0; i < regions.length; i++) {
          const region = regions[i];
          const startPrice = parseFloat(region.startPrice as string);
          const deliveryPrice = parseFloat(region.deliveryPrice as string);
          if (region.operatorType === 'DELETE') {
            continue;
          }

          if (!region.areaName || region.areaName.length < 1 || region.areaName.length > 30) {
            return '区域名称必须输入1-30个字';
          }
          if (!(region.startPrice !== '' && startPrice >= 0 && startPrice <= 49999)) {
            return '只能输入0.00-49999元之间的起送价';
          }
          if (!(region.deliveryPrice !== '' && deliveryPrice >= 0 && deliveryPrice <= 9999)) {
            return '只能输入0.00-9999元之间的配送费';
          }
        }
      } else {
        if (!(baseDistNum !== '' && baseDistNum >= 0 && baseDistNum <= 9999)) {
          return '只能输入0-9999之间的公里数';
        }
        if (!(basePriceNum !== '' && basePriceNum >= 0 && basePriceNum <= 9999)) {
          return '只能输入0-9999之间价格';
        }
        if (!(gradDistNum !== '' && gradDistNum >= 0.1 && gradDistNum <= 9999)) {
          return '只能输入0.1-9999之间的每增加公里数';
        }
        if (!(gradPriceNum !== '' && gradPriceNum >= 0 && gradPriceNum <= 9999)) {
          return '只能输入0-9999之间的价格';
        }

        for (let i = 0; i < regions.length; i++) {
          const region = regions[i];
          const startPrice = parseFloat(region.startPrice as string);
          if (region.operatorType === 'DELETE') {
            continue;
          }

          if (!region.areaName || region.areaName.length < 1 || region.areaName.length > 30) {
            return '区域名称必须输入1-30个字';
          }
          if (!(region.startPrice !== '' && startPrice >= 0 && startPrice <= 49999)) {
            return '只能输入0.00-49999元之间的起送价';
          }
        }
      }

      for (let i = 0; i < covers.length; i++) {
        const item = covers[i];

        if (item.type === COVERS_TYPE.Polygon && item.path.length > 100) {
          return '多边形小圆点太多了，点击小圆点删除几个试试';
        }
      }
    }
  }

  /**
   * 校验预约下单时间和最长预约
   */
  validatorOrder() {
    const {
      timingArrive,
      appointmentOrder: { type: orderType, day: orderDay },
      appointmentLong: { type: longType, day: longDay },
    } = this.props.data;
    let result: React.ReactNode = null;

    if (
      timingArrive && // 开启了定时达
      orderType === 'day' && // 预约下单时间单位为天
      (longType === 'none' || (longType === 'day' && longDay <= orderDay)) // 最长预约为当天或小于预约下单的提前时间时
    ) {
      result = '预约下单时间必须小于最长预约';
    }

    return result;
  }

  submit = () => {
    const errors = [
      this.validatorDeliveryWay(),
      this.validatorRegionSetting(),
      this.validatorOrder(),
    ];

    // @ts-ignore
    Notify.clear();

    for (let i = 0; i < errors.length; i++) {
      if (errors[i]) {
        return Notify.error(errors[i]);
      }
    }

    this.props.onSubmit();
  };

  render() {
    // @ts-ignore
    const localFeeWeight = !isEduShop; // 同城计费项目白名单 在白名单内且是非教育类店铺
    const { data, saving, handleSubmit } = this.props;
    const {
      deliveryWay,
      mode,
      seniorData,
      valuationRules,
      regionName,
      id,
      intro,
      img,
      startPrice,
      deliveryPrice,
      timingArrive,
      deliveryTimes,
      divideUnit,
      appointmentOrder,
      appointmentLong,
      ticketPrintConfig,
    } = data;

    return (
      <Form className="local-delivery-form" horizontal onSubmit={handleSubmit(this.submit)}>
        <StoreAddrField
          className="local-delivery-form__address"
          label="取货地址："
          name="storeAddr"
          value={deliveryWay}
        />
        <TimingArriveField
          className="local-delivery-form__timing"
          label="定时达："
          name="timingArrive"
          value={timingArrive}
        />
        {timingArrive && (
          <div>
            <TimeField
              className="local-delivery-form__times"
              label="配送时段："
              name="deliveryTimes"
              value={deliveryTimes as IBusinessHour}
              forbidTomorrowInTimePicker
            />
            <DivideUnitField
              className="local-delivery-form__unit"
              label="时段细分："
              name="divideUnit"
              value={divideUnit}
            />
            <AppointmentOrderField
              className="local-delivery-form__appointment"
              label="预约下单："
              name="appointmentOrder"
              value={appointmentOrder}
              required
              validations={{
                validatorPreferredDistChannel(_values, value) {
                  const {
                    cutOffRuleModel: {
                      afterAheadMin,
                      afterAheadMinType,
                      beforeAheadMin,
                      beforeAheadMinType,
                    },
                    inventoryRuleModel: {
                      materialAheadMin,
                      materialAheadMinType,
                      planAheadMin,
                      planAheadMinType,
                    },
                  } = value;

                  if (
                    (afterAheadMin === beforeAheadMin &&
                      afterAheadMinType === beforeAheadMinType) ||
                    (materialAheadMin === planAheadMin && materialAheadMinType === planAheadMinType)
                  ) {
                    return false;
                  }

                  return true;
                },
              }}
            />
            <AppointmentLongField
              className="local-delivery-form__appointment"
              label="最长预约："
              name="appointmentLong"
              value={appointmentLong}
              // @ts-ignore
              helpDesc={
                (appointmentLong && appointmentLong.day) >= 90 ? (
                  <span className="red">
                    注意：订单下单超过三个月后部分支付渠道不支持线上退款，若需要退款，可联系买家走完线上流程收到货款，并线下处理退款。
                  </span>
                ) : (
                  <span>如，可预约7天内订单，那么就是今天＋未来6天内的送达时间可以让买家选择</span>
                )
              }
            />
          </div>
        )}
        {/* <p className={`delivery-tool__guide ${mode === 3 ? 'delivery-tool-simple__guide' : ''}`}>
          如果需要设置阶梯运费优惠或者包邮规则，可以到
          <a href="/v4/ump/postagetool#/list">“包邮工具”</a>去设置
        </p> */}
        <DeliveryModeField
          className="local-delivery-form__mode"
          label="配送模板："
          name="mode"
          value={mode}
        />
        {/* 地图组件在任何条件下都会被渲染，减少因为配送区域设置切换导致的性能消耗 */}
        <div ref={this.mapWrapperRef}>
          <RegionSettingField
            className="local-delivery-form__region"
            label="费用配置："
            name="seniorData"
            mode={mode}
            value={seniorData}
            deliveryWay={deliveryWay}
            helpDesc="注：配送区域内的收货地址才能进行同城配送订单。"
          />
        </div>
        {mode === 3 && (
          <DeliverySimple {...{ regionName, id, intro, img, startPrice, deliveryPrice }} />
        )}
        {mode !== 3 && localFeeWeight && (
          <DeliveryWeightField
            label="续重收费："
            name="valuationRules"
            className="local-delivery-form__weight"
            helpDesc={
              <span>
                说明：1. 最终费用 = 收费标准 + 续重收费（数值为0时表示不使用续重收费）
                <Pop
                  trigger="hover"
                  position="top-right"
                  content={
                    <div className="weight-fee-example">
                      如配置商品重量为 3kg 内时不额外收费，
                      <br />
                      超出时每 1kg 额外收取 1 元。
                      <br />
                      则商品为 3kg 按原收费标准；商品为
                      <br />
                      3.4kg 时额外收取 1 元；商品为 5kg 时额外
                      <br />
                      收取 2 元同城配送费。
                    </div>
                  }
                >
                  <a href="javascript:;">查看示例</a>
                </Pop>
                <br />
                <span style={{ marginLeft: '35px' }}>
                  2. 需要对续重收费的商品开启该功能，并设置商品重量。
                </span>
              </span>
            }
            value={valuationRules}
          />
        )}
        <DeliveryWayField
          className="local-delivery-form__third"
          label="配送方式："
          name="deliveryWay"
          value={deliveryWay}
          timingArrive={timingArrive}
          ref={this.deliveryWayFieldRef}
          validations={{
            validatorPreferredDistChannel(_values, value) {
              if (value.isAutoDeliveryEnable) {
                const preferredDistChannel = value.preferredDistChannel;
                const channel =
                  preferredDistChannel === CLOUD_CHANNEL ? value.preferAppId : preferredDistChannel;
                if (channel !== '' && !isNil(channel)) {
                  return true;
                }
              } else {
                return true;
              }
            },
          }}
          validationErrors={{
            validatorPreferredDistChannel: '请选择优先呼叫服务商',
          }}
        />

        {isShowAutoPrintTicket && (
          <Form.Field
            className="local-delivery-form__autoprint"
            label="拣货小票: "
            name="ticketPrintConfig"
            canSelectAll={timingArrive}
            value={ticketPrintConfig}
            component={TicketPrintConfig.Field}
          />
        )}
        <FooterButtonContainer className="local-delivery__bottom-container">
          <Button type="primary" htmlType="submit" loading={saving}>
            保存
          </Button>
        </FooterButtonContainer>
      </Form>
    );
  }
}

// @ts-ignore
export default Form.createForm({ scrollToError: true })(LocalDeliveryForm) as React.ComponentClass<
  IProps
>;
