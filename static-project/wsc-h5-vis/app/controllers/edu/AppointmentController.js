const EduBaseController = require('./EduBaseController');
const ConsumerAppointmentService = require('../../services/owl/client/edu/appointment/ConsumerAppointmentFacade');
const StudentFacase = require('../../services/owl/client/edu/student/StudentFacade');
const TradeFacade = require('../../services/owl/edu/course/TradeFacade');
const EduCourseFacade = require('../../services/owl/client/edu/educourse/EduCourseFacade');
const OwlStudentLessonDetectFacade = require('../../services/owl/client/edu/student/OwlStudentLessonDetectFacade');
const AddressService = require('../../services/owl/client/edu/address/AddressService');
const TeacherService = require('../../services/owl/client/edu/teacher/TeacherService');

class AppointmentController extends EduBaseController {
  async getList(ctx) {
    const { kdtId } = ctx;
    const { buyerId } = this.buyer;
    // mock 51055158 690414618
    const result = await new ConsumerAppointmentService(ctx).findAppointmentLessons(kdtId, buyerId);
    ctx.json(0, 'ok', result);
  }

  async getStudentInfo(ctx) {
    const { kdtId, userId } = ctx;
    const { studentId } = ctx.query;
    const result = await new StudentFacase(ctx).getSimpleById(kdtId, studentId, userId);
    ctx.json(0, 'ok', result);
  }

  async getCalendar(ctx) {
    const { kdtId } = ctx;
    const {
      eduCourseIds = '',
      studentId,
      startTime,
      endTime,
      assetNo,
      addressId,
      teacherNo,
    } = ctx.query;
    const result = await new ConsumerAppointmentService(ctx).findLessonDate(kdtId, {
      eduCourseIds: eduCourseIds.split(','),
      studentId,
      startTime,
      endTime,
      assetNo,
      addressId: addressId || null,
      teacherNo: teacherNo || null,
    });
    ctx.json(0, 'ok', result);
  }

  async getListByDate(ctx) {
    const { kdtId } = ctx;
    const {
      pageNumber,
      pageSize,
      eduCourseIds = '',
      studentId,
      startTime,
      endTime,
      assetNo,
      addressId,
      teacherNo,
    } = ctx.query;

    const result = await new ConsumerAppointmentService(ctx).findDailyLessons(
      kdtId,
      {
        pageNumber,
        pageSize,
      },
      {
        eduCourseIds: eduCourseIds ? eduCourseIds.split(',') : [],
        studentId,
        startTime,
        endTime,
        assetNo,
        addressId: addressId || null,
        teacherNo: teacherNo || null,
      }
    );
    ctx.json(0, 'ok', result);
  }

  async getCalendarForOrderPage(ctx) {
    const { kdtId } = ctx;
    const { queryEduCourseIds = '', addressId, teacherNo } = ctx.query;
    const query = {
      ...ctx.query,
      addressId: addressId || null,
      teacherNo: teacherNo || null,
      queryEduCourseIds: queryEduCourseIds.split(',').filter(o => !!o),
      kdtId: ctx.kdtId,
    };

    const result = await new ConsumerAppointmentService(ctx).findLessonDateForOrderPage(kdtId, query);
    ctx.json(0, 'ok', result);
  }

  async getListByDateForOrderPage(ctx) {
    const { kdtId } = ctx;
    const {
      pageNumber,
      pageSize,
      studentId,
      addressId,
      teacherNo,
      startTime,
      endTime,
      skuId,
      productAlias,
      queryEduCourseIds = '',
    } = ctx.query;

    const result = await new ConsumerAppointmentService(ctx).findLessonForOrderPage(
      kdtId,
      {
        pageNumber,
        pageSize,
      },
      {
        studentId,
        kdtId: ctx.kdtId,
        startTime,
        endTime,
        skuId,
        addressId: addressId || null,
        teacherNo: teacherNo || null,
        productAlias,
        queryEduCourseIds: queryEduCourseIds.split(',').filter(o => !!o),
      }
    );
    ctx.json(0, 'ok', result);
  }

  async getMakeAppointment(ctx) {
    const { kdtId } = ctx;
    const { buyerId: operatorId } = this.buyer;
    const {
      assetNo,
      studentId,
      lessonNo,
    } = ctx.query;

    const result = await new ConsumerAppointmentService(ctx).createStudentLesson(kdtId, {
      courseType: 1,
      assetNo,
      studentId,
      operatorId,
      lessonNo,
    });
    ctx.json(0, 'ok', result);
  }

  async getCancelAppointment(ctx) {
    const { kdtId } = ctx;
    const { buyerId: operatorId } = this.buyer;
    const { studentLessonNo } = ctx.query;

    const result = await new ConsumerAppointmentService(ctx).cancelStudentLesson(kdtId, studentLessonNo, operatorId);
    ctx.json(0, 'ok', result);
  }

  async getInfo(ctx) {
    const { kdtId } = ctx;
    const { studentLessonNo } = ctx.query;

    const query = {
      studentLessonNo,
      kdtId,
    };

    const result = await new ConsumerAppointmentService(ctx).getAppointmentResultV2(kdtId, query);
    ctx.json(0, 'ok', result);
  }

  async getDetail(ctx) {
    const { kdtId } = ctx;
    // const { studentLessonNo } = ctx.query;
    const studentLessonNo = {
      studentLessonNo: ctx.query.studentLessonNo,
      kdtId: ctx.query.kdtId,
    };
    const result = await new ConsumerAppointmentService(ctx).getStudentLessonDetail(kdtId, studentLessonNo);
    ctx.json(0, 'ok', result);
  }

  async getRecordList(ctx) {
    const { kdtId } = ctx;
    const { buyerId: userId } = this.buyer;
    const {
      pageNumber,
      pageSize,
      sortBy = 'created_at',
      sortType = 'desc',
      startTime,
      endTime,
    } = ctx.query;

    const query = {
      userId,
    };
    if (startTime) query.startTime = startTime;
    if (endTime) query.endTime = endTime;

    const result = await new ConsumerAppointmentService(ctx).findStudentLessons(
      kdtId,
      {
        pageNumber,
        pageSize,
        sort: {
          orders: [
            {
              direction: sortType.toUpperCase(),
              property: sortBy,
              nullHandling: null,
            },
          ],
        },
      },
      query
    );
    ctx.json(0, 'ok', result);
  }

  async canTradeWithLessonAppointmentInfo(ctx) {
    const { kdtId } = ctx;
    const {
      lessonNo,
      skuId = '',
      alias,
      studentId,
    } = ctx.query;

    const result = await new TradeFacade(ctx).canTradeWithLessonAppointmentInfo(
      kdtId,
      {
        lessonAppointmentDTO: {
          lessonNo,
          studentId,
        },
        productDTO: {
          alias,
          num: 1,
          skuId: skuId.split(','),
        },
      },
    );
    ctx.json(0, 'ok', result);
  }

  async findPageByCondition(ctx) {
    const { kdtId } = ctx;
    const {
      name,
      pageNumber,
      pageSize,
    } = ctx.query;

    const result = await new EduCourseFacade(ctx).findPageByCondition(
      kdtId,
      {
        pageNumber,
        pageSize,
      },
      {
        name,
        kdtId,
      }
    );
    ctx.json(0, 'ok', result);
  }

  async detectDateRange(ctx) {
    const { kdtId } = ctx;
    const query = ctx.getQueryParse();

    const result = await new OwlStudentLessonDetectFacade(ctx).detectDateRange(kdtId, query);
    ctx.json(0, 'ok', result);
  }

  async getAddressList(ctx) {
    const { kdtId } = ctx;
    const result = await new AddressService(ctx).findAddressList(kdtId, { kdtId });
    ctx.json(0, 'ok', result);
  }

  async getTeacherList(ctx) {
    const { kdtId } = ctx;
    const result = await new TeacherService(ctx).findPage(Number(kdtId), {
      pageSize: 200,
      pageNumber: 1,
    }, {
      kdtId: Number(kdtId),
      source: 0,
    });
    ctx.json(0, 'ok', result);
  }
}

module.exports = AppointmentController;
