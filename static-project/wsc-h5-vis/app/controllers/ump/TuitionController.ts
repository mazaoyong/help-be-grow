import { Context } from 'astroboy';
import BaseController from '../base/BaseNewController';
import TuitionCustomerFacade from '../../services/api/owl/api/TuitionCustomerFacade';
import StudentAttributeFacade from '../../services/api/owl/api/StudentAttributeFacade';
import ActivityCommonFacade from '../../services/api/owl/api/ActivityCommonFacade';
import { ITuitionCollectZanCommand } from 'definitions/api/owl/api/TuitionCustomerFacade/collectZan';
import { ITuitionRollingTextQuery } from 'definitions/api/owl/api/TuitionCustomerFacade/listLatestRollingText';
import { ITuitionParticipateCommand } from 'definitions/api/owl/api/TuitionCustomerFacade/participate';
import {
  IPageRequest,
  ITuitionHelperQuery,
} from 'definitions/api/owl/api/TuitionCustomerFacade/listHelperPaged';
import { ITuitionGoodsListQuery } from 'definitions/api/owl/api/TuitionCustomerFacade/listGoodsPaged';
import { ITuitionHelpStatusQuery } from 'definitions/api/owl/ump/TuitionCustomerFacade/getUserHelpStatus';
import { IActivityGoodsQuery } from 'definitions/api/owl/api/ActivityCommonFacade/findGoodsByPage';
import { ITuitionSendVerifyCodeCommand } from 'definitions/api/owl/api/TuitionCustomerFacade/sendVerifyCode';

class TuitionController extends BaseController {
  /** @desciption 渲染落地页面 */
  async renderLandingPage() {
    await this.baseAcl({
      forceOauthLogin: true,
      weixinOauthScope: 'snsapi_userinfo',
    });

    this.setSpm('tuition', this.ctx.kdtId);

    // await this.setGlobalTheme();
    await this.ctx.render('ump/tuition.html');
  }

  /** @desciption 给好友点赞 -- 通用命名 */
  async postCollectZanJson(ctx: Context) {
    const requestData = ctx.getRequestData();

    const { fromInstanceId } = requestData;
    const collectZanCommand: ITuitionCollectZanCommand = {
      instanceId: Number(fromInstanceId),
      userId: ctx.userId,
    };

    const result = await new TuitionCustomerFacade(ctx).collectZan(
      ctx.kdtId,
      collectZanCommand,
    );
    ctx.json(0, 'ok', result);
  }

  /** @desciption 获取落地页活动聚合信息 */
  async getGetDetailJson(ctx: Context) {
    const query = ctx.getRequestData();
    this.validator.required(query.alias, '缺少参数 alias');
    query.userId = ctx.userId;
    const result = await new TuitionCustomerFacade(ctx).getDetail(
      ctx.kdtId,
      query,
    );
    ctx.json(0, 'ok', result);
  }

  /** @desciption 查询最新滚动信息， 默认10条 */
  async getListLatestRollingTextJson(ctx: Context) {
    const requestData = ctx.getQueryParse();
    const query: ITuitionRollingTextQuery = requestData;

    const result = await new TuitionCustomerFacade(ctx).listLatestRollingText(
      ctx.kdtId,
      query,
    );
    ctx.json(0, 'ok', result);
  }

  /** @desciption 发起一个攒学费实例 */
  async postParticipateJson(ctx: Context) {
    const requestData = ctx.getRequestData();
    const createCommand: ITuitionParticipateCommand = {
      ...requestData,
      userId: ctx.userId,
    };

    const result = await new TuitionCustomerFacade(ctx).participate(
      ctx.kdtId,
      createCommand,
    );
    ctx.json(0, 'ok', result);
  }

  /** @desciption 查询助力列表 -- 要不要分页待定 */
  async getListHelperPagedJson(ctx: Context) {
    const requestData = ctx.getQueryParse();
    const pageRequest: IPageRequest = requestData.pageRequest;
    const query: ITuitionHelperQuery = requestData.query;

    const result = await new TuitionCustomerFacade(ctx).listHelperPaged(
      ctx.kdtId,
      pageRequest,
      query,
    );
    ctx.json(0, 'ok', result);
  }

  /** @desciption 查询参与活动的商品列表 */
  async getListGoodsPagedJson(ctx: Context) {
    const requestData = ctx.getRequestData();
    const pageRequest: IPageRequest = requestData.pageRequest;
    const query: ITuitionGoodsListQuery = requestData.query;

    const result = await new TuitionCustomerFacade(ctx).listGoodsPaged(
      ctx.kdtId,
      pageRequest,
      query,
    );
    ctx.json(0, 'ok', result);
  }

  /** @desciption 根据资料项id ， 获取学员资料项 */
  async getListAttributeByIdListJson() {
    const { ctx } = this;
    const requestData = ctx.getRequestData();
    const attributeIds: Array<number> = requestData.attributeIds;

    const result = await new StudentAttributeFacade(ctx).listAttributeByIdList(
      ctx.kdtId,
      attributeIds,
    );
    ctx.success(result);
  }

  /** @desciption 判断当前用户活动维度+实例维度 点赞状态。 （也可以拆成两个接口） */
  async getGetUserHelpStatusJson() {
    const { ctx } = this;
    const requestData = ctx.getQueryData();
    const { alias, fromInstanceId } = requestData;
    const helpStatusQuery: ITuitionHelpStatusQuery = {
      alias,
      fromInstanceId,
      userId: ctx.userId,
    };

    const result = await new TuitionCustomerFacade(ctx).getUserHelpStatus(
      ctx.kdtId,
      helpStatusQuery,
    );
    ctx.success(result);
  }

  /** @desciption 查询活动关联商品(通用能力) */
  async getFindGoodsByPageJson() {
    const { ctx } = this;
    const requestData = ctx.getQueryParse();
    const pageRequest: IPageRequest = requestData.pageRequest;
    const query: IActivityGoodsQuery = requestData.query;

    const result = await new ActivityCommonFacade(ctx).findGoodsByPage(
      ctx.kdtId,
      {
        pageSize: Number(pageRequest.pageSize),
        pageNumber: Number(pageRequest.pageNumber),
      },
      {
        activityId: Number(query.activityId),
      },
    );
    ctx.success(result);
  }

  /** @desciption 发送验证码 */
  async postSendVerifyCodeJson() {
    const { ctx } = this;
    const requestData = ctx.getPostData();
    const { alias, mobile } = requestData;
    const sendVerifyCodeCommand: ITuitionSendVerifyCodeCommand = {
      alias,
      mobile,
    };

    const result = await new TuitionCustomerFacade(ctx).sendVerifyCode(
      ctx.kdtId,
      sendVerifyCodeCommand,
    );
    ctx.success(result);
  }
}

export = TuitionController;
