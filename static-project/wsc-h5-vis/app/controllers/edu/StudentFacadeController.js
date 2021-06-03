const EduBaseController = require('./EduBaseController');
const StudentFacadeService = require('../../services/edu/StudentFacadeService');
const StudentFacadeServiceV2 = require('../../services/api/owl/api/StudentFacade');

class StudentFacadeController extends EduBaseController {
  /**
   * 获取学员列表信息
   * @param {object} ctx
   * @memberof StudentFacadeController
   */
  async getStudentListJson(ctx) {
    const { kdtId } = ctx;
    const {
      buyer = {}, youzan_user_id // eslint-disable-line
    } = ctx.getLocalSession();
    const customerUserId = buyer.id || youzan_user_id || 0; // eslint-disable-line
    const payload = {
      kdtId,
      userId: customerUserId,
    };

    console.log('payload: ', payload);

    const res = await new StudentFacadeService(ctx).getStudentList(payload);
    ctx.json(0, 'ok', res);
  }

  /**
   * 查询客户在店铺最近一次下单选择的学员
   * @param {*} ctx
   * @memberof StudentFacadeController
   */
  async getRecentStudentJson(ctx) {
    const { kdtId } = ctx;
    const {
      buyer = {}, youzan_user_id // eslint-disable-line
    } = ctx.getLocalSession();
    const customerId = buyer.id || youzan_user_id || 0; // eslint-disable-line

    const res = await new StudentFacadeService(ctx).getRecentOrderStudentByCustomer(kdtId, customerId);
    ctx.json(0, 'ok', res);
  }

  // 获取带有班课关系校验的学员列表
  async getFindByTradeStudentQueryJson(ctx) {
    const { kdtId, userId } = ctx;
    let { classIdList } = ctx.getQueryData();
    try {
      classIdList = JSON.parse(classIdList);
    } catch (error) {
      classIdList = [];
    }

    const result = await new StudentFacadeServiceV2(ctx).findByTradeStudentQuery(kdtId, {
      classIdList,
      userId,
    });

    ctx.json(0, 'ok', result);
  }
}

module.exports = StudentFacadeController;
