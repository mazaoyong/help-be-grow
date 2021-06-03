const BaseService = require('@youzan/wsc-pc-base/app/services/base/PCBaseService');

/* com.youzan.cloud.appstore.api.service.search.SearchService -  */
/**
 * 有赞云相关接口
 */
class SearchService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.cloud.appstore.api.service.search.SearchService';
  }

  /**
             *  检索服务 查询
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/977751 
*
             *  @param {Object} request - 
             *  @param {boolean} request.containTrial - 搜索结果包含可试用
             *  @param {boolean} request.containCoupon - 搜索结果包含有优惠
             *  @param {number} request.pageNo - 第几页
 从 1 开始
 默认1
             *  @param {number} request.pageSize - 每页数量
 默认10
             *  @param {number} request.sortBy - 排序方式
 默认 10
 订购数量（销量） 20
 最新上架（新品） 30
             *  @param {Array.<Array>} request.tag[] - 标签数据
 tagValue
             *  @param {number} request.label - 行业ID
 仅模版市场使用，按行业筛选
 为null或0表示 无条件
             *  @param {string} request.keyword - 模糊搜索内容
 name、description
             *  @param {number} request.platform - 平台
 应用市场 0
 模板市场 2
             *  @param {number} request.categoryId - 应用分类
             *  @param {boolean} request.containSupportMina - 搜索结果包含支持小程序
             *  @return {Promise}
             */
  async query(request) {
    return this.invoke('query', [request]);
  }
}

module.exports = SearchService;
