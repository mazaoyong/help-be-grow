import BaseService from "../../../base/BaseService";
import { IQrCodeDTO } from "definitions/api/owl/biz/OwlCommonService/createQrCode";
import {
  IOwlOperateDTO,
  INextOwlInfo
} from "definitions/api/owl/biz/OwlCommonService/getNextOwlInfo";

class OwlCommonService extends BaseService {
  public readonly SERVICE_NAME = "com.youzan.owl.biz.service.OwlCommonService";

  /**
   * @description 二维码
   * @link http://zanapi.qima-inc.com/site/service/view/120835
   */
  async createQrCode(qrCodeDTO: IQrCodeDTO): Promise<string> {
    return this.invoke("createQrCode", [qrCodeDTO]);
  }

  /**
   *  查询当前内容/直播所在专栏下的下一篇内容/直播
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/120834
   *
   *  @param {Object} owlOperateDTO -
   *  @param {number} owlOperateDTO.owlType - 2:内容 4:直播
   *  @param {number} owlOperateDTO.kdtId - 店铺id
   *  @param {string} owlOperateDTO.sortType - 排序类型：desc降序 asc生序
   *  @param {number} owlOperateDTO.channel - 知识类型
   *  @param {Array.<Object>} owlOperateDTO.owlList[] - 知识列表 包括内容/直播
   *  @param {string} owlOperateDTO.alias - 别名
   *  @param {number} owlOperateDTO.buyerId - 用户id
   *  @param {string} owlOperateDTO.columnAlias - 专栏别名
   *  @param {number} owlOperateDTO.serialNo - 序号
   *  @return {Promise}
   */
  async getNextOwlInfo(owlOperateDTO: IOwlOperateDTO): Promise<INextOwlInfo> {
    return this.invoke("getNextOwlInfo", [owlOperateDTO]);
  }
}

export = OwlCommonService;
