import { IConfig, Timings } from '@/common/directives/track';

const liveRoomTrackConfig: IConfig[] = [
  {
    name: 'statisticPV',
    eventName: '视频直播卖货PV',
    timing: Timings.Interaction,
    eventId: 'live_selling_pv',
    data(store) {
      if (!store.liveRoomId) {
        return 'TERMINATE';
      }
      return {
        goods_id: store.goodsId,
        alias: store.alias,
        origin: 'LIVE_SELLING',
        goods_type: store.owlType,
        origin_value: store.liveRoomId,
      };
    },
  },
];

export default liveRoomTrackConfig;
