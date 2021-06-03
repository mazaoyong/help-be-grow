import React, { FC } from 'react';
import { Legend, RechartsLayout, SeriesLine, Tooltip, XAxis, YAxis, Grid } from '@youzan/react-charts';
import { TREND_INDEX } from '../../constants';
import { TChartDataLines } from '../../types';
import { format } from 'date-fns';
import parseDate from '@youzan/utils/date/parseDate';

const ChartFC: FC<{ chartData: TChartDataLines, xAisxData: string[] }> = (props) => {
  const { chartData = [], xAisxData } = props;
  return (
    <section>
      <RechartsLayout
        style={{
          height: 540,
        }}
      >
        <Grid />
        <Legend selectedMode={true}/>
        { chartData.map((config) => {
          return TREND_INDEX[config.name] ? <SeriesLine animationDuration={2000} smooth={true} key={config.name} name={TREND_INDEX[config.name]['legend']} data={config.name === 'avgLearnDuration' ? config.data.map(item => +(item / 60).toFixed(2)) : config.data} yAxisIndex={TREND_INDEX[config.name]['yAxisIndex']} /> : null;
        })}
        <XAxis data={xAisxData.map(item => format(parseDate(item, 'YYYYMMDD'), 'MM-DD'))} name="日期"/>
        <YAxis name="会员数(人)"/>
        <YAxis name="时长(分钟)"/>
        <Tooltip
          trigger="axis"
          axisPointer={{
            type: 'shadow',
          }}
        />
      </RechartsLayout>
    </section>
  );
};

export default ChartFC;
