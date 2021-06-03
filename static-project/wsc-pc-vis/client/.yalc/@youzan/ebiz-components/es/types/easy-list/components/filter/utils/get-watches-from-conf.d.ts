import { WatchFunc, IFilterProps } from '../../../types/filter';
export default function getWatchesFromConf(configs: IFilterProps['config']): Record<string, [[WatchFunc, string]]>;
