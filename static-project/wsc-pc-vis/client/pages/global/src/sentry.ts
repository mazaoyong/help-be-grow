import get from 'lodash/get';

window.Raven && window.Raven.setDataCallback((data) => {
  if (data.logger !== 'ajax') {
    const msg = get(data, 'exception.values[0]', {});
    window.yzStackLog.log({
      name: 'sentry',
      message: `${msg.type} ${msg.value}`,
      extra: data,
      level: 'warn',
    });
  }
  return data;
});
