/**
 * 有赞教育店铺创建相关
 */
const BaseController = require('../base/BaseController');
const CountryCodeService = require('../../../services/uic/countryCode/CountryCodeService');

class IndexController extends BaseController {
  /**
   * 获取所有国家码
   */
  async GetCountryCodeList(ctx) {
    const { appName = 'weapp-edu', businessType = 1 } = ctx.query;
    const dto = { appName, businessType };
    const res = await new CountryCodeService(ctx).get(dto);
    return ctx.json(0, 'ok', res);
  }
}

module.exports = IndexController;
