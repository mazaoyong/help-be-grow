import isNil from 'lodash/isNil';

import {
  ICoordinate,
  IDeliveryWayValue,
  ILocalDeliveryFormData,
  IRegion,
  IRegionSettingData,
} from 'definitions/local-delivery';
import {
  IAreaModel,
  IAutoCallConfig,
  IConfig,
  IDeliveryConfig,
  IDeliveryShop,
  IValuationRuleModel,
  IValuationWeightRule,
} from 'definitions/local-delivery/config';
import { gaodeLat, gaodeLng } from './constants/global';
import { formatTimes, formatTimeBuckets } from 'components/delivery/common/time-field/util';
import { setToFixed } from './utils';

// 换算到分钟数
const TIME_BASE = 60 * 1000;

/**
 * 高德 => 百度 经纬度转换
 */
export function gaodeToBaidu(node: ICoordinate): ICoordinate<string> {
  const lng = +node[0] + 0.0065;
  const lat = +node[1] + 0.006;

  return [lng.toFixed(6), lat.toFixed(6)];
}

/**
 * 百度 => 高德 经纬度转换
 */
export function baiduToGaode(node: ICoordinate): ICoordinate<string> {
  const lng = +node[0] - 0.0065;
  const lat = +node[1] - 0.006;

  return [lng.toFixed(6), lat.toFixed(6)];
}

/**
 * 获取默认的覆盖物数据
 */
function getDefaultConfig(center: ICoordinate): IRegionSettingData['config'] {
  const lng = +center[0];
  const lat = +center[1];

  return {
    circle: {
      type: 1,
      radius: 1000,
      center: [lng, lat],
    },
    polygon: {
      type: 2,
      path: [
        [lng - 0.0104, lat + 0.009],
        [lng + 0.0104, lat + 0.009],
        [lng + 0.0104, lat - 0.009],
        [lng - 0.0104, lat - 0.009],
      ],
    },
  };
}

// 生成默认区域块数据
function getDefaultBlock(config: IRegionSettingData['config']) {
  return {
    regions: [
      {
        startPrice: '',
        deliveryPrice: '',
      } as IRegion,
    ],
    covers: [config.polygon],
  };
}

/**
 * 计算时间
 * @param time
 * @param defaultTime
 */
function getDefaultTime(time, defaultTime = 20 * TIME_BASE) {
  return isNaN(time) || time === undefined ? defaultTime * TIME_BASE : time * TIME_BASE;
}

/**
 * 转换配送方式数据结构
 */
function getDeliveryWay(data: IDeliveryShop, autoCallConfig: IAutoCallConfig): IDeliveryWayValue {
  let callTimeType = 1;
  const { business: businessType = 0 } = data;
  const {
    enable: isAutoDeliveryEnable = false,
    alphaExpressEnable = false,
    preferredDistChannel,
    preferAppId,
    secondDistChannel,
    secondAppId,
    delayTime = 20 * TIME_BASE, // 默认延时20分钟
    aheadDeliveryStartTime,
    aheadDeliveryEndTime,
  } = autoCallConfig;

  if (aheadDeliveryStartTime !== undefined) {
    callTimeType = 2;
  } else if (aheadDeliveryEndTime !== undefined) {
    callTimeType = 3;
  }

  return {
    businessType: +businessType,
    callTimeType,
    isAutoDeliveryEnable,
    alphaExpressEnable,
    preferredDistChannel,
    preferAppId,
    secondDistChannel,
    secondAppId,
    delayTime: delayTime / TIME_BASE,
    aheadDeliveryStartTime: aheadDeliveryStartTime / TIME_BASE,
    aheadDeliveryEndTime: aheadDeliveryEndTime / TIME_BASE,
  };
}

/**
 * 转换配送设置数据结构
 */
function getDeliverySetting(model: IAreaModel[], center: ICoordinate) {
  // 简易版
  let id: number | string = '';
  let intro = '';
  let regionName = '';
  let operatorType = '';
  let img = '';
  let startPrice: number | string = '';
  let deliveryPrice: number | string = '';
  // 高级版
  let regions: IRegion[] = [];
  let covers: IRegionSettingData['covers'] = [];
  let mark: IAreaModel;
  let mode = 1;
  let baseDist: string | number = '';
  let basePrice: string | number = '';
  let gradDist: string | number = '';
  let gradPrice: string | number = '';
  const config = getDefaultConfig(center);

  if (model.length !== 0) {
    mark = model[0];
    mode = mark.calcType;
    baseDist = !isNil(mark.firstDistance) ? mark.firstDistance / 1000 : '';
    basePrice = !isNil(mark.firstFee) ? mark.firstFee / 100 : '';
    gradDist = !isNil(mark.additionalDistance) ? mark.additionalDistance / 1000 : '';
    gradPrice = !isNil(mark.additionalFee) ? mark.additionalFee / 100 : '';

    model.forEach(item => {
      const type = item.areaType;
      const circleModel = item.circleAreaModel;
      const polygonModel = item.polygonAreaModel;

      if (type !== 3) {
        regions.push({
          startPrice: item.startFee !== null ? item.startFee / 100 : '',
          deliveryPrice: item.fixedFee !== null && mode === 1 ? item.fixedFee / 100 : '',
          areaName: item.areaName || '',
          id: item.id,
          operatorType: item.id ? 'UPDATE' : '',
        });
        if (type === 1) {
          if (!circleModel) {
            covers = getDefaultBlock(config).covers;
          } else {
            covers.push({
              type,
              radius: circleModel.scope,
              center: baiduToGaode([circleModel.lng, circleModel.lat]),
            });
          }
        } else {
          if (!polygonModel) {
            // eslint-disable-line
            covers = getDefaultBlock(config).covers;
          } else {
            covers.push({
              type,
              path: polygonModel.pointModelList.map(node => {
                return baiduToGaode([node.lng, node.lat]);
              }),
            });
          }
        }
      } else {
        // 简易版
        mode = 3;
        id = mark.id;
        intro = `${mark.desc}`;
        regionName = `${mark.areaName || ''}`;
        operatorType = 'UPDATE';
        img = `${mark.attachPic}`;
        startPrice = mark.startFee !== null ? mark.startFee / 100 : '';
        deliveryPrice = mark.fixedFee !== null ? mark.fixedFee / 100 : '';
        regions = getDefaultBlock(config).regions;
        covers = getDefaultBlock(config).covers;
      }
    });
  } else {
    // 默认区域
    regions = getDefaultBlock(config).regions;
    covers = getDefaultBlock(config).covers;
  }

  return {
    mode,
    seniorData: {
      focus: 0,
      regions,
      covers,
      baseDist,
      basePrice,
      gradDist,
      gradPrice,
      config,
      center,
    },
    id,
    intro,
    regionName,
    operatorType,
    img,
    startPrice,
    deliveryPrice,
  };
}

/**
 * 转换定时达数据结构
 */
function getTimingArrive(data: IConfig) {
  const timingArrive = data.isOpen || false;
  const divideUnit = data.timeSpan || 'hour';
  const cutOffRuleModel = data.cutOffRuleModel;
  const inventoryRuleModel = data.inventoryRuleModel;
  const {
    hour = 12,
    minute = 0,
    beforeAheadMinType = 'hour',
    beforeAheadMin = 2,
    afterAheadMinType = 'day',
    afterAheadMin = 1,
  } = cutOffRuleModel || {};
  const {
    materialAheadMinType = 'hour',
    materialAheadMin = 2,
    planAheadMinType = 'day',
    planAheadMin = 1,
  } = inventoryRuleModel || {};

  const appointmentOrder = {
    // 历史原因，无需提前根据 aheadMinType 是否等于 'none' 来判断
    ruleType: data.ruleType || (data.aheadMinType === 'none' ? 'none' : 0),
    aheadMinType: data.aheadMinType === 'none' ? 'hour' : data.aheadMinType,
    aheadMin: data.aheadMin || 2,
    cutOffRuleModel: {
      hour,
      minute,
      beforeAheadMinType,
      beforeAheadMin,
      afterAheadMinType,
      afterAheadMin,
    },
    inventoryRuleModel: {
      materialAheadMinType,
      materialAheadMin,
      planAheadMinType,
      planAheadMin,
    },
  };
  const appointmentLong = {
    type: data.aheadMaxType || 'none',
    day: data.aheadMaxType === 'day' ? data.aheadMax : 7,
  };
  const deliveryTimes = formatTimeBuckets(data.timeBucket);

  return {
    timingArrive,
    divideUnit,
    deliveryTimes,
    appointmentOrder,
    appointmentLong,
  };
}

function formatValuationRulesInput(rules: IValuationRuleModel[]) {
  return rules.map(rule => {
    return {
      id: rule.id,
      valuationWeightRules: formatValuationWeightRulesInput(rule.valuationWeightRules),
      valuationType: rule.valuationType,
    };
  });
}

function formatValuationWeightRulesInput(rules: IValuationWeightRule[]) {
  return rules.map(rule => {
    return {
      perFee: setToFixed(rule.perFee / 100, 2),
      weightEnd: rule.weightEnd,
      weightStart: setToFixed(rule.weightStart / 1000, 3),
      weightUnit: setToFixed(rule.weightUnit / 1000, 0),
    };
  });
}

function formatValuationWeightRulesOutput(rules: IValuationWeightRule[]) {
  return rules.map(rule => {
    return {
      perFee: Math.round(rule.perFee * 100),
      weightEnd: rule.weightEnd,
      weightStart: Math.round(rule.weightStart * 1000),
      weightUnit: Math.round(rule.weightUnit * 1000),
    };
  });
}

function formatInputData(data: IDeliveryConfig) {
  const deliveryWayConfig = data.deliveryShop || {};
  const deliveryAutoConfig = data.autoCallConfig || {};
  const deliverySettingConfig = data.config || {};
  const ticketPrintConfig = data.ticketPrintConfig || {};
  const areaModelList = deliverySettingConfig.areaModelList || [];
  let rules: IValuationRuleModel[] = [
    {
      id: null,
      valuationType: 1, // 1 按重计费 （目前只有一个值）
      valuationWeightRules: [
        {
          perFee: 0,
          weightEnd: -1, // -1 无上限
          weightStart: 0,
          weightUnit: 0,
        },
      ],
    },
  ];
  if (deliverySettingConfig.valuationRules && deliverySettingConfig.valuationRules.length > 0) {
    rules = deliverySettingConfig.valuationRules;
  }
  const valuationRules = formatValuationRulesInput(rules);
  const deliveryWay = getDeliveryWay(deliveryWayConfig, deliveryAutoConfig);
  const deliverySetting = getDeliverySetting(areaModelList, [gaodeLng, gaodeLat]);
  const timingArrive = getTimingArrive(deliverySettingConfig);

  return {
    deliveryWay,
    valuationRules,
    ticketPrintConfig,
    ...deliverySetting,
    ...timingArrive,
  };
}

function formatOutputData(
  origin: IDeliveryConfig,
  data: ILocalDeliveryFormData,
): Omit<IDeliveryConfig, 'deliveryShop'> {
  const {
    deliveryWay: {
      isAutoDeliveryEnable,
      alphaExpressEnable,
      callTimeType,
      delayTime,
      aheadDeliveryStartTime,
      aheadDeliveryEndTime,
      preferredDistChannel,
      preferAppId,
      secondDistChannel,
      secondAppId,
    },
    mode,
    seniorData: { baseDist, basePrice, gradDist, gradPrice, regions, covers },
    valuationRules,
    id,
    intro,
    regionName,
    // @ts-ignore
    operatorType,
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
  const originConfig = origin.config || {};

  /**
   * 工作日转换
   * [1, 2, 3] => '0111000'
   */
  const timeBucket = formatTimes(deliveryTimes);

  // 覆盖物数据格式转换
  let areaParamList: Array<Partial<IAreaModel>>;
  if (mode !== 3) {
    areaParamList = regions.map((region, idx) => {
      const cover = covers[idx];
      const block: Partial<IAreaModel> = {
        desc: '',
        areaType: cover.type,
        calcType: mode,
        startFee:
          region.startPrice !== ''
            ? Math.round(parseFloat(region.startPrice as string) * 100)
            : undefined,
        fixedFee:
          region.deliveryPrice !== ''
            ? Math.round(parseFloat(region.deliveryPrice as string) * 100)
            : undefined,
        areaName: region.areaName,
        operatorType: region.operatorType,
        id: region.id,
      };

      if (cover.type === 1) {
        block.circleAreaParam = {
          lng: parseFloat(gaodeToBaidu(cover.center)[0]),
          lat: parseFloat(gaodeToBaidu(cover.center)[1]),
          scope: cover.radius,
        };
      } else {
        block.polygonAreaParam = {
          pointParamList: cover.path.map(node => {
            return {
              lng: parseFloat(gaodeToBaidu(node)[0]),
              lat: parseFloat(gaodeToBaidu(node)[1]),
            };
          }),
        };
      }

      if (mode === 2) {
        block.firstDistance = Math.round(parseFloat(baseDist) * 1000);
        block.firstFee = Math.round(parseFloat(basePrice) * 100);
        block.additionalDistance = Math.round(parseFloat(gradDist) * 1000);
        block.additionalFee = Math.round(parseFloat(gradPrice) * 100);
        delete block.fixedFee;
      }

      // 过滤值为空的字段
      Object.keys(block).forEach(key => {
        if (block[key] === null) {
          delete block[key];
        }
      });

      return block;
    });
  } else {
    areaParamList = [
      {
        id: parseInt(id),
        desc: intro,
        areaName: regionName,
        operatorType: operatorType ? 'UPDATE' : 'INSERT',
        areaType: 3, // 写死
        calcType: 1, // 写死
        startFee: Math.round(Number(startPrice) * 100),
        fixedFee: Math.round(Number(deliveryPrice) * 100),
        attachPic: img,
      },
    ];
  }
  const {
    ruleType,
    aheadMin,
    aheadMinType,
    cutOffRuleModel,
    inventoryRuleModel,
  } = appointmentOrder;
  const maxType = appointmentLong.type;
  // @ts-ignore
  const config: IConfig = {
    id: originConfig.id,
    kdtId: originConfig.kdtId,
    offlineId: originConfig.offlineId,
    isOpen: timingArrive,
    timeSpan: (timingArrive && divideUnit) || 'day',
    aheadMaxType: (timingArrive && maxType) || 'none',
    aheadMax: appointmentLong[maxType] || 0,
    timeBucket,
    areaParamList,
    // 历史原因，无需提前根据 aheadMinType 是否等于 'none' 来判断
    ruleType: ruleType === 'none' ? 0 : ruleType,
    aheadMinType: ruleType === 'none' ? 'none' : aheadMinType,
    aheadMin: ruleType === 'none' ? 2 : aheadMin,
    cutOffRuleModel,
    inventoryRuleModel,
  };

  const rules = valuationRules.map(rule => {
    return {
      id: rule.id,
      valuationWeightRules: formatValuationWeightRulesOutput(rule.valuationWeightRules),
      valuationType: rule.valuationType,
    };
  });
  config.valuationRules = rules;

  const autoCallConfig: IAutoCallConfig = {
    enable: !!isAutoDeliveryEnable, // 是否启用
    alphaExpressConfigDTO: { valid: !!alphaExpressEnable }, // 是否开启智选配送
    // 优先会叫渠道 0：智选配送  1：达达  2：蜂鸟
    // @ts-ignore
    preferredDistChannel:
      isNil(preferredDistChannel) || preferredDistChannel === '' ? null : preferredDistChannel,
    preferAppId,
    // @ts-ignore
    secondDistChannel: secondDistChannel || null,
    secondAppId,
  };

  // 呼叫时间，定时达开启后可以选择 "送达开始时间"和"送达结束时间"，否则只能选择"支付成功后"
  if (timingArrive) {
    switch (callTimeType) {
      case 1:
      case 2:
        autoCallConfig.aheadDeliveryStartTime = getDefaultTime(aheadDeliveryStartTime, 20);
        break;
      case 3:
        autoCallConfig.aheadDeliveryEndTime = getDefaultTime(aheadDeliveryEndTime, 20);
        break;
    }
  } else {
    autoCallConfig.delayTime = getDefaultTime(delayTime, 20);
  }

  return {
    config,
    autoCallConfig,
    ticketPrintConfig,
  };
}

export { formatInputData, formatOutputData };