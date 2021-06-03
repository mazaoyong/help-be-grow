import React, { Component } from 'react';
import Recharts from 'echarts-for-react';
import { cloneDeep } from 'lodash';
import { Notify } from 'zent';
import { ECHART_COLUMN_OPTION, CHART_STYLE } from './constants';
import { parseOriginData } from './common';

const getOption = (option, legendInfo, typeInfo, postProcessOption) => {
  try {
    const { series = [], data, name, xAxisData, ...params } = option;
    let base = {
      ...cloneDeep(ECHART_COLUMN_OPTION),
      ...params,
    };
    if (series.length) {
      base.series = series;
    }
    if (data) {
      base.series[0].data = data || 0;
    }
    if (name) {
      base.series[0].name = name;
      base.legend.data = [name];
    }
    if (xAxisData) {
      base.xAxis[0].data = xAxisData;
    }
    if (legendInfo) {
      base = parseOriginData('bar', base, legendInfo, typeInfo);
    }
    if (postProcessOption && typeof postProcessOption === 'function') {
      const result = postProcessOption(base);
      if (result === undefined) {
        Notify.error('postProcessOption 需要返回最终配置');
      } else {
        return result;
      }
    }
    return base;
  } catch (e) {
    Notify.error('图表参数解析错误');
  }
};

class BarChart extends Component {
  render() {
    const {
      className = '',
      option = {},
      legendInfo,
      typeInfo,
      style = {},
      notMerge = false,
      onEvents = {},
      postProcessOption,
      onChartReady = () => {},
    } = this.props;
    return (
      <Recharts
        className={className}
        option={getOption(option, legendInfo, typeInfo, postProcessOption)}
        notMerge={notMerge}
        onEvents={onEvents}
        style={{
          ...CHART_STYLE,
          ...style,
        }}
        onChartReady={onChartReady}
      />
    );
  }
}

BarChart.getOption = getOption;

export default BarChart;
