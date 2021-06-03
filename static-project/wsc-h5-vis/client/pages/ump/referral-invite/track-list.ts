import { IConfig, Timings } from '@/common/directives/track';
import args from '@youzan/utils/url/args';
/**
 * 分析需求：
 *
 * 1、商详按钮点击
 * 2、商详分享弹层
 * 2.1、弹层具体按钮点击
 *
 *
 * 3、活动落地页
 * 3.1、不同入口进入（按钮、弹窗查看详情）
 * 3.2 商详=》活动落地页=》按钮
 * 3.2 个人中心=》活动落地页=》按钮
 *
 * todo:
 * 4.1 通过海报下单
 * 4.2 通过链接下单
*/

const routerName = args.get('fromPage');

const entryRecommendPage: IConfig = {
  name: 'entryRecommendPage',
  timing: Timings.EnterPage,
  eventId: 'enterpage',
  eventName: '进入推荐有奖单页',
  withOrigin: true,
  data: {
    routerName,
  },
};

/* 课程 活动落地页 按钮点击 */
const courseActivityPageClick: IConfig = {
  name: 'courseActivityPageClick',
  timing: Timings.Interaction,
  eventId: 'course_recommend_click',
  eventName: '课程活动落地页点击',
  data(store) {
    return {
      clickName: store['course_recommend_click:clickName'],
    };
  },
};

/* 个人中心 活动落地页 按钮点击 */
const userActivityPageClick: IConfig = {
  name: 'userActivityPageClick',
  timing: Timings.Interaction,
  eventId: 'uc_recommend_click',
  eventName: '个人中心活动落地页点击',
  data(store) {
    return {
      clickName: store['uc_recommend_click:clickName'],
    };
  },
};

export default [
  entryRecommendPage,
  courseActivityPageClick,
  userActivityPageClick,
];
