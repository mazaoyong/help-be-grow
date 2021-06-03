const EduBaseController = require('./EduBaseController');
const OwlProductAggregateService = require('../../services/edu/OwlProductAggregateService');

class OwlProductAggregateController extends EduBaseController {
  /**
   * 获取教育商品列表
   *
   * @param {Object} ctx
   */
  async fetchGoodsList(ctx) {
    const { kdtId, query } = ctx;
    const { pageNumber, pageSize, direction, property, types, subType = 0 } = query;

    this.validator.required(pageNumber, '缺少必要参数pageNumber');
    this.validator.required(pageSize, '缺少必要参数pageSize');
    this.validator.required(direction, '缺少必要参数direction');
    this.validator.required(property, '缺少必要参数property');
    this.validator.isNumeric(pageNumber, '参数pageNumber只能是数字');
    this.validator.isNumeric(pageSize, '参数pageSize只能是数字');

    const pageRequest = {
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
      sort: {
        orders: [
          {
            direction,
            property,
            nullHandling: null,
          },
        ],
      },
    };
    const queryPayload = {
      // 对应后端知识商品类型枚举：课程10、专栏1、内容2、直播4
      types: types.split(','),
      subType,
    };

    const res = await new OwlProductAggregateService(ctx).findPage(kdtId, pageRequest, queryPayload);
    ctx.json(0, 'ok', res);
  }
}

module.exports = OwlProductAggregateController;
