import get from 'lodash/get';

// @ts-ignore
export const YZ_NODE_ENV = get(window._global, 'nodeEnv', 'prod');
export const EBIZ_NODE_ENV = get(process, 'env.NODE_ENV', 'production');
