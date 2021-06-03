/* com.youzan.owl.api.common.UploadTokenFacade -  */
const BaseService = require('../../base/BaseService');

class UploadTokenFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.common.UploadTokenFacade';
  }

  /**
             *  七牛素材中心 token 接口收拢
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/508326
*
             *  @param {number} kdtId -
             *  @param {Object} tokenQuery -
             *  @param {number} tokenQuery.storeType - 存储维度(必填) 1:店铺/合作方维度(店铺/租户隔离素材库); 2:通用维度(业务方素材库)
 {@link StoreTypeEnum}
             *  @param {number} tokenQuery.mediaAccessType - 媒体访问权限(必填) 1:公开；2:私有
 {@link MediaAccessTypeEnum}
             *  @param {string} tokenQuery.ip - ip
             *  @param {number} tokenQuery.mediaType - 媒体类型(必填)
 {@link com.youzan.material.materialcenter.api.enums.media.MediaTypeEnum}
             *  @param {number} tokenQuery.operatorType - 操作人帐号类型 1:有赞账号用户id; 2:内部员工统一账号id; 3:未知
 {@link OperatorTypeEnum}
             *  @param {number} tokenQuery.operatorId - 操作人帐号id
             *  @returns {string}
             */
  async getQiniuAggregateUploadToken(kdtId, tokenQuery) {
    return this.invoke('getQiniuAggregateUploadToken', [kdtId, tokenQuery]);
  }
}

module.exports = UploadTokenFacade;
