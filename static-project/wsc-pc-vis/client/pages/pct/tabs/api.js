import ajax from 'fns/ajax';
import { visAjax } from 'fns/new-ajax';

const urlHead = window._global.url.www || '//www.youzan.com/v2';

const makeRequest = (method, path, data = {}) => {
  const options = {
    url: `${urlHead}${path}`,
    method,
    data,
  };
  return ajax(options);
};

const API = {
  // 检测当前商品是否在拼团
  checkGroupon(alias) {
    return makeRequest('GET', '/ump/paidcontent/goodsPromotion.json', {
      alias,
    });
  },
  // 设置评论状态
  setCommentStatus(data) {
    return makeRequest('POST', '/ump/paidcontentcommentshop/chosensticky.json', data);
  },
  // 新增回复
  addComment(data) {
    return makeRequest('POST', '/ump/paidcontentcommentshop/reply.json', data);
  },
  // 删除自己的评论
  deleteComment(data) {
    return makeRequest('POST', '/ump/paidcontentcommentshop/delete.json', data);
  },
  // 获取产品
  getProduct(data) {
    return makeRequest('GET', '/ump/paidcontent/contentlist.json', data);
  },
  // 获取评论
  getComment(data) {
    return makeRequest('GET', '/ump/paidcontentcommentshop/list.json', data);
  },
  // 获取评论总数
  getCommentCount(data) {
    return visAjax('GET', '/pct/page/getNonReadCommentsCount.json', data);
  },
  // 已读
  readComment(data) {
    return makeRequest('POST', '/ump/paidcontentcommentshop/read.json', data);
  },
  // 直播列表
  getLive(data) {
    const { p, ...other } = data;
    data = {
      ...other,
      page: p,
    };
    return makeRequest('GET', '/ump/paidcontent/lives.json', data); // 没用到
  },
  // 添加直播
  addLive(data) {
    return visAjax('POST', '/course/live/createLive.json', data);
  },
  // 更新直播
  updateLive(data) {
    return visAjax('POST', '/course/live/updateLive.json', data);
  },
  // 获取专栏
  getColumnsSimple(data) {
    return visAjax('GET', '/course/column/getByAlias.json', data);
  },
  // 获取直播详情
  getLiveDetail(data) {
    return makeRequest('GET', '/ump/paidcontent/liveDetail.json', data);
  },
  checkLiveAuth() {
    return visAjax('GET', '/common/shop/checkAuth.json', {});
  },
  // 会员
  // 会员权益列表
  getBenefitList(data) {
    return makeRequest('GET', '/ump/paidcontent/benefitPackage.json', data);
  },
  // 获取待选择的会员卡
  getBenefitPkgVipCards(data) {
    return makeRequest('GET', '/ump/paidcontent/benefitPkgVipCards.json', data);
  },
  // 删除会员权益
  deleteBenefit(data) {
    return makeRequest('DELETE', '/ump/paidcontent/benefitPkg.json', data);
  },
  // 新建会员权益
  saveBenefit(data) {
    const type = data.benefit_id === 0 ? 'POST' : 'PUT';
    return makeRequest(type, '/ump/paidcontent/benefitPackage.json', data);
  },
  // 获取详情
  getBenefitDetail(data) {
    return makeRequest('GET', '/ump/paidcontent/benefitPkgDetail.json', data);
  },
  // 获取权益包内的内容
  getBenefitContents(data) {
    return makeRequest('GET', '/ump/paidcontent/benefitPkgContents.json', data);
  },
  // 获取权益包内的专栏
  getBenefitColumns(data) {
    return makeRequest('GET', '/ump/paidcontent/benefitPkgColumns.json', data);
  },

  // 获取待添加内容
  getContentsToAdd(data) {
    return makeRequest('GET', '/ump/paidcontent/benefitPkgContentsForAdd.json', data);
  },
  // 修改序号
  modifySerialNo(data) {
    return makeRequest('PUT', '/ump/paidcontent/benefitPkgSerialNo.json', data);
  },
  // 0 未关联 1 已关联 3 关联并已被领取
  checkBenefitPkgStatus(data) {
    return makeRequest('GET', '/ump/paidcontent/benefitPkgStatus.json', data);
  },
  getQrcode(data) {
    return makeRequest('GET', '/ump/paidcontent/invite.json', data);
  },
  // 新接口
  ignoreWarningV2(data) {
    return visAjax('POST', '/pct/column/updateOverLookSingleColumn.json', data);
  },
  ignoreAllV2(data = {}) {
    return visAjax('POST', '/pct/column/updateOverLookAllColumns.json', data);
  },
  getWarningV2(data = {}) {
    return visAjax('GET', '/pct/column/getColumnWarningCount.json', data);
  },
};

export default API;
