const BaseController = require('../base/BaseController');
const GciBusinessService = require('../../services/owl/gci/GciBusinessService');
const GciTaskService = require('../../services/owl/gci/GciTaskService');
const GciLogService = require('../../services/owl/gci/GciLogService');
const GciCommentService = require('../../services/owl/gci/GciCommentService');
const GciColumnService = require('../../services/owl/gci/GciColumnService');
const CouponGroupService = require('../../services/ump/asset/CouponGroupService');
const { checkEduChainStore } = require('@youzan/utils-shop');

class PunchController extends BaseController {
  async getIndexHtml(ctx) {
    ctx.setState('isEduChainStore', checkEduChainStore(ctx.getState('shopInfo')));

    await this.setPointsName();
    await ctx.render('ump/punch/index.html');
  }
  // 获取打卡列表
  async getListJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};
    req.kdtId = kdtId;

    this.validator.required(kdtId, '参数 kdtId 不能为空');

    const res = await new GciBusinessService(ctx).list(req);
    ctx.json(0, 'ok', res);
  }

  // 新建打卡
  async postActiveJson(ctx) {
    const kdtId = ctx.kdtId;
    let req = ctx.request.body || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');
    req.kdtId = kdtId;

    req = await ctx.visXss(req, 'description', 'designSanitize');
    const res = await new GciBusinessService(ctx).create(req);

    return ctx.json(0, 'ok', res);
  }

  // 获取打卡详情
  async getActiveJson(ctx) {
    const kdtId = ctx.kdtId;
    const { gciAlias } = ctx.request.query || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');
    this.validator.required(gciAlias, '打卡别名 gciAlias 不能为空');

    const res = await new GciBusinessService(ctx).detail(kdtId, gciAlias);

    const couponids = [];

    // 打卡优惠券数据拼接
    if (Array.isArray(res.gciRewardSettingS)) {
      res.gciRewardSettingS.forEach(item => {
        if (item.rewardType === 1 && item.rewardId) {
          couponids.push(parseInt(item.rewardId));
        }
      });

      // batch require coupon detail
      const coupons = await Promise.all(couponids.map(id => {
        return new CouponGroupService(ctx).getBase(kdtId, id);
      }));

      const couponMap = {};

      // turn array to map
      coupons.forEach(item => {
        couponMap[parseInt(item.id)] = item;
      });

      // assign coupon detail to gci reward setting
      res.gciRewardSettingS = res.gciRewardSettingS.map(item => {
        if (item.rewardType === 1) {
          const coupon = couponMap[parseInt(item.rewardId)];

          return Object.assign({}, item, {
            remainQty: coupon.stockQty, // 数量
            title: coupon.title,
            preferentialDesc: coupon.formativeContext, // 优惠内容
          });
        }
        return item;
      });
    }

    return ctx.json(0, 'ok', res);
  }

  // 更新打卡
  async putActiveJson(ctx) {
    const kdtId = ctx.kdtId;
    let req = ctx.request.body || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');
    req.kdtId = kdtId;

    req = await ctx.visXss(req, 'description', 'designSanitize');
    const res = await new GciBusinessService(ctx).update(req);

    return ctx.json(0, 'ok', res);
  }

  // 删除打卡活动
  async deleteActiveJson(ctx) {
    const kdtId = ctx.kdtId;
    const { gciAlias, operator } = ctx.request.body || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');
    this.validator.required(gciAlias, '打卡别名 gciAlias 不能为空');
    this.validator.required(operator, '操作人 operator 不能为空');

    const res = await new GciBusinessService(ctx).delete([kdtId, gciAlias, operator]);

    return ctx.json(0, 'ok', res);
  }

  // 上下架群打卡
  async putStatusJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');
    req.kdtId = kdtId;

    const res = await new GciBusinessService(ctx).upOrDown(req);

    return ctx.json(0, 'ok', res);
  }

  // 获取群打卡简要信息
  async getBriefJson(ctx) {
    const kdtId = ctx.kdtId;
    const { gciAlias } = ctx.request.query || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');
    this.validator.required(gciAlias, '打卡别名 gciAlias 不能为空');

    const res = await new GciBusinessService(ctx).brief(kdtId, gciAlias);

    return ctx.json(0, 'ok', res);
  }

  // 获取打卡统计信息
  async getStatisticsJson(ctx) {
    const kdtId = ctx.kdtId;
    const { gciAlias } = ctx.request.query || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');
    this.validator.required(gciAlias, '打卡别名 gciAlias 不能为空');

    const res = await new GciBusinessService(ctx).getStatistics(kdtId, gciAlias);

    return ctx.json(0, 'ok', res);
  }

  // 获取群打卡的推广配置
  async getPromotionJson(ctx) {
    const kdtId = ctx.kdtId;
    const { gciAlias } = ctx.request.query || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');
    this.validator.required(gciAlias, '打卡别名 gciAlias 不能为空');

    const res = await new GciBusinessService(ctx).getPromotionSetting(kdtId, gciAlias);

    return ctx.json(0, 'ok', res);
  }

  // 更新群打卡推广配置
  async putPromotionJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');
    req.kdtId = kdtId;

    const res = await new GciBusinessService(ctx).updateGciPromotionSetting(req);

    return ctx.json(0, 'ok', res);
  }

  // 获取任务列表
  async getTaskListJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');
    req.kdtId = kdtId;

    const res = await new GciTaskService(ctx).list(req);
    ctx.json(0, 'ok', res);
  }

  // 获取打卡详情
  async getTaskJson(ctx) {
    const kdtId = ctx.kdtId;
    const { taskId } = ctx.request.query || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');
    this.validator.required(taskId, '打卡任务 taskId 不能为空');

    const res = await new GciTaskService(ctx).detail(kdtId, taskId);

    return ctx.json(0, 'ok', res);
  }

  // 更新打卡任务
  async putTaskJson(ctx) {
    const kdtId = ctx.kdtId;
    let req = ctx.request.body || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');

    req = await ctx.visXss(req, 'taskContent', 'designSanitize');
    req.kdtId = kdtId;

    const res = await new GciTaskService(ctx).update(req);

    return ctx.json(0, 'ok', res);
  }

  // 查询评论列表
  async getLogsJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');
    req.kdtId = kdtId;

    const res = await new GciLogService(ctx).list(req);

    ctx.json(0, 'ok', res);
  }

  // 获取老师评论列表
  async getTeacherLogsJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');
    req.kdtId = kdtId;

    const res = await new GciCommentService(ctx).teacherList(req);

    ctx.json(0, 'ok', res);
  }

  // 删除老师评论
  async deleteLogsJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');
    req.kdtId = kdtId;

    const res = await new GciCommentService(ctx).delete(req);

    ctx.json(0, 'ok', res);
  }

  // 更新打卡日记精选状态
  async putSelectionStatus(ctx) {
    const kdtId = ctx.kdtId;
    const { gciLogId, selectionStatus } = ctx.request.body || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');

    const res = await new GciLogService(ctx).updateSelectionStatus(
      kdtId,
      gciLogId,
      selectionStatus,
    );

    ctx.json(0, 'ok', res);
  }

  // 更新打卡日记精选状态
  async putShowStatus(ctx) {
    const kdtId = ctx.kdtId;
    const { gciLogId, showStatus } = ctx.request.body || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');

    const res = await new GciLogService(ctx).updateShowStatus(kdtId, gciLogId, showStatus);

    ctx.json(0, 'ok', res);
  }

  // 老师点评
  async postLogsJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};
    this.validator.required(kdtId, '参数 kdtId 不能为空');
    req.kdtId = kdtId;

    const res = await new GciCommentService(ctx).commentLog(req);

    ctx.json(0, 'ok', res);
  }

  // 查询学员数据
  async getStudentJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');
    req.kdtId = kdtId;

    const res = await new GciBusinessService(ctx).listStudentData(req);

    return ctx.json(0, 'ok', res);
  }

  // 查询每日数据
  async getDailyJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');
    req.kdtId = kdtId;

    const res = await new GciBusinessService(ctx).listDailyData(req);

    return ctx.json(0, 'ok', res);
  }

  // 导出数据
  async export(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};
    const { operatorPhone, operatorName } = this.operator;

    this.validator.required(kdtId, '参数 kdtId 不能为空');
    req.kdtId = kdtId;

    const res = await new GciBusinessService(ctx).export({
      ...req,
      operatorName,
      operatorMobile: operatorPhone,
    });

    return ctx.json(0, 'ok', res);
  }

  // 页查询专栏列表
  async getColumnListJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');
    req.kdtId = kdtId;

    const res = await new GciColumnService(ctx).getCloumnList(req);
    return ctx.json(0, 'ok', res);
  }

  // 微页面查询打卡列表
  async getWymListJson(ctx) {
    const kdtId = ctx.kdtId;
    const { title, page_size: size, page } = ctx.request.query || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');

    const res = await new GciBusinessService(ctx).listGcisPCWymSetting({
      kdtId,
      title,
      page,
      size,
    });
    return ctx.json(0, 'ok', res);
  }
}

module.exports = PunchController;
