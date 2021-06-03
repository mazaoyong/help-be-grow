import { VueConstructor } from 'vue';

import Track from './core';
import type { IConfig, ITrackSetting, Timings } from './types';

export interface ITrackPublicAPIs {
  collect(key: string, value: any): void;

  runTask(id: string, timing?: Timings): void;

  addTask(task: IConfig | IConfig[]): void;

  resetTasks(): void;

  resetStore(): void;

  runDisplayTasks(): void;
}

function install(Vue: VueConstructor, setting: ITrackSetting) {
  const track = new Track(setting);
  const _publicAPIs: ITrackPublicAPIs = {
    collect: track.collect,
    runTask: track.runTask,
    addTask: track.addTask,
    resetTasks: track.resetTasks,
    resetStore: track.resetStore,
    runDisplayTasks: track.runDisplayTasks,
  };
  Vue.prototype.$track = _publicAPIs;
  // 全局注入API方法
  if ((window as unknown as Record<string, any>).$track === undefined) {
    (window as unknown as Record<string, any>).$track = _publicAPIs;
  } else {
    // eslint-disable-next-line no-console
    console.error('页面中不允许存在两个埋点实例');
  }

  // 注册指令
  Vue.directive('track', {
    inserted: track.trackDirective,
  });
}

export { default as Track } from './core';
export default {
  install,
};
export * from './types';
