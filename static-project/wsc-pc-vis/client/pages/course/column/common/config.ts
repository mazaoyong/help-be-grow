export const SHOW_IN_STORE_DATA = [
  { value: 'all', text: '全部' },
  { value: '1', text: '显示' },
  { value: '0', text: '隐藏' },
];

export const SELL_STATUS_DATA = [
  { value: '0', text: '全部' },
  { value: '1', text: '出售中' },
  { value: '2', text: '已停售' },
];

export const SELLER_TYPE = [
  { value: '0', text: '全部' },
  { value: '1', text: '仅单篇销售' },
  { value: '2', text: '仅专栏销售' },
  { value: '3', text: '单篇或专栏销售' },
];

export const IS_UPDATE = [
  { value: 'all', text: '全部' },
  { value: '1', text: '更新中' },
  { value: '0', text: '已完结' },
];

export const COLUMN_TYPE = [
  { value: 'all', text: '全部' },
  { value: '0', text: '自营专栏' },
  { value: '1', text: '分销专栏' },
];

export const SHOW_IN_STORE = {
  all: '全部',
  0: '隐藏',
  1: '显示',
};

export const LIVE_STATUS_DATA = [
  { value: '0', text: '全部' },
  { value: '1', text: '未开始' },
  { value: '2', text: '进行中' },
  { value: '3', text: '已结束' },
];

export const LIVE_TYPE_DATA = [
  { value: '0', text: '全部' },
  { value: '1', text: '图文语音直播' },
  { value: '4', text: '保利威视频直播' },
];

// 专栏详情默认模板
export const defaultColumnDetail = `
  <p style="margin-bottom:0px;"><strong>作者简介</strong></p><p>
  <span style="font-size:12px;color:rgb(127 , 127 , 127);">请填写作者简介…</span></p>
  <p style="margin-bottom:0px;"><strong>内容简介</strong></p>
  <p><span style="font-size:12px;color:rgb(127 , 127 , 127);">请填写专栏内容或者价值介绍…</span></p>
  <p style="margin-bottom:0px;"><strong>通过这个专栏，你会得到：</strong></p>
  <p style="margin-top:0px;margin-bottom:0px;"><span style="color:rgb(127 , 127 , 127);font-size:12px;">1、…</span></p>
  <p style="margin-bottom:16px;margin-top:0px;">
    <span style="color:rgb(127 , 127 , 127);font-size:12px;">2、…</span>
    <strong><br /></strong>
  </p>
  <p style="margin-bottom:0px;"><strong>订阅须知</strong></p>
  <p style="margin-bottom:0px;">
    <span style="color:rgb(127 , 127 , 127);font-size:12px;">
      1、《请填写本专栏名称》为音频/图文/视频专栏，共计X期,每周一至周五的下午7点更新一期;
    </span>
  </p>
  <p style="margin-top:0px;margin-bottom:0px;">
    <span style="margin-top:0px;margin-bottom:0px;color:rgb(127 , 127 , 127);font-size:12px;">
      2、 每周一至周五的下午7点更新一期，专栏从2018.03.01开始更新，预计2019.03.01完结;
    </span>
  </p>
  <p style="margin-top:0px;margin-bottom:0px;">
    <span style="margin-top:0px;color:rgb(127 , 127 , 127);font-size:12px;">
      3、 本专栏为虚拟内容服务，购买成功后不支持退款，请你理解。
    </span>
  </p>
  `;
