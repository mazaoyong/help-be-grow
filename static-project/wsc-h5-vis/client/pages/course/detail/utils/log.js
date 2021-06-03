import { getDefaultLogParams } from '../store';

export default function log(data) {
  window.yzlogInstance &&
    window.yzlogInstance.log({
      ...data,
      params: {
        ...data.params,
        ...getDefaultLogParams(),
      },
    });
}

export function skynetLog(level = 'warn', name = '', message = '', extra = {}) {
  window.yzStackLog &&
    window.yzStackLog.log({
      name,
      message,
      extra,
      level,
    });
}
