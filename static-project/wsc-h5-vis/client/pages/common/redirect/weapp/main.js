import { initWXSdk, ZNB } from '@youzan/wxsdk';
import Args from '@youzan/utils/url/args';

initWXSdk();
const toPath = Args.get('path');
const type = Args.get('type') || 'navigateTo';

ZNB.navigate({
  weappUrl: toPath,
  type,
  fallback: 'none',
});
