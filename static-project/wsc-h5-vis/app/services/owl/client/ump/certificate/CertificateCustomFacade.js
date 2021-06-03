const BaseService = require('../../../../base/BaseService');

class CertificateCustomFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.ump.certificate.CertificateCustomFacade';
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/393485
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query -
   *  @param {string} query.sourceId - 证书来源 id
   *  @param {number} query.certType - 证书类型  1 入学证书 2 毕业证书
   *  @param {number} query.sourceType - 证书来源类型 1 线下课
   *  @param {Array.<Array>} query.certIds[] - 证书 ids
   *  @param {string} query.userName - 用户名称
   *  @param {string} query.title - 证书标题
   *  @param {number} query.popStatus - 证书弹出状态 0 未弹出 1 已弹出
   *  @param {number} query.userId - 学员 id
   *  @param {number} query.status - 证书状态 0 未处理 1 未查看 2 已查看
   *  @return {Promise}
   */
  async find(kdtId, pageRequest, query) {
    return this.invoke('findV2', [kdtId, pageRequest, query]);
    // mock 查看所有
    // return {
    //   content: [
    //     {
    //       assetNo: 'A1629231861727232',
    //       id: 2,
    //       certificateTemplateDTO: {
    //         bgNo: 2,
    //       },
    //       title: '1毕业通知书',
    //       type: 2,
    //       showDatas: {
    //         avatar: 'https://img01.yzcdn.cn/edu/avatar-man@3x.png',
    //         courseName: '语文课第一节',
    //         consumeCount: 5,
    //         duration: '',
    //         checkinDays: 15,
    //         identityName: '翠花上酸菜',
    //       },
    //     },
    //     {
    //       assetNo: 'A1629231861727232',
    //       id: 1,
    //       certificateTemplateDTO: {
    //         bgNo: 1,
    //       },
    //       title: '入学通知书',
    //       type: 1,
    //       showDatas: {
    //         avatar: 'https://img01.yzcdn.cn/edu/avatar-man@3x.png',
    //         courseName: '语文课第一节',
    //         consumeCount: 4,
    //         duration: '',
    //         checkinDays: 10,
    //         identityName: '翠花上酸菜',
    //       },
    //     },
    //     {
    //       createdAt: '1557295352286',
    //       assetNo: 'A1629231861727232',
    //       id: 2,
    //       certificateTemplateDTO: {
    //         bgNo: 2,
    //       },
    //       title: '1毕业通知书',
    //       type: 1,
    //       showDatas: {
    //         avatar: 'https://img01.yzcdn.cn/edu/avatar-man@3x.png',
    //         courseName: '语文课第一节',
    //         consumeCount: 5,
    //         duration: '',
    //         checkinDays: 15,
    //         identityName: '翠花上酸菜',
    //       },
    //     },
    //   ],
    // };
  }

  /**
   *  更新证书的弹窗状态 0 未弹窗 1 已弹窗
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/393486
   *
   *  @param {number} kdtId -
   *  @param {Array} certificateIds -
   *  @param {number} popStatus -
   *  @return {Promise}
   */
  async batchUpdatePopStatus(kdtId, certificateIds, popStatus) {
    return this.invoke('batchUpdatePopStatus', [
      kdtId,
      certificateIds,
      popStatus,
    ]);
  }

  /**
   *  更新证书的查看状态
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/393487
   *
   *  @param {number} kdtId -
   *  @param {Array} id -
   *  @param {number} status -
   *  @return {Promise}
   */
  async batchUpdateStatus(kdtId, id, status) {
    return this.invoke('batchUpdateStatus', [
      kdtId,
      id,
      status,
    ]);
  }
}

module.exports = CertificateCustomFacade;
