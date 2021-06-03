import { get, each, findIndex } from 'lodash';
import formatDate from '@youzan/utils/date/formatDate';
import { GOODS_STATUS } from '@/constants/course/goods-status';
import { COURSE_SELL_TYPE } from '@/constants/course/course-sell-type';
import { COURSE_TYPE } from '@/constants/course/course-type';
import { VALID_PERIOD_TYPE, VALID_PERIOD_UNIT } from '@/constants/course/validity-period';
import { COURSE_EFFECTIVE_TYPE } from '@/constants/course/course-effective-type';
import { SERVICE_PLEDGE } from '@/constants/course/service-pledge';
import { CERT_TYPE } from '@/constants/course/cert-type';

export default function course(data) {
  const product = get(data, 'product', {});
  const course = get(data, 'course', {});
  const { formalCourse = {}, trialCourse = {} } = course;
  const { classHourCourse, dateRangeCourse, periodCourse, customCourse } = formalCourse;
  Object.assign(course, formalCourse);
  Object.assign(course, trialCourse);
  Object.assign(course, classHourCourse);
  Object.assign(course, dateRangeCourse);
  Object.assign(course, periodCourse);
  Object.assign(course, customCourse);

  const courseType = +get(course, 'courseType', COURSE_TYPE.CASUAL);
  const courseSellType = +get(course, 'courseSellType', COURSE_SELL_TYPE.COUNT);

  let publishAt = get(course, 'timingPublishAt', '');
  if (publishAt) {
    publishAt = new Date(publishAt.replace(/-/ig, '/')).getTime();
  }

  const sku = get(product, 'skuFormatModel', {});
  if (courseType === COURSE_TYPE.FORMAL) {
    // 按课时、按时段课程，将 sku 中设置的「展示给买家描述」字段替换掉 sku 中的数据
    if (courseSellType === COURSE_SELL_TYPE.COUNT || courseSellType === COURSE_SELL_TYPE.DURATION) {
      each(sku.list, item => {
        try {
          const skuValue = JSON.parse(item.sku);
          if (skuValue.courseSkuDesc) {
            skuValue[0].v = skuValue.courseSkuDesc;
            item.sku = JSON.stringify(skuValue);

            // 按课时、按时段课程都只有一级sku，所以这里直接取 tree[0] 的value
            const skuTree = sku.tree[0].v;
            const kS = sku.tree[0].k_s;
            const treeValueIndex = findIndex(skuTree, function(o) { return item[kS] === o.id; });
            treeValueIndex > -1 && (skuTree[treeValueIndex].name = skuValue.courseSkuDesc);
          }
        } catch (e) {}
      });
    }
    // 按期课程，将 sku 中设置的「展示给买家描述」字段替换掉 sku 中的数据，同时拼接上课时间
    if (courseSellType === COURSE_SELL_TYPE.SESSION) {
      each(sku.list, item => {
        try {
          const skuValue = JSON.parse(item.sku);
          const eduCourse = item.eduClassDTO || {};
          const { startTime, endTime } = eduCourse;
          const timeRangeStr = `${formatDate(new Date(startTime), 'YYYY-MM-DD')} 至 ${formatDate(new Date(endTime), 'YYYY-MM-DD')}`;
          const desc = item.courseSkuDesc ? `${item.courseSkuDesc} ${timeRangeStr}` : `${skuValue[0].v} ${timeRangeStr}`;
          skuValue[0].v = desc;
          item.sku = JSON.stringify(skuValue);

          // 按期课程只有一级sku，所以这里直接取 tree[0] 的value
          const skuTree = sku.tree[0].v;
          const kS = sku.tree[0].k_s;
          const treeValueIndex = findIndex(skuTree, function(o) { return item[kS] === o.id; });
          treeValueIndex > -1 && (skuTree[treeValueIndex].name = desc);
        } catch (e) {}
      });
    }
  }

  return {
    /* 商品属性 */
    // 商品alias
    alias: get(product, 'alias', ''),

    // 商品id
    goodsId: get(course, 'productId', 0),

    // 商品名称
    title: get(product, 'title', ''),

    // 分享简介
    summary: get(product, 'subTitle', ''),

    // 商品图片
    pictures: get(product, 'pictures', [{
      id: 0,
      url: '',
      width: 0,
      height: 0,
    }]),

    // 商品视频
    video: get(product, 'videoModel', {}),

    // 商家设置划线价
    origin: get(product, 'origin', ''),

    // 销量
    soldNum: get(product, 'totalSoldNum', 0),

    // 规格
    sku,

    // 卖点
    subTitle: get(product, 'sellPoint', ''),

    // 商品状态
    status: get(product, 'status', GOODS_STATUS.DELETE),

    // 预售时间
    publishAt,

    // 达到限购
    purchaseLimit: get(product, 'purchaseLimit', false),
    // 限购数量
    quota: +get(product, 'quota', 0),
    // 已购数量
    quotaUsed: +get(product, 'quotaUsed', 0),

    // 购买按钮配置
    buyButton: get(product, 'courseBuyButton', {}),

    // 隐藏名额展示，0：不隐藏；1：隐藏
    hideStock: get(product, 'hideStock', 0),

    /* 线下课属性 */
    // 线下课类型
    courseType,

    // 线下课类型名称，用于标题 tag 展示，后端做了开关逻辑
    courseTypeName: get(course, 'courseTypeName', ''),

    // 收费方式
    courseSellType,

    // 线下课标签
    courseTag: get(course, 'tagList', []),

    // 是否展示购买记录滚动信息
    courseBoughtDisplay: get(product, 'courseBoughtDisplay', 0),

    // 线下课有效时间：有效类型
    validityPeriodType: get(course, 'validityPeriodType', VALID_PERIOD_TYPE.FOREVER),
    // 线下课有效时间：有效期长度
    validityPeriodRange: get(course, 'validityPeriodRange', 0),
    // 线下课有效时间：有效期单位
    validityPeriodUnit: get(course, 'validityPeriodUnit', VALID_PERIOD_UNIT.D),

    // 线下课生效时间：生效类型
    courseEffectiveType: get(course, 'courseEffectiveType', COURSE_EFFECTIVE_TYPE.AFTER_SIGN),
    // 线下课生效时间：付款完成N天后生效
    courseEffectiveDelayDays: get(course, 'courseEffectiveDelayDays', 0),

    // 开课时间（体验课和自定义收费方式的正式课会有）
    courseStartAt: course.courseStartAt && new Date(course.courseStartAt.replace(/-/ig, '/')),
    courseEndAt: course.courseEndAt && new Date(course.courseEndAt.replace(/-/ig, '/')),

    // 服务承诺
    servicePledge: get(course, 'servicePledge', SERVICE_PLEDGE.UNSEEN),

    // 上课地点
    addressList: get(course, 'addressList', []),

    // 校区信息
    shopDetailInfo: get(course, 'shopDetailInfo', {}),

    // 适用对象
    applyUser: get(course, 'applyUser', ''),

    // 主讲老师
    teacherList: get(course, 'teacherList', []),

    // 课程目录
    directoryList: get(course, 'directory.directoryList', []),

    // 课程详情
    intro: get(course, 'intro', ''),

    // 购买须知
    buyNotice: get(course, 'buyNotice', ''),

    // 证书类型
    certType: get(course, 'hasCert', CERT_TYPE.NONE),

    // 奖励
    rewards: get(course, 'rewards', []),
  };
}
