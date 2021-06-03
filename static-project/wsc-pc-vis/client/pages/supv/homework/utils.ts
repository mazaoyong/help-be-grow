import { createRouter, RouterConfig } from '@youzan/tany-react';
import { switchBreadcrumb } from 'fns/router/create-router/breadcrumb';

export const timespanParser = ([startTime, endTime]: (string | null)[]): {
  startTime: string | null;
  endTime: string | null;
} => {
  let [parsedStartTime, parsedEndTime] = [
    startTime ? startTime + ' 00:00:00' : null,
    endTime ? endTime + ' 23:59:59' : null,
  ];

  return {
    startTime: parsedStartTime,
    endTime: parsedEndTime,
  };
};

export const superDecoder = (str: string) => {
  if (!str) return '';

  let res = str;
  for (let i = 0; i < 5; i++) {
    if (res.includes('%')) {
      try {
        res = decodeURI(res);
      } catch (e) {}
    } else {
      return res;
    };
  };
};

export const createRouterWithBreadcrumb = (config: RouterConfig) => {
  const setBreadcrumb = (route: any) => {
    if (route.meta) {
      switchBreadcrumb(route.meta.breadcrumb);
    }
  };

  let onEnter;
  if (config.onEnter) {
    onEnter = (route: any) => {
      setBreadcrumb(route);

      config.onEnter && config.onEnter(route);
    };
  } else {
    onEnter = setBreadcrumb;
  }

  return createRouter({
    ...config,
    onEnter,
  });
};
