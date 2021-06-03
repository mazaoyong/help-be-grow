import { ajax } from '@youzan/vis-ui';

const global = window._global || {};
export const getFooterInfo = () => {
  return ajax({
    url: 'https://h5.youzan.com/wscvis/getFooter.json',
    data: {
      kdt_id: global.kdt_id,
    },
    loading: false,
  });
};
