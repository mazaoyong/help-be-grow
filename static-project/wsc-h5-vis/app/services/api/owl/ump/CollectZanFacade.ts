import BaseService from "../../../base/BaseService";
import {
  IZanSetQuery,
  ICollectZanSetMixtureDTO,
} from "definitions/api/owl/ump/CollectZanFacade/getZanSetDetail";

class CollectZanFacade extends BaseService {
  get SERVICE_NAME() {
    return "com.youzan.owl.ump.api.collectzan.CollectZanFacade";
  }

  /**
   * @description C端查询发起的集赞详情
   * @link http://zanapi.qima-inc.com/site/service/view/278497
   */
  async getZanSetDetail(
    zanSetQuery: IZanSetQuery
  ): Promise<ICollectZanSetMixtureDTO> {
    return this.invoke("getZanSetDetail", [zanSetQuery]);
  }
}

export = CollectZanFacade;
