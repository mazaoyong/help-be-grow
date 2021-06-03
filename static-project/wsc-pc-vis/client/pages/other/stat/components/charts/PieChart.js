import React, { Component } from 'react';
import Recharts from 'echarts-for-react';
import cloneDeep from 'lodash/cloneDeep';
import { Notify } from 'zent';
import { ECHART_PIE_OPTION, CHART_STYLE } from './constants';
import { formatMap, unitMap } from './common';

const calRestValue = (data, mapKeys, totalKey) => {
  let result = data[totalKey];
  mapKeys.map(keyInfo => {
    if (keyInfo.key !== totalKey) {
      result -= data[keyInfo.key];
    }
    return false;
  });
  return result;
};

const parseOriginData = (base, legendInfo, typeInfo) => {
  const { data = [], mapKeys, mapTitle, seriesOption } = legendInfo;
  let legendData = [];
  let series = [];
  let color = [];

  if (typeInfo) {
    // 修改既定的参数format函数
    typeInfo.map(type => {
      formatMap[type.type] = type.format;
      unitMap[type.type] = type.unit;
      return false;
    });
  }

  series[0] = {
    ...ECHART_PIE_OPTION.series[0],
    name: mapTitle,
    type: 'pie',
    ...(seriesOption || {}),
    tooltip: {
      formatter: params => {
        const { data: pieData, seriesName, percent } = params;
        return `${pieData.name}<br/>${seriesName}：${unitMap[mapKeys[0].type || 'number'](
          pieData.value
        )}<br/>占比：${percent}%`;
      }, // `{b} <br/>{a} : {c} <br/>占比 : {d}%`
      trigger: 'item',
    },
    data: mapKeys.map(keyInfo => {
      keyInfo.type || (keyInfo.type = 'number');
      if (keyInfo.legend || typeof keyInfo.legend === 'undefined') {
        legendData.push({
          name: keyInfo.legend || keyInfo.title,
          icon: keyInfo.legendIcon || 'circle',
        });
      }

      if (keyInfo.color) {
        color.push(keyInfo.color);
      }

      if (!keyInfo.totalKey) {
        return {
          name: keyInfo.title,
          value: formatMap[keyInfo.type]({
            num: data[keyInfo.key],
          }),
        };
      }

      return {
        name: keyInfo.title,
        value: formatMap[keyInfo.type]({
          num: calRestValue(data, mapKeys, keyInfo.key),
        }),
      };
    }),
  };

  // 数据
  base.series = series;
  // 图例
  base.legend.data = legendData;
  // 指定颜色
  if (color.length) {
    base.color = color;
  }

  return base;
};

const getOption = (option = {}, legendInfo, processOption) => {
  try {
    let { legendData, ...params } = option;
    let base = {
      ...cloneDeep(ECHART_PIE_OPTION),
      ...params,
    };

    if (legendData) {
      base.legend.data = legendData;
    }
    if (legendInfo) {
      base = parseOriginData(base, legendInfo);
    }

    if (processOption && typeof processOption === 'function') {
      const result = processOption(base);
      if (result === undefined) {
        Notify.error('processOption 需要返回最终配置');
      } else {
        return result;
      }
    }

    return base;
  } catch (e) {
    Notify.error('图表参数解析错误');
  }
};

class PieChart extends Component {
  render() {
    const {
      option,
      legendInfo,
      typeInfo,
      notMerge = false,
      className = '',
      style = {},
      onEvents = {},
      processOption,
    } = this.props;
    const options = getOption(option, legendInfo, processOption, typeInfo);
    const { data } = options.series[0];
    if (!data.length) {
      options.color = ['#F2F3F5'];
      options.series[0].data = [{ name: '总量', value: 0 }];
      options.series[0].emphasis = {
        itemStyle: {
          color: '#F2F3F5',
        },
      };
      options.tooltip.show = false;
    }

    return (
      <Recharts
        className={className}
        option={options}
        notMerge={notMerge}
        onEvents={onEvents}
        style={{
          ...CHART_STYLE,
          ...style,
        }}
      />
    );
  }
}

PieChart.getOption = getOption;

export default PieChart;
