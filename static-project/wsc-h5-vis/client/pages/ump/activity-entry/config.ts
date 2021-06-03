import { isEduSingleStore, isEduChainStore } from '@youzan/utils-shop';
import { redirect } from '@/common/utils/custom-safe-link';
import { ActivityType, IActivityEntryConfig } from './types';
const kdtId = window._global.kdt_id; ;

export const ACTIVITIES_LIST: IActivityEntryConfig[] = [
  {
    icon: 'https://img01.yzcdn.cn/upload_files/2020/09/24/FrtMRlLYyKv9qonLeJWi1AyhNQtD.png',
    name: '邀请有礼',
    path: 'introduction',
    desc: '每邀请一位好友上课即可获得奖励',
    hidden: !isEduSingleStore && !isEduChainStore,
    type: ActivityType.INTRODUCTION,
    navigate() {
      redirect({
        url: `/wscvis/ump/introduction/old-student`,
        query: {
          kdt_id: kdtId,
          from: 'usercenter_fixed_entry',
        },
      });
    },
  },
  {
    icon: 'https://img01.yzcdn.cn/upload_files/2020/09/24/FulucQfbKbjQvcHUCfC4TZGntpcf.png',
    name: '下单有礼',
    desc: '好友下单你可获得现金奖励',
    path: 'referral',
    direct: true,
    navigate() {
      redirect({
        url: `/wscvis/ump/referral-invite`,
        query: {
          kdt_id: kdtId,
          fromPage: 'user-center',
        },
      });
    },
  },
  {
    icon: 'https://img01.yzcdn.cn/upload_files/2020/09/24/FuWyOHWCP2NfloE3QOw3zGkO6VRN.png',
    name: '攒学费',
    desc: '学费可兑换课程',
    path: 'tuition',
    hidden: !isEduSingleStore,
    type: ActivityType.TUITION,
    navigate(data) {
      if (!data) {
        return;
      }
      const { alias } = data;
      redirect({
        url: `/wscvis/ump/tuition/${alias}`,
        query: {
          kdt_id: kdtId,
        },
      });
    },
  },
];

export const ACTIVITIES_MAP = ACTIVITIES_LIST.reduce<Record<string, IActivityEntryConfig>>((result, cur) => {
  result[cur.path] = cur;
  return result;
}, {});
