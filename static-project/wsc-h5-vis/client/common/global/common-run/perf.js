import PerfSDK from '@youzan/perf-sdk';

try {
  window.perfSDK = new PerfSDK({
    skynet: {
      app: 'wsc-h5-vis',
      log_index: 'perf_logs',
    },
    traceIdName: 'yz_log_uuid',
    ratio: 1,
    autoRatio: 1,
    auto: true,
    autoExcludes: [
      'p=contentshow',
      'p=columnshow',
    ],
  });
} catch (err) {}
