import BaseService from '../../../base/BaseService';
import { IYzUserGoodsReqDTO } from 'definitions/api/wecom/ump/FansBenefitCommandService/recordUserGoods';

class FansBenefitCommandService extends BaseService {
  public readonly SERVICE_NAME = 'com.youzan.wecom.ump.api.fansbenefit.FansBenefitCommandService';

  /**
   * @description 上报用户最新浏览商品记录
   * @link http://zanapi.qima-inc.com/site/service/view/1079763
   */
  async recordUserGoods(yzUserGoodsReqDTO: IYzUserGoodsReqDTO): Promise<boolean> {
    return this.invoke('recordUserGoods', [yzUserGoodsReqDTO]);
  }
}

export = FansBenefitCommandService;
