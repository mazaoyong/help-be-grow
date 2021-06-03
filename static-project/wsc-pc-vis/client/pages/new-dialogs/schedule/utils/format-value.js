import get from 'lodash/get';
import omit from 'lodash/omit';
import isNil from 'lodash/isNil';
import accNumber from '@youzan/utils/number';
import date from '@youzan/utils/date';
import { format as formatTime, addMinutes } from 'date-fns';
import getRoundedInt from 'fns/get-rounded-int';

// 重复配置属性名对照表
const configTypes = ['noRepeatConfig', 'dayRepeatConfig', 'weekRepeatConfig'];
// 所有的重复配置的属性合集
// ⚠️如果需要改变以下的字段池，请同步修改fieldReflect映射对象，
// 并且保证repeatFields数组是向后增加的而不是中间插入以保证不发生错误
const repeatFields = [
  'startDate',
  'endDate',
  'endType',
  'startTime',
  'endTime',
  'totalTimes',
  'date',
];
const formateTime = (index, time) => {
  if (!time) {
    return void 0;
  }
  return formatTimeGap(time.split('-')[index]);
};

// 校验是否只是日期，不带时间
const onlyDate = function(val) {
  const onlyDateLike = /^\d+-\d+-\d+$/;
  return typeof val === 'string' && onlyDateLike.test(val);
};

// 值对照表
const fieldReflect = {
  startDate: 'noRepeat.startDate',
  endDate: 'repeatDay.endDate',
  endType: 'repeatDay.endType',
  startTime: ['noRepeat.schoolTime', formateTime.bind(null, 0)],
  endTime: ['noRepeat.schoolTime', formateTime.bind(null, 1)],
  totalTimes: ['repeatDay.totalTimes', val => val || 0],
  date: 'noRepeat.startDate',
};

// 格式化hh:mm时间
function formatTimeGap(time) {
  if (!time) return '';
  if (time.split(':').length === 3) {
    return time;
  }
  return `${time}:00`;
}

/**
 * 用于抛弃HH:mm:ss中的:ss部分
 *
 * @param {string} time 时间
 */
export function formatToTimeGap(time) {
  if (time) {
    return time.replace(/(:\d{2})$/, '');
  }
  return void 0;
}

/**
 * 用于格式化重复配置对象
 *
 * @param {Object} repeatConfig 重复配置
 */
function fromatRepeatConfig(repeatConfig) {
  const { type, repeatWeek, repeatDay } = repeatConfig;
  const res = { type };
  const config = {};
  // 需要的属性
  // 不同的排课方式需要的字段各不相同，需要在所有字段的字段池中选中需要的字段
  const pickProp = [
    [6, 4, 3],
    [1, 2, 4, 3, 0, 5],
    [1, 2, 0, 5],
  ][type - 1];
  pickProp.forEach(propIndex => {
    const propKey = repeatFields[propIndex];
    // 拿到属性在repeatConfig对象中的点运算字符
    let valuePath = fieldReflect[propKey];
    let callBack = null;
    if (Array.isArray(valuePath)) {
      // 如果是数组形式，表示当前的值需要经过函数处理才是最终的值
      callBack = valuePath[1];
      valuePath = valuePath[0];
    }
    let v = get(repeatConfig, valuePath);
    if (callBack !== null) v = callBack(v);
    config[propKey] = v;
  });

  res[configTypes[type - 1]] = config;
  // 如果是按周重复，添加该属性
  if (type === 3 && Array.isArray(repeatWeek)) {
    const weekRepeatTimes = repeatWeek.map(conf => {
      const { startTime, endTime, weekDay } = conf;
      return {
        weekDay,
        startTime,
        endTime,
      };
    }).filter(o => !!o.weekDay);
    res.weekRepeatConfig.weekRepeatTimes = weekRepeatTimes;
  }

  // 避免如果「排课总数」字段没有触发失焦就提交时，NumberInput field不会将其转化为数字导致报错的问题
  if (repeatDay && repeatDay.totalTimes) {
    const { totalTimes } = repeatDay;
    if (type === 2) { // 按天重复排课
      res.dayRepeatConfig && (res.dayRepeatConfig.totalTimes = getRoundedInt(totalTimes));
    } else if (type === 3) { // 按周重复排课
      res.weekRepeatConfig && (res.weekRepeatConfig.totalTimes = getRoundedInt(totalTimes));
    }
  }

  return res;
}

/**
 * 格式化对象转为检查冲突以及提交的对象的格式
 *
 * @param {Object} value 需要格式化的对象
 */
export function formatValueToQuery(value) {
  // value.type：重复类型，这个很重要
  const { type = 0, operateType, name, keyword, assistants, appointmentConfigDTO = {}, ...vals } = value;
  if (operateType === undefined) {
    throw new Error('check conflict require properties operateType');
  }

  const res = { operateType, name, keyword };
  // 如果没有其他的连带判断，repeatConfig.type = 1;
  res.repeatConfig = { type: type + 1 };

  const { appointment = {}, cancel = {},
    isIndependentConfig, trialCourseOccupyQuota = 0, isAllowConflict = 1 } = appointmentConfigDTO;
  res.appointmentConfigDTO = omit({
    isIndependentConfig: Number(isIndependentConfig),
    trialCourseOccupyQuota,
    isAllowConflict,
    ...appointment,
    ...cancel,
  }, isNil);

  const keys = Object.keys(vals);
  // 将所有value进行一次格式化
  keys.forEach(key => {
    const val = vals[key];
    if (key === 'repeatConfig') {
      val.type = type + 1;
      res.repeatConfig = fromatRepeatConfig(val);
    } else if (key === 'consumeNum') {
      // 如果是消费课节数
      res[key] = accNumber.accMul(val || 0, 100);
    } else if (key === 'maxAppointNum') {
      // 避免如果「上课人数」字段没有触发失焦就提交时，NumberInputfield不会将其转化为数字导致报错的问题
      res[key] = val && getRoundedInt(val);
    } else if (val !== '') {
      if (val && typeof val === 'object') {
        // 如果格式化对象的属性的值是一个对象，那么这个属性的取值应该是
        // 这个格式化对象属性的该属性值
        res[key] = val[key];
      } else {
        res[key] = val;
      }
    }
  });

  const repeatType = configTypes[type];
  // 如果重复配置属性中不存在的“重复配置”对象，将没有的对象初始化为空对象
  if (!get(res.repeatConfig, repeatType)) {
    res.repeatConfig[repeatType] = {};
  }

  const { appointRule } = res;
  if (appointRule !== undefined) {
    res.appointRule = appointRule ? 1 : 2;
  }

  // 如果是编辑单个日程,需要加入lessonDate, startTime和 endTime
  if (operateType === 2) {
    const config = res.repeatConfig[repeatType];
    res.lessonDate = config.date || config.startDate;
    res.startTime = formatTimeGap(config.startTime);
    res.endTime = formatTimeGap(config.endTime);
  }

  if (Array.isArray(assistants)) {
    res.assistantNos = assistants.map(a => a.teacherNo);
  }

  // 跳过节假日配置
  res.filterConfig = {};
  if (!value.skipHoliday) value.skipHoliday = [];

  value.skipHoliday.forEach(skip => {
    if (skip === 'legal') res.filterConfig.skipLegalHoliday = true;
    if (skip === 'weekend') res.filterConfig.skipWeekend = true;
    if (skip === 'custom') {
      res.filterConfig.customHolidays = value.customHolidays.map(it => ({
        id: it.id,
        kdtId: it.kdtId,
        startTime: `${date.makeDateStr(it.startTime)} 00:00:00`,
        endTime: `${date.makeDateStr(it.endTime)} 23:59:59`,
      })) || [];
    }
  });

  return res;
}

// 需要额外处理的属性
const specialProps = [
  {
    key: 'classroomNo',
    values: ['classroomName', 'classroomNo'],
    // 选项的文本
    selectText(info) {
      const { classroomName, classroomCapacity } = info;
      if (!classroomName) return undefined;
      if (classroomCapacity === -1) return classroomName;
      return `${classroomName}（${classroomCapacity}人）`;
    },
  },
  {
    key: 'addressId',
    values: ['addressId'],
    selectText(info) {
      return info.addressName;
    },
  },
  {
    key: 'teacherNo',
    values: ['teacherName', 'teacherNo'],
    selectText(info) {
      return info.teacherName;
    },
  },
  {
    key: 'assistants',
    // values: ['assistantName', 'assistantNo', 'teacherId'],
    format(assistants) {
      return assistants
        ? assistants.map(assistant => {
          return {
            teacherNo: assistant.teacherNo,
            assistantName: assistant.assistantName,
          };
        })
        : [];
    },
    selectText(info) {
      return info.assistantName;
    },
  },
  {
    key: 'classNo',
    values: [
      'classNo',
      'classId',
      'className',
      'classStartTime',
      'classEndTime',
      'kdtId',
      'shopName',
    ],
    selectText(info) {
      return info.className;
    },
  },
  {
    key: 'eduCourseId',
    values: ['eduCourseId', 'classNum'],
    selectText(info) {
      return info.eduCourseName;
    },
  },
  {
    key: 'appointRule',
    format(appointRule) {
      return !!appointRule;
    },
  },
  {
    key: 'consumeNum',
    format(consumeNum) {
      if (!consumeNum) {
        return '';
      }
      return accNumber.accDiv(consumeNum, 100);
    },
  },
  {
    key: 'kdtId',
    values: ['kdtId'],
    selectText(info) {
      return info.shopName;
    },
  },
];

// 将scheduleInfo转换成相对应的zentform.value，并且如果是选择框类型的，会转换成option附带再attachOptions属性中
export function formatScheduleInfoToFormValue(scheduleInfo, operateType = 1) {
  const formValues = { ...scheduleInfo };
  const attachOptions = Object.create(null);

  // 根据需要特别处理的字段的配置来处理字段的值并且如果是有selectText额外输出一个option
  specialProps.forEach(item => {
    const { key, values, format, selectText } = item;
    let formVal = {};
    // 根据value的属性值进行遍历，然后赛道item[key]中
    if (values) {
      values.forEach(valKey => {
        if (values.length === 1) formVal = scheduleInfo[valKey];
        else formVal[valKey] = scheduleInfo[valKey];

        try {
          // delete formValues[valKey];
        } catch (err) {
          throw Error('delete failed');
        }
      });
    }

    if (format) {
      formVal = format(scheduleInfo[key]);
    }

    // 如果是选项框
    if (selectText && !attachOptions[key]) {
      const text = selectText(scheduleInfo);
      if (text) {
        attachOptions[key] = {
          value: formVal,
          text,
        };
      }
    }

    formValues[key] = formVal;
  });

  // 处理repeatConfig属性
  const { repeatConfig } = scheduleInfo;
  if (repeatConfig) {
    // noRepeat属性
    const startTime =
      formatToTimeGap(get(scheduleInfo, 'startTime')) ||
      get(scheduleInfo, 'repeatConfig.noRepeatConfig.startTime');
    const endTime =
      formatToTimeGap(get(scheduleInfo, 'endTime')) ||
      get(scheduleInfo, 'repeatConfig.noRepeatConfig.endTime');
    const defaultPick =
      operateType === 2
        ? get(scheduleInfo, 'lessonDate')
        : get(scheduleInfo, 'repeatConfig.noRepeatConfig.date');
    repeatConfig.noRepeat = {
      // 获取开始日期，并塞到noRepeat中
      startDate:
        // 如果是编辑单次日程,就取最外层的lessonDate
        defaultPick ||
        get(repeatConfig, 'dayRepeatConfig.startDate') ||
        get(repeatConfig, 'weekRepeatConfig.startDate'),
      schoolTime: startTime && endTime ? [startTime, endTime].join('-') : undefined,
    };
    // 添加默认选项
    const schoolTime = get(repeatConfig, 'noRepeat.schoolTime');
    if (operateType === 2 && schoolTime) {
      attachOptions.schoolTime = {
        value: schoolTime,
        text: schoolTime,
      };
    }

    repeatConfig.repeatDay = {
      endType:
        get(repeatConfig, 'dayRepeatConfig.endType') ||
        get(repeatConfig, 'weekRepeatConfig.endType'),
      totalTimes:
        get(repeatConfig, 'dayRepeatConfig.totalTimes') ||
        get(repeatConfig, 'weekRepeatConfig.totalTimes'),
      endDate:
        get(repeatConfig, 'dayRepeatConfig.endDate') ||
        get(repeatConfig, 'weekRepeatConfig.endDate'),
    };

    repeatConfig.repeatWeek = get(repeatConfig, 'weekRepeatConfig.weekRepeatTimes');

    configTypes.forEach(key => delete formValues.repeatConfig[key]);
  } else {
    // 如果没有repeat选项
    formValues.repeatConfig = { type: 1 };
  }

  // 处理多选 assistants
  attachOptions.assistants = scheduleInfo.assistants
    ? scheduleInfo.assistants.map(a => {
      return {
        text: a.assistantName,
        value: {
          teacherNo: a.teacherNo,
          assistantName: a.assistantName,
        },
      };
    })
    : [];
  attachOptions.assistantNos = attachOptions.assistants;

  return { formValues, attachOptions };
}

// 格式化query参数为formValues
export function formatQueryIntoFormValues(params) {
  const paramKeys = Object.keys(params);
  const queryInfo = {};

  const handleParams = param => {
    switch (param) {
      case 'startTime': {
        const noRepeatConfig = {};
        // 看板页面跳转到新建页面回填时间
        const startTime = new Date(params.startTime).getTime();
        const endTime = params.endTime ? new Date(params.endTime).getTime() : null;
        // const now = new Date().getTime();
        // if (startTime < now) return void 0;
        noRepeatConfig.date = formatTime(startTime, 'YYYY-MM-DD');
        if (!onlyDate(params.startTime)) {
          noRepeatConfig.startTime = formatTime(startTime, 'HH:mm');
          noRepeatConfig.endTime = formatTime(endTime || addMinutes(startTime, 15), 'HH:mm');
        }
        queryInfo.repeatConfig = {
          type: 1,
          noRepeatConfig,
        };
        return void 0;
      }
      case 'endTime': {
        return void 0;
      }
      default: {
        const target = params[param];
        queryInfo[param] = transToNumber(target);
        return void 0;
      }
    }
  };

  if (paramKeys.length) paramKeys.forEach(key => handleParams(key));
  // 处理appointRule
  if (get(queryInfo, 'classNo') === undefined) queryInfo.appointRule = true;
  return formatScheduleInfoToFormValue(queryInfo);
}

function transToNumber(numberLike) {
  if (!isNaN(numberLike)) {
    return Number(numberLike);
  }
  return numberLike;
}
