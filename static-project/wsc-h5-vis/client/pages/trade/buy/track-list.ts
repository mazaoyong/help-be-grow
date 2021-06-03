import { IConfig, Timings } from '@/common/directives/track';

// 进入下单页
const paidStatusEnterPage: IConfig = {
  name: 'paidStatusEnterPage',
  eventName: '浏览页面',
  eventId: 'visitpage',
  timing: Timings.EnterPage,
  withOrigin: true,
};

export default [paidStatusEnterPage];
