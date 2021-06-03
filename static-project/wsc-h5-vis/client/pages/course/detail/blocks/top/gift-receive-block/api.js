import { ajax } from '@youzan/vis-ui';

export function getReceiveGiftResult(alias, shareAlias, channelType, orderAlias, giftNo, giftSign) {
  return ajax({
    url: '/wscvis/knowledge/receive.json',
    data: {
      alias,
      shareAlias,
      channelType,
      orderAlias,
      giftNo,
      giftSign,
    },
    loading: false,
  });
}
