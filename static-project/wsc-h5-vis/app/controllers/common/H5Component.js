const { injectComponents } = require('@youzan/h5-cpns-injector-plugin/async-inject');
const BaseController = require('../../controllers/base/BaseNewController');

class H5Component extends BaseController {
  // 升级版本到0.1.7， 新增pureComponents参数，获取组件cdn接口返回格式变更为数组，支持一个接口返回两种模式组件
  async getComponentsJson(ctx) {
    const { components, pureComponents, extraData } = ctx.getQueryData();
    const result = await injectComponents(ctx, { components, pureComponents, extraData });

    ctx.json(0, 'ok', result);
  }
}

module.exports = H5Component;
