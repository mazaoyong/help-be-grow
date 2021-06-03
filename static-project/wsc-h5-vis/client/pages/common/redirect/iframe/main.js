import Args from '@youzan/utils/url/args';
import * as CustomSafeLink from 'common/utils/custom-safe-link';

const backupUrl = '/wscshop/showcase/homepage';

const getRedirectParams = () => {
  let redirectUrl = Args.get('redirectUrl') || backupUrl;

  try {
    redirectUrl = decodeURIComponent(redirectUrl);
  } catch (error) {
    redirectUrl = backupUrl;
  }

  return {
    url: redirectUrl,
  };
};

const redirect = (redirectParams) => {
  if (top === self) {
    // 不在iframe中直接跳转
    return CustomSafeLink.redirect(redirectParams);
  } else {
    top.location.href = CustomSafeLink.getSafeUrl(redirectParams);
  }
};

redirect(getRedirectParams());
