export const businessLog = ({ name, message, extra, level = 'info' }) => {
  if (_global.nodeEnv !== 'prod') {
    return;
  }
  try {
    const defaultExtra = {
      kdtId: _global.kdtId || 0,
      buyer: { userId: _global.userId, mobile: _global.mobile },
      originalUrl: location.href,
      platformInfo: { ua: navigator.userAgent },
      referer: document.referrer,
    };
    const extraConfig = Object.assign({}, defaultExtra, extra);
    window.ZanLogger.log({
      level,
      name,
      message,
      extra: extraConfig,
    });
  } catch (error) {
  }
};

window.yzStackLog = {
  log({ name, message, extra, level }) {
    businessLog({
      name,
      message,
      extra,
      level,
    });
  },
};
