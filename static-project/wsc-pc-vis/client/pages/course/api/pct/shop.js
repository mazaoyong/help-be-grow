// 店铺相关查询接口
import { visAjax } from 'fns/new-ajax';

// 查询店铺能力
export function getShopAbility(abilityCode) {
  return visAjax('GET', '/commom/shop/ability.json', { abilityCode });
}
