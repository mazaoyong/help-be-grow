import get from 'lodash/get';
import { visAjax } from '../new-ajax';
import { showAppMarketConfirm } from '../valid-pct-check';

// 店铺是否在试用期或者打烊
const isTry = get(window._global, 'lifecycle.lifecycleStatus') === 'try';
const isClose = get(window._global, 'lifecycle.lifecycleStatus') === 'close';
const v4 = get(window._global, 'url.v4');

// 知识付费权限校验
export function pctCheck(): Promise<any> {
  if (isTry) {
    return new Promise(resolve => resolve(true));
  }

  if (isClose) {
    showAppMarketConfirm({
      msg: '店铺已打烊，请续费后继续使用该功能',
      link: `${v4}/subscribe/serve/choose#chooseService`,
    });
    return Promise.reject(false);
  }

  return visAjax('GET', '/commom/shop/ability.json', { abilityCode: 'paid_content_ability' }).then(
    (ret): any => {
      if (ret.abilityStatus === 1) {
        return true;
      }
      showAppMarketConfirm();
      return Promise.reject(false);
    },
  );
}
