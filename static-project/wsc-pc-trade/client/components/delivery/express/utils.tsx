const templateUrls = {
  1: '/v4/trade/hq/delivery/template',
  2: '/v4/trade/hq/delivery/setting/express',
  3: '/v4/trade/express',
};

export const getTemplateUrl = (templateType: number) => {
  return templateUrls[templateType];
};
