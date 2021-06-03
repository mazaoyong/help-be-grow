import BaseService from "../../../base/BaseService";
import { IAttributeInfoDTO } from "definitions/api/owl/api/StudentAttributeFacade/listAttributeByIdList";

class StudentAttributeFacade extends BaseService {
  public readonly SERVICE_NAME =
    "com.youzan.owl.api.client.attributeitem.StudentAttributeFacade";

  /**
   * @description 根据资料项id ， 获取学员资料项
   * @link http://zanapi.qima-inc.com/site/service/view/960926
   */
  async listAttributeByIdList(
    kdtId: number,
    attributeIds: Array<number>
  ): Promise<Array<IAttributeInfoDTO>> {
    return this.invoke("listAttributeByIdList", [kdtId, attributeIds]);
  }
}

export = StudentAttributeFacade;
