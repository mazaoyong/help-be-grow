import { visAjax } from 'fns/new-ajax';

export function getShopAbility(abilityCode: string) {
  return visAjax('GET', '/commom/shop/ability.json', { abilityCode });
}
