import { ajax } from '@youzan/vis-ui';
export { getVuePoster } from '@/common/apis/poster';

const collecZanUrpPrefix = '/wscvis/ump/collect-zan';

export function buildZanSet(zanId: number, targetAlias: string, skuId: number) {
  return ajax({
    url: `${collecZanUrpPrefix}/buildZanSet.json`,
    data: {
      zanId,
      targetAlias,
      skuId,
    },
  });
}

export function getZanDetail(data: any) {
  return ajax({
    url: `${collecZanUrpPrefix}/zanSetDetail.json`,
    data,
  });
}

export function clickPraise(data: any) {
  return ajax({
    url: `${collecZanUrpPrefix}/givingZan.json`,
    data,
  });
}
