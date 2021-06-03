import { toGetCourse, toCourse } from '../navigation';
import { isCourseReward, isCouponReward } from './detail';
import { IZanDetail } from 'definitions/api/owl/ump/CollectZanFacade/getZanSetDetail';

export function receiveReward(alias: string, zanDetail: IZanDetail) {
  if (isCourseReward(zanDetail)) {
    // 导航至课程页
    toGetCourse(
      zanDetail.zanSet.id || 0,
      alias,
      zanDetail.zanSet.owlType || 10,
    );
  } else if (isCouponReward(zanDetail)) {
    // 导航至优惠券页面
    toCourse(alias);
  }
}
