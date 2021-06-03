import url from '@youzan/utils/url/args';

// 前置上报白名单，从某些页面跳转过来，即使用户没有点击，因为一些信息采集的必要性，必须要上报一下用户的账号信息
export const LOG_AUTOMATICALLY = ['force', 'media'] as const;

interface ICheckAutoLoggerRes {
  auto: boolean;
  type: typeof LOG_AUTOMATICALLY[number] | 'nil';
}
export async function checkAutoLogger(): Promise<ICheckAutoLoggerRes> {
  const fromType = url.get('fromType') || url.get('from-type');
  if (fromType) {
    let type = 'nil' as ICheckAutoLoggerRes['type'];
    const valid = LOG_AUTOMATICALLY.some((cType) => {
      type = cType;
      return cType === fromType;
    });
    if (valid) {
      return {
        auto: true,
        type,
      };
    }
  }
  return {
    auto: false,
    type: 'nil',
  };
}
