import { Pop } from '@zent/compat';
import React from 'react';
import { isEduBranchStore } from '@youzan/utils-shop';
import openDemoImg from '../components/demo-image';
import { DEMO_IMG, DEMO_TEXT } from './constants';

export default {
  title: '线下课详情页报名按钮：',
  key: 'courseBuyButton',
  radio: [
    { value: 0, desc: '默认名称' },
    { value: 1, desc: '自定义名称' },
  ],
  value: 0,
  disabled: isEduBranchStore,
  customDescList: [
    {
      coursePriceType: 'ZERO',
      desc: '免费报名',
    },
    {
      coursePriceType: 'NON_ZERO',
      desc: '立即报名',
    },
  ],
  helpDesc: {
    default: <div>
      0元课程默认名称为“免费报名”，非0元课程默认名称为“立即报名”。
      <Pop
        trigger="click"
        content={
          openDemoImg(DEMO_IMG.ORDER.src, DEMO_TEXT.ORDER, DEMO_IMG.ORDER.height)
        }
        position="right-bottom"
        className='course-example-pop'
      >
        <a href="javascript:;">查看示例</a>
      </Pop>
    </div>,
    customised: <div>自定义后，所有线下课报名按钮名称都将更改，若需要设置单个线下课的报名按钮名称，可前往<a href="https://www.youzan.com/v4/vis/edu/course#/course-manage/list" target="_blank" rel="noopener noreferrer">线下课管理</a>单独编辑相应的线下课。</div>,
  },
};
