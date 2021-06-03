import ajax from 'zan-pc-ajax';

export function checkYibanToken(data) {
  return ajax({
    url: '/v4/shop/design/yiban/yibanSubscribe.json',
    method: 'POST',
    data,
  });
}
