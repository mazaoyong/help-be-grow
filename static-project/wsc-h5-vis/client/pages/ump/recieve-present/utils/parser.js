import args from '@youzan/utils/url/args';
import { PRESENT_TYPE } from '../constants';

const presentSource = args.get('presentSource') || '16'; // 默认来源为买赠，否则presentSource肯定为某个活动值

export function parseList(list) {
  const listInfo = {
    course: [], // 线下课列表
    knowledge: [], // 知识付费列表
    goods: [], // 实物商品列表
  };
  list.forEach(item => {
    switch (item.presentType) {
      case PRESENT_TYPE.COURSE:
        if (Number(presentSource) === 16) {
          if (item.owlType === 10) {
            listInfo.course.push(item);
          }
        } else {
          item.owlType === 10 ? listInfo.course.push(item) : listInfo.knowledge.push(item);
        }
        break;
      case PRESENT_TYPE.GOODS:
        listInfo.goods.push(item);
        break;
    }
  });
  return listInfo;
}
