import React from 'react';

const isYZEdu = window._global.isYZEdu;

export const SETTING_TEXT_DATA = {
  content_media: {
    title: '仅微信中访问',
    desc: '开启后，用户仅能在微信中查看知识付费音/视频，极大程度的避免内容被盗',
    photo: {
      title: '查看示例',
      links: ['https://b.yzcdn.cn/public_files/4bdc7237cee97b33054a15b120dd7511.png'],
    },
  },
  zero_owl_product: {
    title: '0元商品免领取',
    desc: '开启后，当专栏或内容设置为0元时，用户不需要领取即可直接观看',
    pop: {
      title: '为什么需要设置领取？',
      desc: (
        <div className="pop-content">
          <p>
            如果你的店铺绑定了认证的服务号，买家领取后，可以收到专栏更新提醒，有助于提升用户活跃度，免费直接观看的则无法收到
          </p>
          <p>买家领取的专栏或内容，会在后台生成订购记录，你可以知道谁领取过，便于做进一步的激活</p>
          <p>无需领取直接观看的专栏或内容，无法使用信息采集和下单拉群功能</p>
        </div>
      ),
    },
  },
  owl_distributor: {
    title: isYZEdu ? '课程商品分销员入口' : '知识付费分销员',
    desc: '所有用户均可看到“最高赚¥...”字样，点击后会走注册成为销售员的流程',
    descClosable: '非分销员用户看不到“最高赚¥...”字样，分销员可看到',
  },
};

// 可见类型 1:所有可见 2:所有不可见 3: 部分可见
export const SHOW_TYPE = {
  ALL: 1,
  NONE: 2,
  PART: 3,
  FORCECLOSE: 4,
};
