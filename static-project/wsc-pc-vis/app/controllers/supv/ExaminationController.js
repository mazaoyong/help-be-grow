const BaseController = require('../base/BaseController');
const ExamStatisticsFacade = require('../../services/owl/pc/examination/ExamStatisticsFacade');
const ExamTemplateFacade = require('../../services/owl/pc/examination/ExamTemplateFacade');
const AnswerPaperFacade = require('../../services/owl/pc/examination/AnswerPaperFacade');
const ExamPluginFacade = require('../../services/owl/pc/examination/ExamPluginFacade');

class ExaminationController extends BaseController {
  async init() {
    super.init();
    if (!this.ctx.acceptJSON) {
      await this.ctx.getAbilitiesByKeys(this.ctx, {
        namespaceId: 'course',
        businessId: 'wsc-pc-vis',
      });
    }
  }

  async getIndexHtml(ctx) {
    await ctx.render('supv/examination.html');
  }

  async setPluginInfo(ctx) {
    let pluginInfo = {};
    try {
      pluginInfo = await new ExamPluginFacade(ctx).allowedForPc(ctx.kdtId);
    } catch (err) {
      pluginInfo = { isFirstUsed: false };
    }
    // 插件是否可用
    ctx.setGlobal('pluginEnabled', !pluginInfo.isFirstUsed);
    // 插件信息
    ctx.setGlobal('pluginInfo', pluginInfo);
  }

  async initExamPlugin(ctx) {
    const { kdtId } = ctx;
    const result = await new ExamPluginFacade(ctx).initExamPlugin(kdtId);
    ctx.json(0, 'ok', result);
  }

  // 根据id获取题目
  async findPaperQuestions(ctx) {
    const { questionIds } = ctx.request.body;
    let ids;
    if (typeof questionIds === 'string') {
      ids = questionIds.split(',');
    }
    const { kdtId } = ctx;
    const result = await new ExamTemplateFacade(ctx).findPaperQuestions(kdtId, ids || questionIds || []);
    ctx.json(0, 'ok', result);
  }

  // 创建考试模板
  async createExamTemplate(ctx) {
    const data = ctx.request.body;
    data.userId = this.operator.operatorId;
    const { kdtId } = ctx;
    const command = await ctx.visXss(data, 'detail');
    const result = await new ExamTemplateFacade(ctx).createExamTemplate(kdtId, command);
    ctx.json(0, 'ok', result);
  }

  // 更新考试模板
  async updateExamTemplate(ctx) {
    const data = ctx.request.body;
    data.userId = this.operator.operatorId;
    const { kdtId } = ctx;
    const command = await ctx.visXss(data, 'detail');
    const result = await new ExamTemplateFacade(ctx).updateExamTemplate(kdtId, command);
    ctx.json(0, 'ok', result);
  }

  // 考试试卷创建
  async createExamPaper(ctx) {
    const data = ctx.request.body;
    data.userId = this.operator.operatorId;
    const { kdtId } = ctx;
    const result = await new ExamTemplateFacade(ctx).createExamPaper(kdtId, data);
    ctx.json(0, 'ok', result);
  }

  // 获取考试详情
  async getExamTemplateDetail(ctx) {
    const { examTemplateId } = ctx.getQueryParse();
    const { kdtId } = ctx;
    const result = await new ExamTemplateFacade(ctx).getExamTemplateDetail(kdtId, +examTemplateId);
    ctx.json(0, 'ok', result);
  }

  // 获取考试最新试卷详情
  async getExamPaperDetail(ctx) {
    const { examTemplateId } = ctx.getQueryParse();
    const { kdtId } = ctx;
    const result = await new ExamTemplateFacade(ctx).getExamPaperDetail(kdtId, examTemplateId);
    ctx.json(0, 'ok', result);
  }

  // 分页查询考试列表
  async findPage(ctx) {
    const { query = {}, pageRequest = {} } = ctx.getQueryParse();
    const { kdtId } = ctx;

    if (query.startTime) {
      query.startTime = parseInt(query.startTime);
    }

    if (query.endTime) {
      query.endTime = parseInt(query.endTime);
    }

    pageRequest.sort = {
      orders: [
        {
          property: 'createdAt',
          direction: 'DESC',
        },
      ],
    };
    const result = await new ExamTemplateFacade(ctx).findPage(kdtId, pageRequest, query);
    ctx.json(0, 'ok', result);
  }

  // 更新考试状态
  async quickUpdate(ctx) {
    const data = ctx.request.body;
    data.userId = this.operator.operatorId;
    const { kdtId } = ctx;
    const result = await new ExamTemplateFacade(ctx).quickUpdate(kdtId, data);
    ctx.json(0, 'ok', result);
  }

  // 删除考试
  async deleteExam(ctx) {
    const data = ctx.request.body;
    data.userId = this.operator.operatorId;
    const { kdtId } = ctx;
    const result = await new ExamTemplateFacade(ctx).delete(kdtId, data);
    ctx.json(0, 'ok', result);
  }

  // 获取已参加考试的人数
  async countJoinUsers(ctx) {
    const { examTemplateId } = ctx.getQueryParse();
    const { kdtId } = ctx;
    const result = await new ExamTemplateFacade(ctx).countJoinUsers(kdtId, examTemplateId);
    ctx.json(0, 'ok', result);
  }

  // 获取批阅列表
  async findByReview(ctx) {
    const { kdtId } = ctx;
    const { reviewListQuery = {}, pageRequest } = ctx.getQueryParse();

    if (reviewListQuery.submitDateRange) {
      if (reviewListQuery.submitDateRange.startTime) {
        reviewListQuery.submitDateRange.startTime = Number(
          reviewListQuery.submitDateRange.startTime,
        );
      }

      if (reviewListQuery.submitDateRange.endTime) {
        reviewListQuery.submitDateRange.endTime = Number(reviewListQuery.submitDateRange.endTime);
      }
    }

    const res = await new AnswerPaperFacade(ctx).findByReview(kdtId, pageRequest, reviewListQuery);
    ctx.json(0, 'ok', res);
  }

  // 获取批阅详情
  async getReviewDetail(ctx) {
    const { kdtId } = ctx;
    const { answerPaperId } = ctx.getQueryParse();
    const res = await new AnswerPaperFacade(ctx).getReviewDetail(kdtId, {
      answerPaperId,
    });
    ctx.json(0, 'ok', res);
  }

  // 提交批阅
  async submitReview(ctx) {
    const { kdtId } = ctx;
    const { answerPaperId, reviews } = ctx.request.body;
    const { userId: reviewerId } = this.formatOperator;
    const res = await new AnswerPaperFacade(ctx).review(kdtId, {
      answerPaperId,
      reviewerId,
      reviews,
    });
    ctx.json(0, 'ok', res);
  }

  // 根据条件查询 id
  async getReviewIdByOption(ctx) {
    const { kdtId } = ctx;
    const { answerPaperId, option } = ctx.getQueryParse();
    const res = await new AnswerPaperFacade(ctx).getReviewIdByOption(kdtId, {
      answerPaperId,
      option,
    });
    ctx.json(0, 'ok', res);
  }

  // 根据考试模板id获取考试基本统计信息
  async getBaseStatById(ctx) {
    const kdtId = ctx.kdtId;
    const { examTemplateId } = ctx.getQueryParse();
    const res = await new ExamStatisticsFacade(ctx).getBaseStatById(kdtId, Number(examTemplateId));
    ctx.json(0, 'ok', res);
  }

  // 根据考试模板id获取考试分数段信息
  async findListStageStatById(ctx) {
    const kdtId = ctx.kdtId;
    const { examTemplateId } = ctx.getQueryParse();
    const res = await new ExamStatisticsFacade(ctx).findListStageStatById(kdtId, examTemplateId);
    ctx.json(0, 'ok', res);
  }

  // 根据考试模板id获取每道题的正确率
  async findPageQuestionStatById(ctx) {
    const kdtId = ctx.kdtId;
    const { examTemplateId, pageRequest = {} } = ctx.getQueryParse();
    const res = await new ExamStatisticsFacade(ctx).findPageQuestionStatById(kdtId, examTemplateId, pageRequest);
    ctx.json(0, 'ok', res);
  }

  // 根据考题获取选项或者每一个空的正确率
  async getOptionStatById(ctx) {
    const kdtId = ctx.kdtId;
    const { questionOptionQuery } = ctx.getQueryParse();
    const res = await new ExamStatisticsFacade(ctx).getOptionStatById(kdtId, questionOptionQuery);
    ctx.json(0, 'ok', res);
  }

  // 导出考试用户学员信息
  async exportUserStat(ctx) {
    const kdtId = ctx.kdtId;
    const examUserQuery = ctx.request.body;
    if (examUserQuery) {
      examUserQuery.operator = this.formatOperator;

      if (examUserQuery.startTime) {
        examUserQuery.startTime = parseInt(examUserQuery.startTime);
      }

      if (examUserQuery.endTime) {
        examUserQuery.endTime = parseInt(examUserQuery.endTime);
      }
    }
    const res = await new ExamStatisticsFacade(ctx).exportUserStat(kdtId, examUserQuery);
    ctx.json(0, 'ok', res);
  }

  // 查询考试用户学员信息
  async findPageUserStat(ctx) {
    const kdtId = ctx.kdtId;
    const { examUserQuery, pageRequest } = ctx.getQueryParse();
    if (examUserQuery) {
      examUserQuery.operator = this.formatOperator;

      if (examUserQuery.startTime) {
        examUserQuery.startTime = parseInt(examUserQuery.startTime);
      }

      if (examUserQuery.endTime) {
        examUserQuery.endTime = parseInt(examUserQuery.endTime);
      }
    }
    const res = await new ExamStatisticsFacade(ctx).findPageUserStat(kdtId, examUserQuery, pageRequest);
    ctx.json(0, 'ok', res);
  }

  // 用户信息采集查找
  async getExamUserCollectionInfo(ctx) {
    const kdtId = ctx.kdtId;
    const { userExamId } = ctx.getQueryParse();
    const res = await new ExamStatisticsFacade(ctx).getExamUserCollectionInfo(kdtId, userExamId);
    ctx.json(0, 'ok', res);
  }
}

module.exports = ExaminationController;
