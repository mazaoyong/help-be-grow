import { ajax } from '@youzan/vis-ui';

export function getShareRank(alias, shareAlias, channelType, orderAlias, page, pageSize) {
  return ajax({
    url: '/wscvis/knowledge/getGiftShareRankInfo.json',
    data: {
      alias,
      shareAlias,
      channelType,
      orderAlias,
      pageSize,
      page,
    },
    loading: false,
  });
}
