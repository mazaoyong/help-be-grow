const BaseController = require('../../base/BaseController');
const RegisService = require('../../../services/owl/edu/RegisService');

/**
 * 预约管理-报名记录
 */
class RecordController extends BaseController {
  async getIndexHtml(ctx) {
    await ctx.render('recruit/regis/record.html');
  }

  async getExportHtml(ctx) {
    await ctx.render('recruit/regis/edu-export.html');
  }

  /**
   * 查询学员资料项列表
   */
  async findDataItems(ctx) {
    const { kdtId } = ctx;
    const query = ctx.getQueryParse();
    const isHasQuery = Object.keys(query).length > 0;

    try {
      // 接口重载，如果是老接口，没有queryDTO
      if (isHasQuery) {
        const res = await new RegisService(ctx).findDataItems(kdtId, query);
        return ctx.json(0, 'ok', res);
      } else {
        const res = await new RegisService(ctx).findDataItemsOld(kdtId);
        return ctx.json(0, 'ok', res);
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * 分页查询报名记录列表
   */
  async findPageRegistrationInfo(ctx) {
    const { kdtId, request } = ctx;
    const {
      featureId,
      stuName,
      stuTel,
      beginAt,
      endAt,
      apptStatus,
      pageNumber,
      pageSize,
      direction = 'DESC',
    } = request.query || {};

    beginAt && this.validator.isNumeric(beginAt);
    endAt && this.validator.isNumeric(endAt);
    this.validator.isNumeric(pageNumber);
    this.validator.isNumeric(pageSize);

    const formRegInfoQuery = {
      featureId: featureId ? Number(featureId) : undefined,
      stuName,
      stuTel,
      apptStatus: Number(apptStatus),
      beginAt: beginAt ? Number(beginAt) : undefined,
      endAt: endAt ? Number(endAt) : undefined,
    };
    const pageRequest = {
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
      sort: {
        orders: [
          {
            direction: direction === 'ASC' ? 'ASC' : 'DESC',
            property: 'created_at',
          },
        ],
      },
    };

    try {
      const res = await new RegisService(ctx).findPageRegistrationInfo(
        kdtId,
        formRegInfoQuery,
        pageRequest,
      );
      return ctx.json(0, 'ok', res);
    } catch (err) {
      throw err;
    }
  }

  /**
   * 分页查询来源微页面列表
   */
  async findPageRegFeature(ctx) {
    const { kdtId, request } = ctx;
    const { featureTitle } = request.query || {};
    const featureCommandQuery = { featureTitle };
    const pageRequest = {
      pageNumber: 1,
      pageSize: 100,
    };

    try {
      const res = await new RegisService(ctx).findPageRegFeature(
        kdtId,
        featureCommandQuery,
        pageRequest,
      );
      return ctx.json(0, 'ok', res);
    } catch (err) {
      throw err;
    }
  }

  /**
   * 报表批量导出
   */
  async createExportRecord(ctx) {
    const { kdtId, request } = ctx;
    const {
      apptStatus,
      beginAt,
      endAt,
      featureId, // 微页面id
      featureTitle,
      operatorMobile, // 操作人手机号
      operatorName, // 操作人姓名
      stuTel,
      stuName,
    } = request.query || {};

    beginAt && this.validator.isNumeric(beginAt);
    endAt && this.validator.isNumeric(endAt);

    const exptCommand = {
      apptStatus: Number(apptStatus),
      beginAt: beginAt ? Number(beginAt) : undefined,
      endAt: endAt ? Number(endAt) : undefined,
      featureId,
      featureTitle,
      operatorMobile,
      operatorName,
      stuTel,
      stuName,
    };

    try {
      const res = await new RegisService(ctx).createExportRecord(kdtId, exptCommand);
      return ctx.json(0, 'ok', res);
    } catch (err) {
      throw err;
    }
  }

  /**
   * 创建预约
   */
  async createPreAppointment(ctx) {
    const { kdtId, request } = ctx;
    const {
      dataItemInfo,
      name,
      telephone,
      userId,
    } = request.body || {};

    const apptCommand = {
      dataItemInfo,
      name,
      telephone,
      userId,
    };

    try {
      const res = await new RegisService(ctx).createPreAppointment(kdtId, apptCommand);
      return ctx.json(0, 'ok', res);
    } catch (err) {
      throw err;
    }
  }

  /**
   * 创建线索预约
   */
  async createPreAppointmentForClue(ctx) {
    const { kdtId, request } = ctx;
    const {
      dataItemInfo,
      name,
      telephone,
      userId,
      clueId,
    } = request.body || {};

    const apptCommand = {
      dataItemInfo,
      name,
      telephone,
      userId,
      clueId,
    };

    try {
      const res = await new RegisService(ctx).createPreAppointmentForClue(kdtId, apptCommand);
      return ctx.json(0, 'ok', res);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = RecordController;
