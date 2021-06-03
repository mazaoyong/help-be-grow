const OrderBaseController = require('./OrderBaseController');
const CustomizeService = require('../../services/scrm/customer/customize/CustomizeService');

class UserController extends OrderBaseController {
  /** 获取用户敏感信息明文 */
  async getPrivateInfoJson(ctx) {
    const { kdtId, query } = ctx;
    const { version, customizeUid, yzUid } = query;
    const userIdentifyDTO = {
      kdtId,
      version,
      yzUid,
      customizeUid,
    };

    const data = await new CustomizeService(ctx).queryPrivateAttrInfo(userIdentifyDTO);

    ctx.json(0, 'ok', data);
  }
}

module.exports = UserController;
