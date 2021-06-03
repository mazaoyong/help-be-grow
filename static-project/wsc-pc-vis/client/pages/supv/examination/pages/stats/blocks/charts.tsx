import React, { FC, useEffect, useState } from 'react';
import { BlockLoading, Notify } from 'zent';
import { Color, Legend, RechartsLayout, SeriesBar, Tooltip, XAxis, YAxis } from '@youzan/react-charts';
import BlankState from '../../../components/blank-state';
import { getExamStatsChartData } from '../../../api';
import { SCORE_MULTIPLIER } from '../../../constants';
import { IBlockBaseProps } from '../types';

const Charts: FC<IBlockBaseProps> = ({ examTemplateId }) => {
  const [yAisxData, setYAisxData] = useState<number[]>([]);
  const [xAisxData, setXAisxData] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    getExamStatsChartData(examTemplateId).then(res => {
      const y: number[] = [];
      const x: string[] = [];
      res.forEach(item => {
        const {
          higherScore,
          lowerScore,
          studentNumber
        } = item;
        y.push(studentNumber);
        x.push(`${lowerScore / SCORE_MULTIPLIER} - ${higherScore / SCORE_MULTIPLIER} 分`);
      });
      // 前端兜底逻辑，如果人数均为 0 ，视为空数据
      if (y.some(item => item > 0)) {
        setYAisxData(y);
        setXAisxData(x);
      }
    }).catch((msg) => {
      Notify.error(msg || '网络错误');
    }).finally(() => {
      setLoading(false);
    });
  }, [examTemplateId]);

  if (loading) {
    return <BlockLoading loading />;
  }

  return (
    <section>
      { xAisxData.length === 0
        ? <BlankState />
        : <RechartsLayout
          style={{
            height: 540,
          }}
        >
          <Color color={['#155bd4']} />
          <Legend selectedMode={false}/>
          <SeriesBar key='chart' name="人数" data={yAisxData} />
          <XAxis data={xAisxData} name="分数段"/>
          <YAxis name="人数"/>
          <Tooltip
            trigger="axis"
            axisPointer={{
              type: 'shadow',
            }}
          />
        </RechartsLayout>
      }
    </section>
  );
};

export default Charts;
