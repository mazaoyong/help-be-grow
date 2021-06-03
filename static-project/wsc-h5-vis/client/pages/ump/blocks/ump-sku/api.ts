import { ajax } from '@youzan/vis-ui';

export function getOriginSku(data: Object) {
  return ajax({
    url: '/wscvis/course/detail/getSkuFormatModel.json',
    data,
  });
};
