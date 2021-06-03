export const hasOption = (name: string, options: any) => {
  if (Array.isArray(options[name])) {
    return true;
  }

  if (options.mixins) {
    return options.mixins.some((mixin: any) => {
      return hasOption(name, mixin);
    });
  }
};

export const collectMapkeys = (name: string, options: any) => {
  let mapKeys: string[] = [];

  if (Array.isArray(options[name])) {
    mapKeys.push(...options[name]);
  }

  if (options.mixins) {
    options.mixins.map((mixin: any) => {
      mapKeys.push(...collectMapkeys(name, mixin));
    });
  }

  return mapKeys;
};
