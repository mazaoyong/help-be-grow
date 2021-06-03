import { ajax } from '@youzan/vis-ui';
import captainAjax from '@/common/utils/captainAjaxWrap';
import assign from 'lodash/assign';
import mapKeysToCamelCase from 'zan-utils/string/mapKeysToCamelCase';
import * as adapter from './adapter';
import UA from '@youzan/utils/browser/ua_browser';
const { miniprogram = {} } = window._global;
const isWeapp = miniprogram.isWeapp;
const platform = isWeapp ? 'weapp' : UA.isWeixin() ? 'weixin' : null;

const global = window._global;
const salesmanWapUrl = window._global.url.wap.slice(0, -2) + 'salesman';

const Api = {
  getAllColumns(data) {
    return ajax({
      url: '/wscvis/knowledge/columns.json',
      data,
      toCamelCase: true,
    });
  },

  getColumn: adapter.getColumn(function(data) {
    return ajax({
      url: '/wscvis/course/getDetail.json',
      data,
      toCamelCase: true,
    });
  }),
  // 获取全部内容列表
  getAllContents: adapter.getAllContents(function(data) {
    return ajax({
      url: '/wscvis/knowledge/contentList.json',
      data,
    });
  }),
  // 获取专栏内容列表
  getContentsAndLives: adapter.getContentsAndLives(function(data) {
    return ajax({
      url: '/wscvis/knowledge/contentAndLive.json',
      data,
    });
  }),
  // 获取内容详情
  getContent: adapter.getContent(function(data) {
    return ajax({
      url: '/wscvis/course/getDetail.json',
      data,
    });
  }),

  // 获取精简版的内容、专栏、直播详情,adapter处理后直接返回详情
  getSimple: adapter.getSimple(function(data) {
    return ajax({
      url: '/wscvis/course/getSimple.json',
      data,
    });
  }),

  // 获取已购内容部分
  getAllPaidContents: adapter.getAllPaidContents(function(data) {
    return ajax({
      url: '/wscvis/knowledge/user/contentList.json',
      data,
    });
  }),
  getNextOwl(data) {
    return ajax({
      url: '/wscvis/knowledge/nextOwl.json',
      data,
    });
  },
  // iron接口迁移(新接口)
  getPreviewContent(data) {
    return ajax({
      url: '/wscvis/knowledge/getDetailByAlias.json',
      data,
    });
  },
  // 获取活动信息，该接口可获取所有有效活动，url待后面迁至node时进行规范命名
  getActivities(data) {
    return ajax({
      // url: '/v2/ump/knowledgeActivity/activityInfos.json',
      url: '/wscvis/knowledge/activityInfos.json',
      data,
      toCamelCase: true,
    });
  },

  getNewActivities(data) {
    // if (window.location.href.indexOf('cashier.youzan.com') > -1) {
    //   return ajax({
    //     url: `${global.url.h5}/wscvis/knowledge/newActivityInfos.json`,
    //     data,
    //   });
    // } else {
    //   return ajax({
    //     url: `/wscvis/knowledge/newActivityInfos.json`,
    //     data,
    //   });
    // }
    return ajax({
      url: `/wscvis/knowledge/newActivityInfos.json`,
      data: Object.assign(data, {
        platform,
      }),
    });
  },

  // 创建点赞活动
  createPraiseActivity(data) {
    return ajax({
      url: '/wscvis/knowledge/buildZanSet.json',
      data,
    });
  },
  // 获取集赞详情
  getPraiseDetail(data) {
    return ajax({
      url: '/wscvis/knowledge/zanSetDetail.json',
      data,
    });
  },
  // 点赞接口
  clickPraise(data) {
    return ajax({
      url: '/wscvis/knowledge/givingZan.json',
      data,
    });
  },
  getAllPaidColumns(data) {
    return ajax({
      url: '/wscvis/knowledge/paidcolumns.json',
      data,
      toCamelCase: true,
    });
  },
  // 订阅
  postSubscribe(data) {
    return ajax({
      url: '/wscvis/order/create.json',
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      data,
    });
  },
  // 邀请卡， 包含二维码
  getInviteData(data) {
    return ajax({
      url: '/wscvis/knowledge/qrcode.json',
      data,
    });
  },

  // 生成二维码,不会进行urldecode
  getUndecodeQrSrc(data) {
    return ajax({
      url: '/v2/ump/paidcontent/shareinvite.json',
      data,
    });
  },

  // 获取活动信息
  getPromotion(data) {
    return ajax({
      url: '/v2/ump/paidcontentpromotion/goodsPromotion.json',
      data,
      toCamelCase: true,
    });
  },

  // 开团成功后邀请好友拼团页面获取拼团信息
  getGrouponInfo(data) {
    return ajax({
      url: '/wscvis/knowledge/getGrouponDetail.json',
      data,
    });
  },

  /** 会员权益相关的接口 */

  getVipBenefit(data) {
    return ajax({
      // url: '/v2/ump/paidcontent/vipBenefit.json',
      url: '/wscvis/benefit/getBenefitPackageDetail.json',
      data,
      errorMsg: '获取会员权益数据失败',
    });
  },

  getBenefitItems(data) {
    return ajax({
      url: '/wscvis/benefit/getFindBenefitItemDetailPage.json',
      data,
    });
  },

  getBenefitCulumns(data) {
    return ajax({
      // url: '/v2/ump/paidcontent/benefitPkgColumns.json',
      url: '/wscvis/benefit/getFindBenefitItemDetailPage.json',
      data,
      toCamelCase: true,
    });
  },
  getBenefitContents(data) {
    return ajax({
      url: '/v2/ump/paidcontent/benefitPkgContents.json',
      data,
      toCamelCase: true,
    });
  },
  getAllPaidBenefits(data) {
    return ajax({
      // url: '/wscvis/knowledge/getVipUserAllBenefitPkg.json',
      url: '/wscvis/benefit/getVipBenefitPackages.json',
      data,
      toCamelCase: true,
    });
  },
  getAllBenefits(data) {
    return ajax({
      // url: '/v2/ump/paidcontent/benefitPkgWithCount.json',
      url: '/wscvis/benefit/getBenefitPackageAllBuyDetail.json',
      data,
      toCamelCase: true,
    });
  },
  /**
   * 留言相关API
   */
  // 发布评论
  postComment(data) {
    return ajax({
      url: '/wscvis/knowledge/comment/add.json',
      type: 'post',
      data,
    });
  },
  // 删除评论
  delComment(data) {
    return ajax({
      url: '/wscvis/knowledge/comment/delete.json',
      type: 'post',
      data,
      loading: false,
    });
  },
  // 获取商品评论
  getGoodsComment(data) {
    return ajax({
      url: '/wscvis/knowledge/comment/list.json',
      data,
      loading: false,
    });
  },
  // 获取我的评论
  getMyComment(data) {
    return ajax({
      url: '/wscvis/knowledge/comment/userlist.json',
      data,
    });
  },
  // 评论点赞&取消点赞
  changeLikeStatus(data) {
    return ajax({
      url: '/wscvis/knowledge/comment/praise.json',
      type: 'post',
      data,
      loading: false,
    });
  },

  /**
   * 群聊相关API
   */
  // 获取 上传图片所需 token 接口
  getImgUploadToken(data) {
    return ajax({
      url: '/wscvis/getPubImgUploadToken.json',
      data,
      timeout: 5000,
    });
  },

  // 移除讲师接口
  deleteLecturer(data) {
    return captainAjax({
      url: '/wscvis/knowledge/relectorUpdateEnable.json',
      data,
      toCamelCase: true,
    });
  },

  // 获取讲师列表接口
  getLecturerList(data) {
    return ajax({
      url: '/wscvis/knowledge/getLectorUser.json',
      data,
      toCamelCase: true,
    });
  },

  getLiveDetail: adapter.getLiveDetail(function(data) {
    return ajax({
      url: '/wscvis/course/getDetail.json',
      data,
      // toCamelCase: true,
    });
  }),

  getLecturerQrcode(data) {
    return ajax({
      url: '/wscvis/knowledge/getInviteLecturerQr.json',
      data,
    });
  },

  getLectorResult(data) {
    return ajax({
      url: '/wscvis/knowledge/inviteLecturer.json',
      data,
    });
  },

  // 获取直播列表、讨论区列表、问题列表接口
  getLiveMsgList(data) {
    return ajax({
      url: '/wscvis/knowledge/getLiveNewsByPage.json',
      data,
    });
  },
  /**
   * 礼物分享页
   */
  getSendGiftInfo(data) {
    return ajax({
      url: '/wscvis/knowledge/getGiftDetail.json',
      data: mapKeysToCamelCase(data),
      toCamelCase: true,
      loading: false,
      rawResponse: true,
    });
  },
  /**
   * 礼物领取页
   */
  getReceiveGiftInfo(data) {
    return ajax({
      url: '/wscvis/knowledge/getGiftShareContent.json',
      data: mapKeysToCamelCase(data),
      toCamelCase: true,
      rawResponse: true,
    });
  },
  /**
   * 礼物领取结果
   */
  getReceiveGiftResult(data) {
    return ajax({
      url: '/wscvis/knowledge/receive.json',
      data: mapKeysToCamelCase(data),
      toCamelCase: true,
    });
  },
  /**
   * 礼物领取列表
   */
  getShareRank(data) {
    return ajax({
      url: '/wscvis/knowledge/getGiftShareRankInfo.json',
      data: mapKeysToCamelCase(data),
      toCamelCase: true,
    });
  },
  // 获取分享内容别名
  getShareAlias(data) {
    return ajax({
      url: '/wscvis/knowledge/getShareAlias.json',
      data: mapKeysToCamelCase(data),
      toCamelCase: true,
    });
  },

  /**
   * 静默分销员，检查用户身份,并静默注册成为分销员
   */
  postDistributor(data = {}) {
    return ajax({
      url: '/wscvis/knowledge/distributor.json',
      type: 'post',
      data,
    });
  },

  /**
   * 静默分销员，检查用户身份,并静默注册成为分销员 新接口
   */
  postRegister(data = {}) {
    return ajax({
      url: '/wscvis/knowledge/register.json',
      type: 'post',
      data: Object.assign(data, {
        kdtId: global.kdt_id,
      }),
    });
  },

  /**
   * 短链生成
   */
  getShortUrl(data) {
    return ajax({
      url: '/v2/common/url/shorten.json',
      data,
    });
  },

  /**
   * 关联商品推荐
   */
  findRecommend(data) {
    return ajax({
      url: '/wscvis/knowledge/goodsrecommend/recommend.json',
      data,
    });
  },

  /**
   * 已购买课程
   */
  fetchStudentCourseList: data => ajax({ method: 'GET', url: '/wscvis/edu/studentCourse.json', data }),

  /**
   * 获取讲师信息
   */
  fetchLecturerInfo: data => captainAjax({ method: 'GET', url: '/wscvis/knowledge/getLectorUserByWxUidV2.json', data }),

  // 专栏是否支持群打卡
  getSupportPunch(data) {
    return ajax({
      url: '/wscvis/punch/getSupportPunch.json',
      method: 'POST',
      data,
      loading: false,
    });
  },
};

// 获取店铺导航 todo: 提取到公共方法中
assign(Api, {
  // 获取分销员信息
  getShareData(data) {
    return ajax({
      url: `${salesmanWapUrl}/share/recommend/getShare`,
      data,
      loading: false,
      withCredentials: true,
    });
  },
  // 分销员
  getSellerData(data) {
    return ajax({
      url: `${salesmanWapUrl}/share/recommend/popboxJson`,
      dataType: 'json',
      data,
      loading: false,
      withCredentials: true,
    });
  },

  // 群聊上传图片
  postImg(data) {
    return ajax({
      url: 'https://up.yzcdn.cn',
      data,
      contentType: 'multipart/form-data',
      type: 'post',
      timeout: 60000,
      loading: false,
    });
  },

  // 上传音频接口
  postAudio(data) {
    return ajax({
      url: '/wscvis/knowledge/wxMediaDownLoadAsyn.json',
      data: Object.assign({
        'dp_id': global.kdt_id,
      }, data),
      timeout: 5000,
      loading: false,
    });
  },

  // 上传音频接口，支持高保真
  postAudioHigh(data) {
    return ajax({
      url: '/wscvis/knowledge/highWxMediaDownLoadAsyn.json',
      data: Object.assign({
        'dpId': global.kdt_id,
      }, data),
      timeout: 5000,
      loading: false,
    });
  },

  // 根据pct alias 查询goodsid
  getGoodsId: adapter.getGoodsId(function(data) {
    return ajax({
      url: '/wscvis/product-common/getByAlias.json',
      data,
      loading: false,
    });
  }),

  postNetMaterial(data) {
    return ajax({
      url: '/wscvis/fetchPublicImage.json',
      type: 'POST',
      data,
      loading: false,
    });
  },

  /** ************ 获取二维码，以后都用这个接口  ************* */
  getQrCode(data) {
    return ajax({
      url: '/wscvis/knowledge/qrcode.json',
      data,
      loading: false,
    });
  },

  /** ************ 收益页面相关接口  ************* */
  // 获取收益金额
  getProfitInfo(data) {
    return ajax({
      url: '/wscvis/knowledge/profitInfo.json',
      data,
      loading: false,
    });
  },

  // 获取收益明细
  getProfitDetail(data) {
    return ajax({
      url: '/wscvis/knowledge/profitDetail.json',
      data,
      loading: false,
    });
  },

  // 获取推荐有礼活动信息
  getRefferalInfo(data) {
    return ajax({
      url: '/wscvis/knowledge/refferal.json',
      data,
      loading: false,
    });
  },

  // 开通商户号
  getAccountBussinessNumber(data) {
    return ajax({
      url: '/wscvis/knowledge/accountBussinessNumber.json',
      data,
      loading: false,
    });
  },

  // 获取海报背景图
  getFindRelatedImgApi(data) {
    return ajax({
      url: '/wscvis/knowledge/getFindRelatedImg.json',
      data,
      loading: false,
    });
  },

  // 获取自定义海报背景图列表
  getPosterImgList(data) {
    return ajax({
      url: '/wscvis/knowledge/getPosterImgList.json',
      data: Object.assign(data, {
        kdtId: global.kdt_id,
      }),
    });
  },

  /**
   * 前端上报数据
   */
  postSkynetJson(data) {
    return ajax({
      url: 'https://h5.youzan.com/wscvis/knowledge/utils/skynetlog.json', // 下单页域名收敛为cashier域名，因此此处要绝对路径
      type: 'post',
      data,
      loading: false,
    });
  },

  /**
   * 获取公众号关注状态
   */
  getWxFollowStatus(data) {
    return ajax({
      url: '/wscvis/knowledge/utils/wxFollowStatus.json',
      data,
      loading: false,
    });
  },

  /**
   * 获取内容详情页->（专栏）目录状态
   */
  getIsPaid(data) {
    return ajax({
      url: '/wscvis/knowledge/getIsPaid.json',
      data,
      loading: false,
    });
  },

  /**
   * 获取专栏详情页->免费内容列表
   */
  getFreeContentAndLive(data) {
    return ajax({
      url: '/wscvis/knowledge/getFreeContentAndLive.json',
      data,
      loading: false,
    });
  },

  /**
   * 更新讲师信息
   */
  updateUserInfo: data => captainAjax({ method: 'POST', url: '/wscvis/knowledge/updateUserInfo.json', data }),

  // 线下课列表
  findPageStuSchedule(data) {
    return ajax({
      url: '/wscvis/edu/findPageStuSchedule.json',
      data,
      loading: false,
    });
  },

  /**
   * 我购买的课程页面，获取不同类目下是否存在内容,来决定是否展示对应tab
   * http://zanapi.qima-inc.com/site/service/view/476060
   *
   * @return {Object} exist status
   */
  checkExist() {
    return ajax({
      url: '/wscvis/knowledge/mypay/checkExist.json',
    });
  },

  getSeckillInfo(alias) {
    return ajax({
      url: '/wscvis/seckill/info.json',
      data: {
        alias,
      },
    });
  },

  seckillAppointment(id) {
    return ajax({
      url: '/wscvis/seckill/appointment.json',
      method: 'post',
      data: {
        id,
      },
    });
  },

  /**
   * 获取保利威直播间链接
   *
   * @param {string} alias 商品别名
   * @return {Promise}
   */
  getPolyvLiveLink(alias) {
    return ajax({
      url: '/wscvis/knowledge/getLiveLink.json',
      data: {
        alias,
      },
    });
  },

  // 获取教育直播间链接
  getEduLiveLink(alias) {
    return ajax({
      url: '/wscvis/course/live/video/getEduLiveLink.json',
      data: {
        alias,
      },
    });
  },

  getGroupOnDetail(data) {
    return ajax({
      url: '/wscvis/ump/groupon/getGroupOnDetail.json',
      data,
    });
  },
});

export default Api;
