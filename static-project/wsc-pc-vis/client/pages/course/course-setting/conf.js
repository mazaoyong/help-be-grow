import { Pop } from '@zent/compat';
import React from 'react';
import { isEduBranchStore } from '@youzan/utils-shop';
import openDemoImg from '../components/demo-image';
import { DEMO_IMG, DEMO_TEXT } from './constants';

function getCourseSettingConfigs(overrideConfig) {
  const { labels } = overrideConfig;
  return [
    {
      title: '仅微信中访问：',
      key: 'wechatVisit',
      radio: [
        { value: 1, desc: '开启' },
        { value: 0, desc: '关闭' },
      ],
      value: 1,
      disabled: isEduBranchStore,
      helpDesc: <div>
        开启后，用户仅能在微信中查看知识付费音/视频，极大程度的避免内容被盗。
        <Pop
          trigger="click"
          content={
            openDemoImg(DEMO_IMG.WECHAT_ONLY.src, DEMO_TEXT.WECHAT_ONLY, DEMO_IMG.WECHAT_ONLY.height)
          }
          position="right-top"
          className='course-example-pop'
        >
          <a href="javascript:;">查看示例</a>
        </Pop>
      </div>,
    },
    {
      title: '课程商品分销员入口：',
      key: 'supportProductSalesman',
      radio: [
        { value: 1, desc: '开启' },
        { value: 0, desc: '关闭' },
      ],
      value: 1,
      helpDesc: '所有用户均可看到“最高赚¥...”字样，点击后会走注册成为销售员的流程',
      helpCloseDesc: '非分销员用户看不到“最高赚¥...”字样，分销员可看到',
    },
    {
      title: '0元课程免领取：',
      key: 'zeroProductRead',
      radio: [
        { value: 1, desc: '开启' },
        { value: 0, desc: '关闭' },
      ],
      disabled: isEduBranchStore,
      value: 1,
      helpDesc: <div>
        开启后，当线上课程设置为0元时，用户不需要领取可直接观看。
        <Pop trigger="hover" position="bottom-center" content={(
          <div className="pop-content">
            <p>
              如果你的店铺绑定了认证的服务号，买家领取后，可以收到专栏更新提醒，有助于提升用户活跃度，设置免领取开关后则无法收到此类提醒
            </p>
            <p>同时，买家订阅专栏或内容时，会生成订阅记录，你可以查询到具体订单记录，便于做后续触达</p>
          </div>
        )}>
          <a className="setting-item-supply">查看具体影响</a>
        </Pop>
      </div>,
    },
    {
      title: '课程订购数：',
      key: 'subscriptionCountShow',
      radio: [
        { value: 1, desc: '显示' },
        { value: 0, desc: '隐藏' },
      ],
      disabled: isEduBranchStore,
      value: 1,
      helpDesc: '设置线下课、线上课是否显示订购数量',
    },
    {
      title: '专栏更新期数：',
      key: 'newPublishCountShow',
      radio: [
        { value: 1, desc: '显示' },
        { value: 0, desc: '隐藏' },
      ],
      disabled: isEduBranchStore,
      value: 1,
      helpDesc: '设置专栏/会员权益是否显示更新期数',
    },
    {
      title: '课程浏览量/播放量：',
      key: 'pageViewCountShow',
      radio: [
        { value: 1, desc: '显示' },
        { value: 0, desc: '隐藏' },
      ],
      disabled: isEduBranchStore,
      value: 1,
      helpDesc: '设置线上课详情页浏览量/音频、视频播放次数',
    },
    {
      title: '体验课/正式课标签：',
      key: 'courseTypeShow',
      radio: [
        { value: 1, desc: '显示' },
        { value: 0, desc: '隐藏' },
      ],
      disabled: isEduBranchStore,
      value: 1,
      helpDesc: '开启后，用户在访问线下课相关页面，会显示体验课或正式课的课程标签',
    },
  ].map((originConfig, index) => {
    const curOverrideLabel = labels[index];
    if (curOverrideLabel) originConfig.helpDesc = curOverrideLabel;
    return originConfig;
  });
}

export default getCourseSettingConfigs;
