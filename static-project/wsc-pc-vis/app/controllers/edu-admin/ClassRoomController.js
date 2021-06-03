const BaseController = require('../base/BaseController');
const ClassRoomService = require('../../services/owl/pc/classroom/ClassroomService');

class ClassRoomController extends BaseController {
  async getIndexHtml(ctx) {
    const kdtId = ctx.kdtId;

    // 店铺生命周期
    const lifecycle = await this.callService(
      'wsc-pc-base/shop.ProdReadService',
      'queryShopProds',
      kdtId,
    );

    ctx.setGlobal('lifecycle', lifecycle); // 店铺生命周期

    await ctx.render('edu-admin/classroom/index.html');
  }

  async createClassroom(ctx) {
    const { kdtId, request } = ctx;
    const { body = {} } = request;

    body.operator = this.formatOperator;

    const data = await new ClassRoomService(ctx).createClassroom(kdtId, body);
    return ctx.json(0, 'ok', data);
  }

  async updateClassroom(ctx) {
    const { kdtId, request } = ctx;
    const { body = {} } = request;
    const data = await new ClassRoomService(ctx).updateClassroom(kdtId, body);
    return ctx.json(0, 'ok', data);
  }

  async deleteClassroom(ctx) {
    const { kdtId, request } = ctx;
    const { body = {} } = request;

    const queryDate = {
      id: body.id,
      kdtId: body.kdtId,
    };

    const data = await new ClassRoomService(ctx).deleteClassroomV2(kdtId, queryDate);
    return ctx.json(0, 'ok', data);
  }

  async getClassroomById(ctx) {
    const { kdtId } = ctx;
    const { id = 0, kdtId: targetKdtId } = ctx.getQueryParse() || {};

    const queryDate = {
      id: id,
      kdtId: targetKdtId,
    };

    const data = await new ClassRoomService(ctx).getClassroomByIdV2(kdtId, queryDate);
    return ctx.json(0, 'ok', data);
  }

  async getClassroomByNo(ctx) {
    const { kdtId } = ctx;
    const { classroomNo, kdtId: targetKdtId } = ctx.getQueryParse() || {};

    const query = {
      classroomNo,
      kdtId: targetKdtId,
    };

    const data = await new ClassRoomService(ctx).getClassroomByNo(kdtId, query);
    return ctx.json(0, 'ok', data);
  }

  async findPageByCondition(ctx) {
    const { kdtId } = ctx;
    const { pageRequest = {}, query = {} } = ctx.getQueryParse() || {};
    const data = await new ClassRoomService(ctx).findPageByCondition(kdtId, pageRequest, query);
    return ctx.json(0, 'ok', data);
  }
}

module.exports = ClassRoomController;
