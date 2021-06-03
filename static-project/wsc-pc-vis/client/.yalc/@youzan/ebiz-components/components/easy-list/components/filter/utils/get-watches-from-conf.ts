// 从config中获取watch函数
// 需要对依赖关系进行分类
import { ICombinedFilterConf, WatchFunc, IFilterProps } from '../../../types/filter';

export default function getWatchesFromConf(
  configs: IFilterProps['config']
): Record<string, [[WatchFunc, string]]> {
  const WATCHES: Record<string, [[WatchFunc, string]]> = {};
  configs.forEach((config) => {
    if (Array.isArray(config)) {
      const configGroup = config;
      configGroup.forEach((configItem) => mapFiledWatchFuncs(configItem, WATCHES));
    } else {
      mapFiledWatchFuncs(config, WATCHES);
    }
  });

  return WATCHES;
}

function mapFiledWatchFuncs(
  conf: ICombinedFilterConf,
  watchStack: Record<string, [[WatchFunc, string]]>
) {
  const { name: boundName, watch: unGroupedWatches } = conf;
  if (unGroupedWatches) {
    if (Array.isArray(unGroupedWatches)) {
      const watchList = unGroupedWatches;
      watchList.forEach((watcher) => {
        const [effectFunc, dependenceList] = watcher;
        if (Array.isArray(dependenceList)) {
          dependenceList.forEach((dependence) => {
            addWatchFuncs(watchStack, effectFunc, boundName, dependence);
          });
        } else {
          /* istanbul ignore next */
          throw new Error(
            'dependence list should be array-type, please checkup config-' + boundName
          );
        }
      });
    } else {
      const watchFields = Object.keys(unGroupedWatches);
      /* istanbul ignore next */
      if (watchFields.length === 0) {
        return;
      }

      watchFields.forEach((field) => {
        const effectFunc = unGroupedWatches[field];
        addWatchFuncs(watchStack, effectFunc, boundName, field);
      });
    }
  }
}

function addWatchFuncs(
  watchStack: Record<string, [[WatchFunc, string]]>,
  effectFunc: WatchFunc,
  boundName: string,
  field: string
) {
  if (field === boundName) {
    throw new Error(`can not subscribe self, please checkup field ${boundName}`);
  }
  if (!watchStack[field]) {
    watchStack[field] = [[effectFunc, boundName]];
  } else {
    watchStack[field].push([effectFunc, boundName]);
  }
}
