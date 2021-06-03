import { isNil, get } from 'lodash';
import { ITrackSetting } from '../types';

export default function validateConfigs(configsLike: ITrackSetting): void {
  const requiredKeys: Array<keyof Partial<ITrackSetting>> = ['configs', 'logClient', 'logClientSetting'];
  requiredKeys.every(key => {
    const isNotNil = !isNil(get(configsLike, key));
    if (!isNotNil) {
      throw new Error(`[directive track error] setting of track required ${key}, but get nothing`);
    }
    return isNotNil;
  });
};
