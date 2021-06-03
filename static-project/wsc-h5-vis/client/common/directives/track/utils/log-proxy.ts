import { get } from 'lodash';

const GLOBAL_ENV = get(window, '_global.nodeEnv', 'prod');

export function logProxy(...content: any[]) {
  if (GLOBAL_ENV !== 'prod') {
    // eslint-disable-next-line no-console
    console.log(...content);
  }
}
