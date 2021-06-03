const CourseService = require('../../services/edu/CourseService');
const ProductService = require('../../services/owl/ic/core/ProductService');
const ItemSkuService = require('../../services/item/detail/ItemSkuService');
const ItemEvaluationReadService = require('../../services/review/service/ItemEvaluationReadService');
const WeChatJoinGroupService = require('../../services/owl/client/edu/wechatgroupsetting/WeChatJoinGroupFacade');
const TradeFacade = require('../../services/owl/edu/course/TradeFacade');
const CourseFacade = require('../../services/owl/edu/course/CourseFacade');
const EduBaseController = require('./EduBaseController');
const ShopCourseSettingService = require('../../services/owl/pc/shop/ShopCourseSettingService');
const ClientEduProductFacade = require('../../services/owl/client/product/ClientEduProductFacade');

class CourseController extends EduBaseController {
  // 旧接口 拿线下课详情 TOCLEAR
  async getCourseDetailAndActivity(ctx) {
    const { alias } = ctx.query;
    const { kdtId } = ctx;
    const { youzan_user_id: userId } = ctx.getLocalSession();
    const dto = {
      alias,
      kdtId,
      userId,
    };

    const courseService = new CourseService(ctx);
    let result = {};

    await Promise.all([courseService.getCourseDetail(kdtId, dto), this.getActivityByUser(dto)]).then(res => {
      result = Object.assign({}, res[0], {
        activity: res[1],
      });
    });
    ctx.json(0, 'ok', result);
  }

  // new获取线下课详情统一接口
  async getCourseDetailV3AndActivity(ctx) {
    const { kdtId, query: { alias } } = ctx;
    const { youzan_user_id: userId } = ctx.getLocalSession();
    const dto = { alias, kdtId, userId };
    const clientEduProductFacade = new ClientEduProductFacade(ctx);

    const data = await Promise.all([clientEduProductFacade.getDetail(kdtId, dto), this.getActivityByUser(dto)]);
    const result = { ...data[0].course, activity: data[1] };
    ctx.success(result);
  }

  async getActivityByUser(dto) {
    const { ctx } = this;
    try {
      const res = await new CourseService(ctx).getActivityByUser(dto);
      return res;
    } catch (error) {
      return [];
    }
  }

  async getEvaluateData(ctx) {
    const { alias } = ctx.query;
    const { youzan_user_id: userId = 0 } = ctx.getLocalSession();
    const dto = {
      alias,
      userId,
    };

    const evaluationService = new ItemEvaluationReadService(ctx);
    let result = {};

    await Promise.all([evaluationService.getItemSummary(dto), evaluationService.getLeastItemEvaluation(dto)]).then(
      res => {
        result = Object.assign({}, res[0], res[1]);
      }
    );
    ctx.json(0, 'ok', result);
  }

  async getAddressList(ctx) {
    let { latitude, longitude, storeIds } = ctx.query;
    try {
      storeIds = JSON.parse(storeIds) || [];
    } catch (err) {
      storeIds = [];
    }
    const { kdtId } = ctx;
    const dto = {
      kdtId,
      storeIds,
    };
    // 有经纬度的时候才传
    if (latitude && longitude) {
      Object.assign(dto, {
        latitude,
        longitude,
      });
    }

    const list = await new CourseService(ctx).getAddressList(dto);
    ctx.json(0, 'ok', list);
  }

  async getPreOrderInfo(ctx) {
    const query = ctx.getQueryParse();
    let { bizTracePoint = '', callbackUrl = '', productDTO = '{}', purchaseUmpDTO = '{}', channelType = 0 } = query;
    // 反序列化productDTO, purchaseUmpDTO
    productDTO = JSON.parse(productDTO);
    purchaseUmpDTO = JSON.parse(purchaseUmpDTO);
    // 从ctx或session中获取信息
    const { kdtId, ip: clientIp = 0, platform, userAgent, isGuang } = ctx;
    const {
      youzan_user_id: userId = 0,
      fans_id: fansId = 0,
      fans_type: fansType = 0,
      fans_nickname: fansNickname = '',
      youzan_fans_id: youzanFansId = 0,
    } = ctx.getLocalSession();

    const fans = {
      fansId,
      fansNickname,
      youzanFansId,
    };

    const source = {
      kdtId,
      clientIp,
      platform,
      isReceiveMsg: '1',
      userAgent,
    };

    const dto = {
      bizTracePoint,
      callbackUrl,
      fans: JSON.stringify(fans),
      kdtId,
      channelType,
      orderMark: '',
      productDTO,
      purchaseUmpDTO,
      source: JSON.stringify(source),
      userWrapDTO: {
        buyerPhone: (ctx.buyer && ctx.buyer.phone) || '',
        fansId,
        fansNickname,
        fansType,
        userId,
        youzanFansId,
      },
    };

    if (isGuang) {
      source.orderMark = 'weapp_guang';
      dto.orderMark = 'weapp_guang';
    }

    const list = await new CourseService(ctx).getPreOrderInfo(dto);
    ctx.json(0, 'ok', list);
  }

  async postOrderConfirm(ctx) {
    let {
      bizTracePoint = '',
      callbackUrl = '',
      productDTO = '{}',
      purchaseUmpDTO = '{}',
      student = '{}',
      payAsset = '{}',
      channelType = 0,
      lessonAppointmentDTO = 'null',
    } = ctx.request.body;
    // 反序列化productDTO, purchaseUmpDTO
    productDTO = JSON.parse(productDTO);
    purchaseUmpDTO = JSON.parse(purchaseUmpDTO);
    student = JSON.parse(student);
    lessonAppointmentDTO = JSON.parse(lessonAppointmentDTO);
    payAsset = JSON.parse(payAsset);
    // 从ctx或session中获取信息
    const { ip: clientIp, platform, userAgent, kdtId, isGuang } = ctx;
    const {
      youzan_user_id: userId = 0,
      fans_id: fansId = 0,
      fans_type: fansType = 0,
      fans_nickname: fansNickname = '',
      youzan_fans_id: youzanFansId = 0,
    } = ctx.getLocalSession();

    const fans = {
      fansId,
      fansNickname,
      youzanFansId,
    };

    const source = {
      kdtId,
      clientIp,
      platform,
      isReceiveMsg: '1',
      userAgent,
    };

    const dto = {
      bizTracePoint,
      callbackUrl,
      fans: JSON.stringify(fans),
      kdtId,
      channelType,
      orderMark: '',
      productDTO,
      purchaseUmpDTO,
      student,
      lessonAppointmentDTO,
      payAsset,
      source: JSON.stringify(source),
      userWrapDTO: {
        buyerPhone: (ctx.buyer && ctx.buyer.phone) || '',
        fansId,
        fansNickname,
        fansType,
        userId,
        youzanFansId,
      },
    };

    if (isGuang) {
      source.orderMark = 'weapp_guang';
      dto.orderMark = 'weapp_guang';
    }

    const list = await new CourseService(ctx).postOrderConfirm(dto);
    ctx.json(0, 'ok', list);
  }

  /**
   * 获取课程商品列表，query中存放查询信息
   * 旧接口 TOCLEAR 这个调的是 listPageForWym 目前在小程序等地方里还有用
   *
   * @param {Object} ctx
   * @param {string[=asc]} ctx.query.courseType 排序顺序，默认是逆序排序
   * @param {string} ctx.query.courseField 排序字段
   * @returns
   * @memberof CourseProductFacadeController
   */
  async getAllCourseListJson(ctx) {
    const { kdtId = '', query } = ctx;
    // 数字类型的，或者是需要指定初始值的单独指出，其他放入stringConditions中
    const {
      pageNumber = 1,
      pageSize = 20,
      sortBy = 'created_time',
      sortType = 'desc',
      courseType = 2,
      soldStatus = 0,
      ...stringConditions
    } = query;
    const { aliases } = stringConditions;
    // 根据前端传过来的aliases改变pageSize
    let _pageSize = aliases ? aliases.split(',').length : pageSize;
    this.validator.isNumeric(String(_pageSize), '参数 pageSize 只能是数字');

    const courseListRequestDTO = {
      ...stringConditions,
      courseType: Number(courseType),
      soldStatus: Number(soldStatus),
      kdtId,
    };

    const data = await new CourseService(ctx).getAllCourseList([
      courseListRequestDTO,
      {
        pageNumber: Number(pageNumber),
        pageSize: _pageSize,
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
    ]);

    return ctx.json(0, 'ok', data);
  }

  // c端微页面查询课程商品列表
  // 新接口
  async findPageForWym(ctx) {
    const { kdtId, query, buyerId } = ctx;
    const {
      pageNumber = 1,
      pageSize = 20,
      sortBy = 'created_time',
      sortType = 'desc',
      courseType = 2,
      soldStatus = 0,
      ...stringConditions
    } = query;

    const { aliases } = stringConditions;

    let _pageSize = aliases ? aliases.split(',').length : pageSize;
    this.validator.isNumeric(String(_pageSize), '参数 pageSize 只能是数字');

    const clientCourseWymQuery = {
      ...stringConditions,
      courseType: +courseType,
      soldStatus: +soldStatus,
    };

    if (buyerId > 0) {
      clientCourseWymQuery.buyerId = buyerId;
    }

    const pageRequest = {
      pageNumber: +pageNumber,
      pageSize: _pageSize,
      sort: {
        orders: [
          {
            direction: sortType.toUpperCase(),
            property: sortBy,
            nullHandling: null,
          },
        ],
      },
    };

    const result = await new CourseService(ctx).findPageForWym(kdtId, clientCourseWymQuery, pageRequest);
    return ctx.json(0, 'ok', result);
  }

  /**
   * 获取推荐的课程商品列表
   * 旧接口 TOCLEAR 这里错用了B端的接口
   *
   * @param {Object} ctx
   * @param {string[=asc]} ctx.query.courseType 排序顺序，默认是逆序排序
   * @param {string} ctx.query.courseField 排序字段
   * @returns
   * @memberof CourseProductFacadeController
   */
  async getCourseListJson(ctx) {
    const { kdtId = '' } = ctx;
    const payload = [
      {
        courseType: 2,
        soldStatus: 0,
        kdtId,
      },
      {
        pageNumber: 1,
        pageSize: 4,
        sort: {
          orders: [
            {
              direction: 'DESC',
              property: 'sold_num', // 按照销量倒序
              nullHandling: null,
            },
          ],
        },
      },
    ];

    const data = await new CourseService(ctx).getCourseList(payload);

    return ctx.json(0, 'ok', data);
  }

  // 新接口
  async findPageByCondition(ctx) {
    const { kdtId } = ctx;
    const courseQuery = {
      courseType: 2,
      soldStatus: 0,
    };

    const pageRequest = {
      pageNumber: 1,
      pageSize: 4,
      sort: {
        orders: [
          {
            direction: 'DESC',
            property: 'sold_num', // 按照销量倒序
            nullHandling: null,
          },
        ],
      },
    };

    const result = await new CourseService(ctx).findPageByCondition(kdtId, courseQuery, pageRequest);
    return ctx.json(0, 'ok', result);
  }

  /**
   * 获取订单状态
   *
   * @param {Object} ctx
   * @param {string} ctx.query.orderNo 订单序号
   * @returns
   * @memberof CourseController
   */
  async getPayStatementJSON(ctx) {
    const { kdtId, query } = ctx;
    const { orderNo = '' } = query;
    const payload = { kdtId, orderNo };

    const data = await new CourseService(ctx).getPayStatement(payload);

    return ctx.json(0, 'ok', data);
  }

  /**
   * 从商品中心查询商品的库存信息
   * 先从ProductService服务中查询到商品id，再调用ItemSkuService服务查询商品库存等信息
   *
   * @param alias 商品别名
   */
  async getProductStockFromMallJson(ctx) {
    const alias = ctx.query.alias;
    const kdtId = ctx.kdtId;
    const productInfo = await new ProductService(ctx).getSimpleByAliases(kdtId, [alias]);
    const productId = productInfo[0].productId;
    const result = await new ItemSkuService(ctx).getItemSkuById({ kdtId, itemId: productId });
    ctx.json(0, 'ok', result);
  }

  /**
   * @description 获取支付成功的加粉二维码
   * @param {string} alias
   */
  async getWechatPromoteJson(ctx) {
    const kdtId = ctx.kdtId;
    const alias = ctx.query.alias;

    const result = await new WeChatJoinGroupService(ctx).get(kdtId, alias);
    ctx.json(0, 'ok', result);

    // ctx.json(0, 'ok', {
    //   guideCopy: 'cillum in',
    //   promotionSetting: 35628776,
    //   scene: 72458066,
    //   codeName: 'eu Lorem',
    //   codeId: -78047579,
    //   guideTitle: 'mollit',
    //   organizationName: 'veniam enim culpa officia',
    //   codeType: -24885096,
    //   kdtId: -14029918,
    //   scanGuideCopy: 'ut eu',
    //   codeStyle: 38567516,
    //   codePicture: 'https://b.yzcdn.cn/public_files/2018/11/19/bfc666f3eb05081b88d7353f43e18123.png',
    //   buttonCopy: 'sit consectetur ex sint sunt'
    // });
  }

  async hasTradeWithLessonAppointment(ctx) {
    const kdtId = ctx.kdtId;
    const { buyerId: userId } = this.buyer;

    const result = await new TradeFacade(ctx).hasTradeWithLessonAppointment(kdtId, {
      ...ctx.query,
      userId,
    });
    ctx.json(0, 'ok', result);
  }

  async getCourseTimeAddr(ctx) {
    const { fansId, buyerId: userId, fansType } = this.buyer;
    const { bizId, channel } = ctx.query;
    const res = await new CourseFacade(ctx).getCourseTimeAddr(ctx.kdtId, {
      bizId,
      channel,
      userWrapDTO: {
        userId,
        fansId,
        fansType,
      },
    });
    ctx.json(0, 'ok', res);
  }

  async getCourseTimeAddrByAlias(ctx) {
    const { alias } = ctx.query;
    const res = await new CourseFacade(ctx).getCourseTimeAddrByAlias(ctx.kdtId, alias);
    ctx.json(0, 'ok', res);
  }

  /**
   * 查询课程设置
   */
  async findCourseSettings(ctx) {
    const kdtId = ctx.kdtId;
    const res = await new ShopCourseSettingService(ctx).findCourseSettings(kdtId);
    ctx.json(0, 'ok', res);
  }
}

module.exports = CourseController;
