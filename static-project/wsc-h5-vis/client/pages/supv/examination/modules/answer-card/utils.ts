export function withMixin(cpt: any, mixin: any) {
  const mixins = cpt.mixins || [];
  mixins.push(Object.assign({}, mixin));
  cpt.mixins = mixins;
  return cpt;
}
