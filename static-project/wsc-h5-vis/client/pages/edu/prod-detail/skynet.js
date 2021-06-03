// 第一版天网监控逻辑，具有较强侵入性

function monitor(params = {}) {
  try {
    const { name, action, type = 'page', code = 0 } = params;
    window.yzStackLog.monitor({
      extra: {
        name,
        action,
        type,
        code,
      },
    });
  } catch (error) {
  }
}

function skynetEnterMonitor() {
  monitor({
    name: 'prod-detail',
    action: 'enter',
  });
}

function skynetMountedMonitor() {
  monitor({
    name: 'prod-detail',
    action: 'mounted',
  });
}

export default {
  skynetEnterMonitor,
  skynetMountedMonitor,
};
