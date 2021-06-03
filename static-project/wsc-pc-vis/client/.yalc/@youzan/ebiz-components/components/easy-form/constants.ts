import get from 'lodash/get';
// @ts-ignore
export const NODE_ENV: string = get(_global, 'nodeEnv', 'prod');
