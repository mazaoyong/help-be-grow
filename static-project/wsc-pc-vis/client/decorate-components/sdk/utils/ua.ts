export const compatibleBrowser = () => {
  const userAgent = window.navigator.userAgent;
  const platform = userAgent.toLowerCase();
  if (platform.indexOf('webkit') > -1 || platform.indexOf('firefox') > -1) {
    return true;
  } else {
    return false;
  }
};
