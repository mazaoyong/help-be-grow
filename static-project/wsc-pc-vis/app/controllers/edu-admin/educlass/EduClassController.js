const BaseController = require('../../base/BaseController');
const EduClassService = require('../../../services/owl/pc/educlass/EduClassService');

class EduClassController extends BaseController {
  async getClassesJson(ctx) {
    const { kdtId = '' } = ctx;
    const { filter = {}, pageRequest = {} } = ctx.getQueryParse();

    const result = await new EduClassService(ctx).findEduClassByCondition(
      kdtId,
      pageRequest,
      filter,
    );
    return ctx.json(0, 'ok', result);
  }

  async postClassJson(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.request.body || {};

    query.operator = this.formatOperator;

    const result = await new EduClassService(ctx).createEduClass(kdtId, query);
    return ctx.json(0, 'ok', result);
  }

  async putClassJson(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.request.body || {};

    const result = await new EduClassService(ctx).updateEduClass(kdtId, query);
    return ctx.json(0, 'ok', result);
  }

  async deleteClassJson(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.request.body || {};

    const data = {
      eduClassId: query.id,
      kdtId: query.kdtId,
    };

    const result = await new EduClassService(ctx).deleteEduClassV2(kdtId, data);
    return ctx.json(0, 'ok', result);
  }

  async getClassJson(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.request.query;

    const result = await new EduClassService(ctx).getEduClassById(kdtId, query.id);
    return ctx.json(0, 'ok', result);
  }

  async getClassDetailJson(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.request.query;

    const queryDate = {
      eduClassId: query.id,
      kdtId: query.kdtId,
    };

    const result = await new EduClassService(ctx).getEduClassDetailByIdV2(kdtId, queryDate);
    return ctx.json(0, 'ok', result);
  }

  async getClassDetailJsonByNo(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.request.query;

    const queryDate = {
      classNo: query.classNo,
      kdtId: query.kdtId,
    };

    const result = await new EduClassService(ctx).getEduClassByNo(kdtId, queryDate);
    return ctx.json(0, 'ok', result);
  }

  async addStudentJson(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.request.body || {};

    query.operator = this.formatOperator;

    const result = await new EduClassService(ctx).addStuToEduClass(kdtId, query);
    return ctx.json(0, 'ok', result);
  }

  async changeStudentJson(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.request.body || {};

    query.operator = this.formatOperator;

    const result = await new EduClassService(ctx).changeStuEduClass(kdtId, query);
    return ctx.json(0, 'ok', result);
  }

  // 删除班级下学员
  async removeClassStu(ctx) {
    const kdtId = ctx.kdtId;
    const { classId, stuId, kdtId: targetKdtId } = ctx.request.body;

    const queryDate = {
      stuId,
      kdtId: targetKdtId,
      eduClassId: classId,
    };

    const res = await new EduClassService(ctx).removeClassStuV2(kdtId, queryDate);
    return ctx.json(0, 'ok', res);
  }

  // 获取班课信息
  async getEduClassBySkuIdAndGoodsId(ctx) {
    const kdtId = ctx.kdtId;
    const { goodsId, skuId } = ctx.getQueryParse();
    const res = await new EduClassService(ctx).getEduClassBySkuIdAndGoodsId(kdtId, goodsId, skuId);
    return ctx.json(0, 'ok', res);
  }

  // 根据班级名查找班级
  async findPageByName(ctx) {
    const { kdtId } = ctx;

    const { pageRequest, eduClassNameQuery } = ctx.getQueryParse();
    const data = await new EduClassService(ctx).findPageByName(kdtId, pageRequest, eduClassNameQuery);
    ctx.json(0, 'ok', data);
  }
}

module.exports = EduClassController;
