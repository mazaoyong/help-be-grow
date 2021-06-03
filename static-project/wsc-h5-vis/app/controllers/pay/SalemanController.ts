import { Context } from 'astroboy';
import BaseController from '../base/BaseNewController';
import SalemanService from '../../services/pay/user/SalemanService';

class SalemanController extends BaseController {
  // 查询分销员零钱是否升级
  async queryUpgradeResult(ctx: Context) {
    const bizContent = {
      userId: '' + ctx.userId,
    };
    const result = await new SalemanService(ctx).queryUpgradeResult(bizContent);
    ctx.json(0, 'ok', result);
  }
}

module.exports = SalemanController;
