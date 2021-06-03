import { Pop } from '@zent/compat';
import React from 'react';
import { isEduBranchStore } from '@youzan/utils-shop';
import openDemoImg from '../components/demo-image';
import { DEMO_IMG, DEMO_TEXT } from './constants';

export default {
  title: (
    <div>
      <p>悬浮滚动展示报名动态：</p>
      <p style={{
        fontSize: '12px',
        lineHeight: '12px',
        color: '#969799',
      }}>（暂仅支持线下课）</p>
    </div>
  ),
  key: 'courseBoughtDisplay',
  radio: [
    { value: 1, desc: '显示' },
    { value: 0, desc: '隐藏' },
  ],
  value: 1,
  disabled: isEduBranchStore,
  helpDesc: (
    <div>
      设置显示后，将在线下课详情页悬浮滚动展示最近20条的报名信息。
      <Pop
        trigger="click"
        content={
          openDemoImg(DEMO_IMG.TRADE_CAROUSEL.src, DEMO_TEXT.TRADE_CAROUSEL, DEMO_IMG.TRADE_CAROUSEL.height)
        }
        position="right-bottom"
        className='course-example-pop'
      >
        <a href="javascript:;">查看示例</a>
      </Pop>
    </div>
  ),
};
