import BaseService from "../../../base/BaseService";
import { ITuitionParticipateCommand } from "definitions/api/owl/api/TuitionCustomerFacade/participate";
import {
  ITuitionRollingTextQuery,
  ITuitionRollingTextDTO
} from "definitions/api/owl/api/TuitionCustomerFacade/listLatestRollingText";
import { ITuitionCollectZanCommand } from "definitions/api/owl/api/TuitionCustomerFacade/collectZan";
import {
  ITuitionDetailQuery,
  ITuitionAggregateDTO,
  ITuitionHelperDTO
} from "definitions/api/owl/api/TuitionCustomerFacade/getDetial";
import {
  IPageRequest,
  ITuitionHelperQuery,
  IPage
} from "definitions/api/owl/api/TuitionCustomerFacade/listHelperPaged";
import {
  ITuitionGoodsListQuery,
  ITuitionGoodsDTO
} from "definitions/api/owl/api/TuitionCustomerFacade/listGoodsPaged";
import { ITuitionHelpStatusQuery } from "definitions/api/owl/ump/TuitionCustomerFacade/getUserHelpStatus";
import { ITuitionSendVerifyCodeCommand } from "definitions/api/owl/api/TuitionCustomerFacade/sendVerifyCode";

class TuitionCustomerFacade extends BaseService {
  public readonly SERVICE_NAME =
    "com.youzan.owl.api.client.ump.tuition.TuitionCustomerFacade";

  /**
   * @description 给好友点赞 -- 通用命名
   * @link http://zanapi.qima-inc.com/site/service/view/944433
   */
  async collectZan(
    kdtId: number,
    collectZanCommand: ITuitionCollectZanCommand
  ): Promise<boolean> {
    return this.invoke("collectZan", [kdtId, collectZanCommand]);
  }

  /**
   * @description 获取落地页活动聚合信息
   * @link http://zanapi.qima-inc.com/site/service/view/951285
   */
  async getDetail(
    kdtId: number,
    query: ITuitionDetailQuery
  ): Promise<ITuitionAggregateDTO> {
    return this.invoke("getDetail", [kdtId, query]);
  }

  /**
   * @description 查询最新滚动信息， 默认10条
   * @link http://zanapi.qima-inc.com/site/service/view/944454
   */
  async listLatestRollingText(
    kdtId: number,
    query: ITuitionRollingTextQuery
  ): Promise<Array<ITuitionRollingTextDTO>> {
    return this.invoke("listLatestRollingText", [kdtId, query]);
  }

  /**
   * @description 发起一个攒学费实例
   * @link http://zanapi.qima-inc.com/site/service/view/944432
   */
  async participate(
    kdtId: number,
    createCommand: ITuitionParticipateCommand
  ): Promise<boolean> {
    return this.invoke("participate", [kdtId, createCommand]);
  }

  /**
   * @description 查询助力列表 -- 要不要分页待定
   * @link http://zanapi.qima-inc.com/site/service/view/946215
   */
  async listHelperPaged(
    kdtId: number,
    pageRequest: IPageRequest,
    query: ITuitionHelperQuery
  ): Promise<IPage<ITuitionHelperDTO>> {
    return this.invoke("listHelperPaged", [kdtId, pageRequest, query]);
  }

  /**
   * @description 查询参与活动的商品列表
   * @link http://zanapi.qima-inc.com/site/service/view/946216
   */
  async listGoodsPaged(
    kdtId: number,
    pageRequest: IPageRequest,
    query: ITuitionGoodsListQuery
  ): Promise<IPage<ITuitionGoodsDTO>> {
    return this.invoke("listGoodsPaged", [kdtId, pageRequest, query]);
  }

  /**
   *  判断当前用户活动维度+实例维度 点赞状态。 （也可以拆成两个接口）
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/951271
   *
   *  @param {number} kdtId -
   *  @param {Object} helpStatusQuery -
   *  @param {number} helpStatusQuery.fromInstanceId - 分享来源的实例id
   *  @param {string} helpStatusQuery.alias - 活动alias
   *  @param {number} helpStatusQuery.userId - 当前用户id
   *  @return {Promise}
   */
  async getUserHelpStatus(
    kdtId: number,
    helpStatusQuery: ITuitionHelpStatusQuery
  ) {
    return this.invoke("getUserHelpStatus", [kdtId, helpStatusQuery]);
  }

  /**
   * @description 发送验证码
   * @link http://zanapi.qima-inc.com/site/service/view/946989
   */
  async sendVerifyCode(
    kdtId: number,
    sendVerifyCodeCommand: ITuitionSendVerifyCodeCommand
  ): Promise<boolean> {
    return this.invoke("sendVerifyCode", [kdtId, sendVerifyCodeCommand]);
  }
}

export = TuitionCustomerFacade;
