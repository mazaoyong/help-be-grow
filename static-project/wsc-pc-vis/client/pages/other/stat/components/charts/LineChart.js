import React, { Component } from 'react';
import Recharts from 'echarts-for-react';
import { cloneDeep } from 'lodash';
import { Notify } from 'zent';
import { ECHART_LINE_OPTION, CHART_STYLE } from './constants';
import { parseOriginData } from './common';

const getOption = (option, legendInfo, typeInfo, postProcessOption) => {
  try {
    let { legendData, xAxisData, ...params } = option;
    let base = {
      ...cloneDeep(ECHART_LINE_OPTION),
      ...params,
    };

    if (legendData) {
      base.legend.data = legendData;
    }
    if (xAxisData) {
      base.xAxis[0].data = xAxisData;
    }
    if (legendInfo) {
      base = parseOriginData('line', base, legendInfo, typeInfo);
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

class LineChart extends Component {
  render() {
    const {
      className = '',
      option = {},
      postProcessOption,
      legendInfo,
      typeInfo,
      notMerge = false,
      style = {},
      onEvents = {},
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
      />
    );
  }
}

LineChart.getOption = getOption;

export default LineChart;
