import { ENV } from '@/constants/env';
import { ICombineUrlConfig } from './types';

export function getUrlConfigByEnv(env: ENV, input: string): ICombineUrlConfig {
  switch (env) {
    case ENV.H5:
      return { url: input };
    case ENV.WEAPP:
    case ENV.SWAN_APP:
      return {
        page: '/packages/edu/webview/index',
        query: {
          targetUrl: encodeURIComponent(input),
        },
      };
    default:
      return {};
  }
}

// 以下为尝试支持原生页面
// import { ENV } from '@/constants/env';
// import { IAppUrlConfig } from './types';

// const WEBVIEW_PATH_MAP = {
//   [ENV.WEAPP]: '/packages/edu/webview/index',
//   [ENV.SWAN_APP]: '/packages/edu/webview/index',
// };

// export function getUrlConfigByEnv(env: ENV, input: string) {
//   switch (env) {
//     case ENV.H5:
//       return h5UrlConfigAdapter(input);
//     case ENV.WEAPP:
//     case ENV.SWAN_APP:
//       return commonAppUrlConfigAdapter(input, env);
//     default:
//       return '';
//   }
// }

// function h5UrlConfigAdapter(input: string) {
//   if (typeof input !== 'string') {
//     return '';
//   }
//   return input;
// }

// function commonAppUrlConfigAdapter(input: string | IAppUrlConfig, env:ENV): IAppUrlConfig {
//   if (typeof input === 'string') {
//     return {
//       page: WEBVIEW_PATH_MAP[env],
//       query: {
//         targetUrl: encodeURIComponent(input),
//       },
//     };
//   }
//   return input;
// }
