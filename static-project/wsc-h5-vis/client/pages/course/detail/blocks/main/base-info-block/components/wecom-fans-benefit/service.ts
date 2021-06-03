import { ajax } from '@youzan/vis-ui';
import buildUrl from '@youzan/utils/url/buildUrl';

export const reportLatestViewedGoods: (alias: string) => Promise<boolean> = (alias) => {
  const kdtId = String(window._global.kdt_id);
  // 此处手动拼接暂无其他风险
  const goodsUrl = buildUrl(`/wscvis/course/detail/${alias}?kdt_id=${kdtId}`, 'h5', kdtId);
  return ajax({
    url: '/wscvis/ump/wecom-fans-benefit/recordUserGoods.json',
    method: 'POST',
    data: {
      goodsAlias: alias,
      goodsUrl,
    },
  });
};

// interface ICheckUnionIdResp {
//   hasUnionId: boolean;
//   authRedirectUrl: string;
// }

export const checkUnionId: () => Promise<boolean> = () => {
  // 此处手动拼接暂无其他风险
  return ajax({
    url: '/wscvis/ump/wecom-fans-benefit/checkUnionId.json',
    method: 'GET',
    data: {
      url: window.location.href,
    },
  });
};
