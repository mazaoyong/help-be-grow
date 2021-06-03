import { filter, get } from 'lodash';
import accMul from 'zan-utils/number/accMul';
import accDiv from 'zan-utils/number/accDiv';
import findIndex from 'lodash/findIndex';
import addWeeks from 'date-fns/add_weeks';
import format from 'date-fns/format';
import differenceInCalendarWeeks from 'date-fns/difference_in_calendar_weeks';
import endOfWeek from 'date-fns/end_of_week';
import startOfWeek from 'date-fns/start_of_week';
import startOfMonth from 'date-fns/start_of_month';
import getQuarter from 'date-fns/get_quarter';
import { ECHART_LINE_OPTION, ECHART_COLUMN_OPTION, SERIES_STYLE_MAP } from './constants';

const EMPTY = '--';

const isEmpty = num => {
  return isNaN(+num) || num == undefined; // eslint-disable-line
};

const isEmptyPercent = num => {
  return isNaN(+num) || num == undefined || +num === -2 || +num === -999999.99; // eslint-disable-line
};

export const formatFloat = (num, noTag, emptyValue, emptyStr) => {
  num = parseFloat(num);
  if (typeof emptyStr === 'undefined') {
    emptyStr = EMPTY;
  }

  if (isNaN(num)) return EMPTY;
  if (typeof emptyValue !== 'undefined' && num === emptyValue) return emptyStr;
  return `${Math.round(num * 10000) / 100}${noTag ? '' : '%'}`;
};

export const formatNumber = params => {
  let {
    num,
    digits = 2,
    emptyFunc = isEmpty,
    withThousandSymbol = false,
    noEmptyTag = false, // noEmptyTag为true则将'-'显示为0
  } = params;
  num = parseFloat(num);
  const factor = Math.pow(10, digits);
  if (emptyFunc(num)) return noEmptyTag ? 0 : EMPTY;
  let result = Math.round(num * factor) / factor;
  if (withThousandSymbol) {
    result = String(result).replace(/(^|\s)\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
  }
  return result;
};

export const formatPercent = params => {
  let {
    num,
    isPercent = false,
    withPercentSign = false,
    digits = 2,
    emptyFunc = isEmptyPercent,
    noEmptyTag = false, // noEmptyTag为true则将'-'显示为0
  } = params;
  if (emptyFunc(num)) return noEmptyTag ? 0 : EMPTY;

  let factor1;
  let factor2 = Math.pow(10, digits);
  num = parseFloat(num);
  if (isPercent) {
    factor1 = factor2;
  } else {
    factor1 = factor2 * 100;
  }
  return `${Math.round(num * factor1) / factor2}${withPercentSign ? '%' : ''}`;
};

export const formatMoney = params => {
  let {
    num,
    isCent = true,
    withThousandSymbol = false,
    digits = 2,
    emptyFunc = isEmpty,
    noEmptyTag = false, // noEmptyTag为true则将'-'显示为0
  } = params;
  if (emptyFunc(num)) return noEmptyTag ? 0 : EMPTY;

  let factor1;
  let factor2 = Math.pow(10, digits);
  let result;

  if (isCent) {
    factor1 = 1;
  } else {
    factor2 = factor1;
  }

  result = (Math.round(num * factor1) / factor2).toFixed(2);
  if (withThousandSymbol) {
    return result.toString().replace(/(^|\s)\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
  }
  return result;
};

const formatTime = params => {
  let {
    num,
    withTimeSymbol = false,
    digits = 2,
    emptyFunc = isEmpty,
    noEmptyTag = false, // noEmptyTag为true则将'-'显示为0
  } = params;
  num = parseFloat(num);
  const factor = Math.pow(10, digits);
  if (emptyFunc(num)) return noEmptyTag ? 0 : EMPTY;
  return `${Math.round(num * factor) / factor}${withTimeSymbol ? 's' : ''}`;
};

const getFormat = (type, emptyFunc) => {
  const map = {
    number: formatNumber,
    money: formatMoney,
    percent: formatPercent,
    time: formatTime,
  };
  return params => {
    if (params instanceof Object) {
      return map[type]({
        emptyFunc,
        ...params,
      });
    }
    return map[type]({
      emptyFunc,
      num: params,
    });
  };
};

export let formatMap = {
  number: getFormat('number', isEmpty),
  money: getFormat('money', isEmpty),
  percent: getFormat('percent', isEmptyPercent),
  time: getFormat('time', isEmpty),
};

export let unitMap = {
  number: val => val,
  money: val => {
    return val.toString().replace(/(^|\s)\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
  },
  percent: val => `${isNaN(+val) ? val : `${val}%`}`,
  time: val => `${isNaN(+val) ? val : `${val}s`}`,
  numberThousandSymbol: val =>
    val.toString().replace(/(^|\s)\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ',')),
};

export let formatUnitMap = {
  number: params => unitMap.number(formatMap.number(params)),
  money: params => unitMap.money(formatMap.money(params)),
  percent: params => unitMap.percent(formatMap.percent(params)),
  time: params => unitMap.time(formatMap.time(params)),
  numberThousandSymbol: params => unitMap.numberThousandSymbol(formatMap.number(params)),
};

const prettyInterval = (min, max, numIntervals) => {
  let explicitTick = Math.abs(max - min) / numIntervals;
  if (!explicitTick) return 0.2;
  let digit = accDiv(Math.log(explicitTick), Math.log(10));
  let magnitude = Math.pow(10, Math.floor(digit));
  // let magnitude = Math.pow(10, Math.floor(Math.log(explicitTick) / Math.log(10)));
  let factor = explicitTick / magnitude;
  let flooredFactor = Math.floor(accDiv(explicitTick, magnitude));

  let breaks = [];
  let bisector = flooredFactor;

  for (let i = 0; i <= 2; i++) {
    breaks.push(flooredFactor + i * 0.5);
  }

  for (let j = 0; j < breaks.length; j++) {
    if (breaks[j] >= factor) {
      bisector = breaks[j];
      break;
    }
  }

  return accMul(bisector, magnitude);
};

const prettyMin = value => {
  if (!value) return 0;
  value = -value;

  let digit = accDiv(Math.log(value), Math.log(10));
  let magnitude = Math.pow(10, Math.floor(digit));
  // let magnitude = Math.pow(10, Math.floor(Math.log(explicitTick) / Math.log(10)));
  let factor = value / magnitude;
  let flooredFactor = Math.floor(accDiv(value, magnitude));

  let breaks = [];
  let bisector = flooredFactor;

  for (let i = 0; i <= 1; i++) {
    breaks.push(flooredFactor + i);
  }

  for (let j = 0; j < breaks.length; j++) {
    if (breaks[j] >= factor) {
      bisector = breaks[j];
      break;
    }
  }

  return -accMul(bisector, magnitude);
};

export const resizeChartInterval = (options, splitNumber, selected) => {
  let { yAxis, series } = options;
  options.yAxis = yAxis.map((item, i) => {
    let max = 0;
    let min = 0;
    let seriesArr = filter(series, { yAxisIndex: i });
    seriesArr.map(seriesData => {
      let { data, name } = seriesData;
      let seriesSelected = selected ? selected[name] : true;
      if (seriesSelected) {
        data.map(val => {
          if (+val > max) {
            max = +val;
          }
          if (+val < min) {
            min = +val;
          }
          return false;
        });
      }
      return false;
    });
    min = prettyMin(min);
    let interval = prettyInterval(min, max, splitNumber);
    item.min = min;
    item.max = min + interval * splitNumber;
    item.interval = interval;
    return item;
  });
  return options;
};

export const getWeekStrById = (year = new Date().getFullYear(), id = 1, noTitle) => {
  const start = startOfWeek(new Date(`${year}-01-01`), { weekStartsOn: 1 });
  const end = addWeeks(start, id - 1);
  const weekStart = format(startOfWeek(end, { weekStartsOn: 1 }), 'MM-DD');
  const weekEnd = format(endOfWeek(end, { weekStartsOn: 1 }), 'MM-DD');
  if (noTitle) {
    return `（${year}-${weekStart} ~ ${weekEnd}）`;
  }
  return `${year}第${id}周（${weekStart} ~ ${weekEnd}）`;
};

export const parseOriginData = (chartType, base, legendInfo, typeInfo) => {
  const { data = [], xAxisKey, yAxisKeys, tooltipTitleFormat } = legendInfo;
  let legendData = [];
  let series = [];
  let color = [];
  let userFormatMap = { ...formatMap };
  let userUnitMap = { ...unitMap };
  const selected = get(base, 'legend.selected');

  if (!yAxisKeys.length) return base;

  if (typeInfo) {
    // 修改既定的参数format函数
    typeInfo.map(type => {
      type.format && (userFormatMap[type.type] = type.format);
      type.unit && (userUnitMap[type.type] = type.unit);
      return false;
    });
  }

  const hasColumnOne = findIndex(yAxisKeys, keyInfo => !keyInfo.yAxisIndex) !== -1;
  const hasColumnTwo = findIndex(yAxisKeys, keyInfo => keyInfo.yAxisIndex === 1) !== -1;
  const singleColumn = !(hasColumnOne && hasColumnTwo);

  // 纵坐标
  if (hasColumnOne) {
    base.yAxis[0].axisLabel = {
      ...base.yAxis[0].axisLabel,
      formatter: userUnitMap[filter(yAxisKeys, keyInfo => !keyInfo.yAxisIndex)[0].type],
    };
  }

  if (hasColumnTwo) {
    if (!base.yAxis[1]) {
      base.yAxis[1] = { ...base.yAxis[0] };
    }
    base.yAxis[1].axisLabel = {
      formatter: userUnitMap[filter(yAxisKeys, keyInfo => keyInfo.yAxisIndex === 1)[0].type],
    };

    // selected默认隐藏所有轴2上的图线时，轴2也无需展示
    if (
      findIndex(
        yAxisKeys,
        keyInfo => keyInfo.yAxisIndex === 1 && (!selected || selected[keyInfo.title]),
      ) === -1
    ) {
      base.yAxis[1].show = false;
    } else {
      base.yAxis[1].show = true;
    }
  }

  // 数据
  yAxisKeys.map(keyInfo => {
    keyInfo.type || (keyInfo.type = 'number');
    series.push({
      name: keyInfo.title,
      smooth: true,
      symbol: 'circle',
      type: keyInfo.chartType || chartType || 'line',
      yAxisIndex: keyInfo.yAxisIndex,
      ...(keyInfo.seriesOption || {}),
      data: data.map(item => {
        const { key, format } = keyInfo;
        const value = item[key];
        const formattedValue = format ? format(value) : value;
        return userFormatMap[keyInfo.type]({
          num: formattedValue,
          noEmptyTag: !keyInfo.keepNull,
        });
      }),
      ...SERIES_STYLE_MAP[keyInfo.chartType || chartType || 'line'],
    });

    if (keyInfo.lengend || typeof keyInfo.legend === 'undefined') {
      legendData.push({
        icon: typeof keyInfo.legendIcon === 'undefined' ? 'rect' : keyInfo.legendIcon,
        name: keyInfo.lengend || keyInfo.title,
      });
    }

    if (keyInfo.color) {
      color.push(keyInfo.color);
    }
    return false;
  });
  base.series = series;
  // 横坐标
  base.xAxis[0].data = data.map(item => {
    return item[xAxisKey];
  });
  // 图例
  base.legend.data = legendData;
  selected && (base.legend.selected = selected);

  // tooltip
  if (!base.tooltip.formatter) {
    if (chartType !== 'bar') {
      base.tooltip = { ...ECHART_LINE_OPTION.tooltip };
    } else {
      base.tooltip = { ...ECHART_COLUMN_OPTION.tooltip };
    }
    base.tooltip.formatter = params => {
      if (!params.length) return '';
      let str;
      let axisValue = params[0].axisValue;
      if (tooltipTitleFormat) {
        str = tooltipTitleFormat(axisValue);
      } else if (/^\d+第\d+周$/.test(axisValue)) {
        // tooltip中自动将2018第1周补全成2018第1周（2018-01-01 ~ 2018-01-07）
        let year = axisValue.match(/^\d+/g)[0];
        let index = axisValue.replace(/^\d+|第|周/g, '');
        str = getWeekStrById(year, index);
      } else {
        str = axisValue;
      }
      const total = params.reduce((prev, current) => {
        return prev.value + current.value;
      });
      str += '<br/>';
      str += params
        .map(item => {
          let val = item.value;
          let title = item.seriesName;
          let itemInfo = filter(yAxisKeys, keyInfo => keyInfo.title === title)[0] || {};
          let { type, stack, unit = '' } = itemInfo;
          let unitFunc = userUnitMap[type === 'number' ? 'numberThousandSymbol' : type];
          let itemStr = `${item.marker}${item.seriesName}: ${unitFunc ? unitFunc(val) : val} ${unit}`;
          if (typeof stack !== 'undefined') {
            itemStr += `  占比: ${userUnitMap.percent(formatPercent(val / total))}`;
          }
          return itemStr;
        })
        .join('<br/>');
      return str;
    };
  }

  // 指定颜色
  if (color.length) {
    base.color = color;
  }

  if (!singleColumn) {
    // 多轴手动更正下坐标interval不一致，刻度线不能对齐的问题，等官方修复
    base = resizeChartInterval(base, 5, selected);
  }

  return base;
};

const getWeekStr = (date, noDay) => {
  const end = new Date(date);
  const year = endOfWeek(end, { weekStartsOn: 1 }).getFullYear();
  const start = startOfWeek(new Date(`${year}-01-01`), { weekStartsOn: 1 });
  const weekIndex = differenceInCalendarWeeks(end, start, { weekStartsOn: 1 }) + 1;
  const weekStart = format(startOfWeek(end, { weekStartsOn: 1 }), 'MM-DD');
  const weekEnd = format(endOfWeek(end, { weekStartsOn: 1 }), 'MM-DD');
  return `${year}第${weekIndex}周${noDay ? '' : `（${weekStart} ~ ${weekEnd}）`}`;
};

const getQuarterStr = day => {
  const date = new Date(day);
  const year = date.getFullYear();
  return `${year}-${getQuarter(date)}季度`;
};

export const parseCurrentDay = (day, dateType) => {
  let result = day;
  switch (+dateType) {
    case 1:
      result = day;
      break;
    case 2:
      result = getWeekStr(day, true);
      break;
    case 3:
      result = format(startOfMonth(new Date(day)), 'YYYY-MM');
      break;
    case 7:
      result = getQuarterStr(day, true);
      break;
    default:
      break;
  }
  return result;
};
