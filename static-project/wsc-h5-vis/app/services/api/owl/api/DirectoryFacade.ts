import BaseService from "../../../base/BaseService";
import {
  IPageRequest,
  IQueryDirectoryDTO,
  IPage,
  IDirectoryDTO
} from "definitions/api/owl/api/DirectoryFacade/queryDirectoryList";

class DirectoryFacade extends BaseService {
  public readonly SERVICE_NAME =
    "com.youzan.owl.api.client.onlinecourse.DirectoryFacade";

  /**
   * @description 查询目录树
   * @link http://zanapi.qima-inc.com/site/service/view/1029385
   */
  async queryDirectoryList(
    kdtId: number,
    pageRequest: IPageRequest,
    queryDTO: IQueryDirectoryDTO
  ): Promise<IPage<IDirectoryDTO>> {
    return this.invoke("queryDirectoryList", [kdtId, pageRequest, queryDTO]);
  }
}

export = DirectoryFacade;
