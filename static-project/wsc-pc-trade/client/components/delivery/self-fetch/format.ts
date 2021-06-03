import {
  ISelfFetchPointInfoDTO,
  ISelfFetchSetting,
  IBizOpeningTimeSection,
  IBizTimeRange,
} from 'definitions/self-fetch/api';

import { Mode, ITimeRange, IWeekTimeRange } from 'definitions/delivery-time';

import { ISelfFetchPoint } from 'definitions/self-fetch';
import { get } from 'lodash';
import { isRetailSingleStore } from '@youzan/utils-shop';

import {
  getHourMinute,
  getTimeString,
  formatTimes,
  formatTimeBuckets,
} from 'components/delivery/common/time-field/util';

// 是否开启履约备货提醒，零售单店白名单生效
const isShowAutoPrintTicket = isRetailSingleStore && window._global.isShowAutoPrintTicket;

const dayMap = {
  周一: 1,
  周二: 2,
  周三: 3,
  周四: 4,
  周五: 5,
  周六: 6,
  周日: 0,
};

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const formatBizOpeningTimeSectionsDaily = (
  mode: Mode,
  openingTimeSections: IBizOpeningTimeSection[] = [],
) => {
  if (mode === Mode.FULLTIME || mode === Mode.DAILY_REPEAT) {
    const timeSections = get(openingTimeSections[0], 'timeSections', []);
    return (timeSections as IBizTimeRange[]).map(range => {
      return {
        id: `${range.openTime}-${range.closeTime}`,
        start: getHourMinute(range.openTime),
        end: {
          date: range.dayCross === 1 ? 'tomorrow' : 'today',
          ...getHourMinute(range.closeTime),
        },
      };
    });
  }
  return [];
};

const formatBizOpeningTimeSectionsWeekly = (
  mode: Mode,
  openingTimeSections: IBizOpeningTimeSection[] = [],
) => {
  if (mode === Mode.WEEKLY_REPEAT) {
    return openingTimeSections.map((openingTimeSection, index) => {
      return {
        id: index,
        days: openingTimeSection.weekdays.map(weekday => dayMap[weekday]),
        times: openingTimeSection.timeSections.map(range => {
          return {
            id: `${range.openTime}-${range.closeTime}`,
            start: getHourMinute(range.openTime),
            end: {
              date: range.dayCross === 1 ? 'tomorrow' : 'today',
              ...getHourMinute(range.closeTime),
            },
          };
        }),
      };
    });
  }
  return [];
};

const formatBusinessHour = (
  mode: Mode,
  dailyValue: ITimeRange[],
  weeklyValue: IWeekTimeRange[],
) => {
  if (mode === Mode.FULLTIME) {
    return [
      {
        weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        timeSections: [
          {
            openTime: '00:00',
            closeTime: '23:59',
            dayCross: 0,
          },
        ],
      },
    ];
  } else if (mode === Mode.DAILY_REPEAT) {
    return [
      {
        weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        timeSections: dailyValue.map(time => {
          return {
            openTime: getTimeString(time.start),
            closeTime: getTimeString(time.end),
            dayCross: time.end.date === 'tomorrow' ? 1 : 0,
          };
        }),
      },
    ];
  } else if (mode === Mode.WEEKLY_REPEAT) {
    return weeklyValue.map(weekTimeRange => {
      return {
        weekdays: weekTimeRange.days.map(day => weekDays[(day + 6) % 7]),
        timeSections: weekTimeRange.times.map(time => {
          return {
            openTime: getTimeString(time.start),
            closeTime: getTimeString(time.end),
            dayCross: time.end.date === 'tomorrow' ? 1 : 0,
          };
        }),
      };
    });
  }
};

export function formatSelfFetchPointRequest(data: ISelfFetchPoint) {
  const {
    ruleType,
    aheadMin,
    aheadMinType,
    cutOffRuleModel,
    inventoryRuleModel,
  } = data.reservation;
  const formatData = {
    info: {
      id: data.id,
      address: data.address,
      description: data.description,
      isSuperStore: data.superStore,
      isStore: data.isStore,
      images: (data.image && data.image.split(',')) || [],
      name: data.name,
      phone: data.phone,
      selfFetchHours: formatTimes(data.selfFetchTimes),
      selfFetchTimeRequired: data.isOptionSelfFetchTime,
    },
    setting: {
      aheadMax: data.maxReservation[data.maxReservation.type] || 0,
      aheadMaxType: data.maxReservation.type,
      isOpen: data.isOptionSelfFetchTime,
      timeBucket: formatTimes(data.selfFetchTimes),
      timeSpan: data.timeDivide,
      // 历史原因，无需提前根据 aheadMinType 是否等于 'none' 来判断
      ruleType: ruleType === 'none' ? 0 : ruleType,
      aheadMinType: ruleType === 'none' ? 'none' : aheadMinType,
      aheadMin: ruleType === 'none' ? 2 : aheadMin,
      cutOffRuleModel,
      inventoryRuleModel,
    },
  };
  const mode = get(data, 'businessHour.mode', Mode.FULLTIME);
  const dailyValue = get(data, 'businessHour.dailyValue', []);
  const weeklyValue = get(data, 'businessHour.weeklyValue', []);
  Object.assign(formatData.info, {
    bizTimeSetting: {
      timeRangeType: mode,
      openingTimeSections: formatBusinessHour(mode, dailyValue, weeklyValue),
    },
  });
  if (!formatData.info.id) {
    delete formatData.info.id;
  }
  if (isShowAutoPrintTicket) {
    Object.assign(formatData, {
      ticketPrintConfig: get(data, 'ticketPrintConfig', {}),
    });
  }
  return formatData;
}

export function formatSelfFetchPointResponse(
  info: ISelfFetchPointInfoDTO,
  setting: ISelfFetchSetting,
) {
  const mode = get(info, 'bizTimeSetting.timeRangeType', Mode.FULLTIME);
  const bizOpeningTimeSections = get(info, 'bizTimeSetting.openingTimeSections', []);
  const cutOffRuleModel = setting.cutOffRuleModel;
  const inventoryRuleModel = setting.inventoryRuleModel;
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
  return {
    ...info,
    businessHour: {
      mode,
      dailyValue: formatBizOpeningTimeSectionsDaily(mode, bizOpeningTimeSections),
      weeklyValue: formatBizOpeningTimeSectionsWeekly(mode, bizOpeningTimeSections),
    },
    isOptionSelfFetchTime: setting.isOpen || false,
    selfFetchTimes: formatTimeBuckets(setting.timeBucket),
    timeDivide: setting.timeSpan || 'hour',
    reservation: {
      // 历史原因，无需提前根据 aheadMinType 是否等于 'none' 来判断
      ruleType: setting.ruleType || (setting.aheadMinType === 'none' ? 'none' : 0),
      aheadMinType: setting.aheadMinType === 'none' ? 'hour' : setting.aheadMinType,
      aheadMin: setting.aheadMin || 2,
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
    },
    maxReservation: {
      day: setting.aheadMaxType === 'day' ? setting.aheadMax : 1,
      type: setting.aheadMaxType || 'none',
    },
  };
}
