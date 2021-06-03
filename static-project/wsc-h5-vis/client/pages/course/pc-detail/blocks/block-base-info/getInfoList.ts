import formatDate from '@youzan/utils/date/formatDate';
import { getLiveStatusDesc } from '@/common/utils/live-status';
import { GOODS_TYPE } from '@/constants/course/goodsType';
import { LIVE_STATUS } from '@/constants/course/live-status';
import formatSalesNum from '@/pages/course/detail/utils/format-sales-num';
import { isContent } from '../../modules/goods';
import { fns } from '@youzan/vue-theme-plugin';

interface InfoItem {
  label?: string;
  value?: any;
  tag?: any;
  color?: string;
}
export default function getInfoList(
  goodsType: GOODS_TYPE,
  goodsData: any,
  $theme: any,
): InfoItem[] {
  const list = [];
  // if (goodsData.subscriptionsCount) {
  //   list.push({
  //     label: '已学',
  //     value: `${formatSalesNum(goodsData.subscriptionsCount)}人`,
  //   });
  // }
  if (goodsData.author) {
    list.push({
      label: isContent(goodsType) ? '作者' : '讲师',
      value: goodsData.author,
    });
  }
  // if (goodsData.publishAt && !this.isLive) {
  //   const item = {
  //     label: '时间',
  //     value: formatDate(goodsData.publishAt, 'YYYY-MM-DD'),
  //   };
  //   if (this.isColumn && goodsData.isUpdate && goodsData.contentsCount) {
  //     item.subContent = `已更新${goodsData.contentsCount}期`;
  //   }
  //   list.push(item);
  // }
  if (goodsData.liveStartAt) {
    const item: InfoItem = {
      label: '直播时间',
      value: formatDate(goodsData.liveStartAt, 'YYYY-MM-DD HH:mm'),
    };
    const text = getLiveStatusDesc(goodsData.liveStatus, goodsData.liveType);
    if (text) {
      const colorMap = {
        [LIVE_STATUS.UNSTART]: '#00B389',
        [LIVE_STATUS.LIVING]: '#fff',
        [LIVE_STATUS.REWATCH]: '#646566',
        [LIVE_STATUS.PLAYBACK]: '#fff',
        [LIVE_STATUS.PRE_PLAYBACK]: '#00B389',
      };
      const backgroundColorMap = {
        [LIVE_STATUS.UNSTART]: fns.hexToRgba('#54D4B6', 0.1),
        [LIVE_STATUS.LIVING]: '#00B389',
        [LIVE_STATUS.REWATCH]: '#f2f3f5',
        [LIVE_STATUS.PLAYBACK]: '#00B389',
        [LIVE_STATUS.PRE_PLAYBACK]: fns.hexToRgba('#54D4B6', 0.1),
      };
      item.tag = {
        text,
        color: colorMap[goodsData.liveStatus],
        backgroundColor: backgroundColorMap[goodsData.liveStatus],
      };
    }
    list.push(item);
  }
  // if (goodsData.liveDuration) {
  //   list.push({
  //     label: '直播时长',
  //     value: `${goodsData.liveDuration}分钟`,
  //   });
  // }
  if (goodsData.pageView) {
    list.push({
      color: $theme.colors.main,
      value: `有 ${formatSalesNum(goodsData.pageView)} 人已学`,
    });
  }

  return list;
};
