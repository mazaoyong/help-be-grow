import _ajax from 'captain-ajax';
import { ajax } from '@youzan/vis-ui';
import { unwrapCourseDetail } from './utils';

const baseUrl = '/wscvis/edu';

const { kdt_id: kdtId } = window._global;

// 对ajax进行包裹
function ajaxWrap(options) {
  const { url, ...resOpts } = options;
  return _ajax({
    ...resOpts,
    withCredentials: true,
    url: options.absolutePath ? url : `${baseUrl}${url}`,
  });
}

const API = {
  getTeacherInfo(payload) {
    return ajaxWrap({
      url: '/getTeacherInfo.json',
      method: 'GET',
      data: Object.assign(payload, {
        kdtId,
      }),
    });
  },

  loadMoreCourse(payload) {
    return ajaxWrap({
      url: '/loadMoreCourse.json',
      method: 'GET',
      data: Object.assign(payload, {
        kdtId,
      }),
    });
  },

  getStudentList() {
    return ajaxWrap({
      url: '/getStudentList.json',
      method: 'GET',
      data: {
        kdtId,
      },
    });
  },

  // 获取上次选择的学员
  getRecentStudent() {
    return ajaxWrap({
      url: '/getRecentStudent.json',
      method: 'GET',
    });
  },

  // 获取推荐商品
  getRecommandCourse() {
    return ajaxWrap({
      url: '/getRecommandCourseV2.json',
      method: 'GET',
    });
  },

  getOrderPaidStatement(payload) {
    return ajaxWrap({
      url: '/getPayStatement.json',
      method: 'GET',
      data: Object.assign(payload, {
        kdtId,
      }),
    });
  },

  // 获取地址列表
  getAddressList(data) {
    return ajaxWrap({
      url: '/getAddressList.json',
      method: 'GET',
      data: Object.assign(data, {
        kdtId,
      }),
    });
  },

  // 预下单接口
  getPreOrderInfo(data) {
    return ajaxWrap({
      url: '/getPreOrderInfo.json',
      method: 'GET',
      data: Object.assign(data, {
        kdtId,
        t: new Date().getTime(),
      }),
    });
  },

  // 获取学员的详细信息
  getStudentDetail(data) {
    return ajaxWrap({
      url: '/getStudentDetail.json',
      method: 'GET',
      data: Object.assign(data, {
        kdtId,
        t: new Date().getTime(),
      }),
    });
  },

  // 下单接口
  postOrderConfirm(data) {
    return ajaxWrap({
      url: `/postOrderConfirm.json?kdt_id=${kdtId}`, // 在小程序webview内不会带上kdtId，需要手动加上
      method: 'POST',
      data: Object.assign(data, {
        kdtId,
      }),
    });
  },

  // 获取课程详情 使用新接口
  getCourseDetail(data) {
    return ajaxWrap({
      url: '/course-v3/getCourseDetail.json',
      method: 'GET',
      data: Object.assign(data, {
        kdtId,
      }),
    }).then(data => {
      if (data.data) {
        data.data = unwrapCourseDetail(data.data);
      }
      return data;
    });
  },

  // 获取课程设置
  getCourseSetting(data) {
    return ajaxWrap({
      url: '/findCourseSetting.json',
      method: 'GET',
      data: Object.assign(data, {
        kdtId,
      }),
    });
  },

  // 获取商品库存信息
  getProductStockApi(data) {
    return ajaxWrap({
      url: '/getProductStockFromMall.json',
      method: 'GET',
      data: Object.assign(data, {
        kdtId,
      }),
    });
  },

  // 获取活动信息，比如分销之类的
  getActivities(data) {
    return ajaxWrap({
      absolutePath: true,
      url: 'https://h5.youzan.com/wscvis/knowledge/getActivityInfos.json',
      method: 'GET',
      data: Object.assign(data, {
        kdtId,
      }),
    });
  },

  // 获取课程评价
  getEvaluateData(data) {
    return ajaxWrap({
      url: '/getEvaluateData.json',
      method: 'GET',
      data: Object.assign(data, {
        kdtId,
      }),
    });
  },

  // 好友助力
  buildZanSet(data) {
    return ajaxWrap({
      absolutePath: true,
      url: 'https://h5.youzan.com/wscvis/knowledge/buildZanSet.json',
      method: 'GET',
      data: Object.assign(data, {
        kdtId,
      }),
    });
  },

  /** ******** 评价相关的接口 ******** */
  // 获取评价权限
  getEvaluationPermissionApi(data) {
    return ajaxWrap({
      url: '/evaluation/getEvaluationPermission.json',
      data: Object.assign(data, {
        kdtId,
      }),
    });
  },

  // 评价点赞
  likeApi(data) {
    return ajaxWrap({
      url: '/evaluation/like.json',
      method: 'POST',
      data: Object.assign(data, {
        kdtId,
      }),
    });
  },

  // 取消赞
  cancelLikeApi(data) {
    return ajaxWrap({
      url: '/evaluation/cancelLike.json',
      method: 'POST',
      data: Object.assign(data, {
        kdtId,
      }),
    });
  },

  doLikeApi(data, isThumb = true) {
    if (isThumb) {
      return this.likeApi(data);
    }
    return this.cancelLikeApi(data);
  },

  // 获取评价列表
  getEvaluationsApi(data) {
    return ajaxWrap({
      url: '/evaluation/list.json',
      data: Object.assign(data, {
        kdtId,
      }),
    });
  },

  // 获取评价统计
  getEvaluationCountApi(data) {
    return ajaxWrap({
      url: '/evaluation/evaluationCount.json',
      data: Object.assign(data, {
        kdtId,
      }),
    });
  },

  // 获取最新一条评价及评价总数
  getLastEvaluationApi(data) {
    return ajaxWrap({
      url: '/evaluation/lastEvaluation.json',
      data: Object.assign(data, {
        kdtId,
      }),
    });
  },

  // 获取评价详情
  getEvaluationDetailApi(data) {
    return ajaxWrap({
      url: '/evaluation/detail.json',
      data: Object.assign(data, {
        kdtId,
      }),
    });
  },

  // 创建评价
  createEvaluationApi(data) {
    return ajaxWrap({
      url: '/evaluation/createEvaluation.json',
      method: 'POST',
      data: Object.assign(data, {
        kdtId,
      }),
    });
  },

  // 追评
  createEvaluationAdditionApi(data) {
    return ajaxWrap({
      url: '/evaluation/createEvaluationAddition.json',
      method: 'POST',
      data: Object.assign(data, {
        kdtId,
      }),
    });
  },
  // 下单成页面获取加群二维码
  getPaidStatusPromote(data) {
    return ajax({
      data,
      url: '/wscvis/edu/getPaidStatusPromote.json',
      errorMsg: '获取二维码信息失败',
    });
  },

  // 证书-列表（各种条件）
  findCertificate(data) {
    return ajax({
      data,
      url: '/wscvis/edu/findCertificate.json',
      errorMsg: '获取证书列表失败',
      loading: false,
    });
  },

  // 证书-弹窗状态
  batchUpdatePopStatus(data) {
    return ajax({
      data,
      method: 'POST',
      url: '/wscvis/edu/batchUpdatePopStatus.json',
    });
  },

  // 证书-查看状态
  batchUpdateStatus(data) {
    return ajax({
      data,
      method: 'POST',
      url: '/wscvis/edu/batchUpdateStatus.json',
    });
  },

  // 证书-模版记录
  increaseQrScanNum(data) {
    return ajax({
      data,
      method: 'POST',
      url: '/wscvis/edu/increaseQrScanNum.json',
    });
  },
  // 二维码接口
  getQrCode(data) {
    return ajax({
      url: '/wscvis/knowledge/qrcode.json',
      data,
      loading: false,
    });
  },

  // 获取奖励记录列表
  getRewardRecordList: data =>
    ajax({
      url: '/wscvis/edu/reward/listCustomRewardRecord.json',
      data,
    }),

  // 领取奖励
  redeemReward: data =>
    ajax({
      url: '/wscvis/edu/reward/redeemReward.json',
      method: 'POST',
      data,
    }),

  // 获取课程奖励活动
  findCourseProductRewardActivity: data =>
    ajax({
      url: '/wscvis/edu/reward/findCourseProductRewardActivity.json',
      data,
    }),

  getRewardTip: data =>
    ajax({
      url: '/wscvis/edu/reward/getRewardTip.json',
      data,
    }),

  getRewardWindow: data =>
    ajax({
      url: '/wscvis/edu/reward/getRewardWindow.json',
      data,
      loading: false,
    }),

  // 支付成功页获取预约状态
  hasTradeWithLessonAppointment(data) {
    return ajax({
      url: '/wscvis/edu/hasTradeWithLessonAppointment.json',
      data,
      loading: false,
    });
  },

  // 报名结果页获取报名详情
  getRegistrationInfoById(data) {
    return ajax({
      url: '/wscvis/edu/apply-result/getRegistrationInfoById.json',
      data,
      loading: false,
    });
  },

  getPackageOrderStatus(data) {
    return ajax({
      url: '/wscvis/order/hasPay.json',
      data,
      loading: false,
    });
  },

  getActivityPoster(data) {
    return ajax({
      url: '/wscvis/ump/activity/poster.json',
      data,
      loading: false,
    });
  },

  getCourseTimeAddrByAlias(alias) {
    return ajax({
      url: '/wscvis/edu/reward/getCourseTimeAddrByAlias.json',
      data: {
        alias,
      },
    });
  },

  getCourseTimeAddr(bizId, channel) {
    return ajax({
      url: '/wscvis/edu/reward/getCourseTimeAddr.json',
      data: {
        bizId,
        channel,
      },
    });
  },

  postRewardCourse(data) {
    return ajax({
      method: 'post',
      url: '/wscvis/knowledge/anonymous/course/postRewardCourse.json',
      data,
      loading: false,
    });
  },

  getPaySuccessInfo(orderNo) {
    return ajax({
      url: '/wscvis/order/getPaySuccessInfo.json',
      data: {
        orderNo,
      },
    });
  },

  getCouponRedirect(data) {
    return ajax({
      url: '/wscump/coupon/coupon_use_redirect.json',
      data,
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

  getSeckillInfo(alias) {
    return ajax({
      url: '/wscvis/seckill/info.json',
      data: {
        alias,
      },
    });
  },

  // 根据商品id或者别名查询商品的基本信息
  getProductBasicInfo(data) {
    return ajax({
      url: '/wscvis/findSimpleCourseList.json',
      data,
    });
  },

  getGroupOnDetail(data) {
    return ajax({
      url: '/wscvis/ump/groupon/getGroupOnDetail.json',
      data,
    });
  },
};

export default API;
