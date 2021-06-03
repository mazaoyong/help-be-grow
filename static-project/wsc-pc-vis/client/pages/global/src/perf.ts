import PerfSDK from '@youzan/perf-sdk';

try {
  window.perfSDK = new PerfSDK({
    skynet: {
      app: 'wsc-pc-vis',
      log_index: 'perf_logs',
    },
    traceIdName: 'yz_log_uuid',
    ratio: 1,
    autoRatio: 1,
    auto: true,
  });
} catch (err) {}
