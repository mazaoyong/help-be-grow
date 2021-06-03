import { DirectiveFunction } from 'vue';
import { isEqual } from 'lodash';

import {
  Timings,
  DirectiveMap,
  ITrackSetting,
} from '../types';
import Events from './events';

export default class Track extends Events {
  private $init: boolean = false;

  constructor(setting: ITrackSetting) {
    super(setting);
    this.$init = true;
  }

  public collect = (key: string, value: any) => {
    if (this.$init && key !== undefined && value !== undefined) {
      const prevValue = this.$store[key];
      // 如果两个值相同就不进行下一步设置
      if (isEqual(prevValue, value)) return;

      const cloneStore = { ...this.$store };
      this.$store[key] = value;
      this.runDataChangeTasks(cloneStore);
    }
  };

  // 页面元素曝光之后触发事件，会校验key相对应的埋点配置的timing的值
  // 用法：v-track:view.name
  private view: DirectiveFunction = (el, binding) => {
    this.bindingEle(binding, el, Timings.ViewDisplay);
    this.checkAndRunViewDisplayTasks();
  };
  // v-track:click.name
  private click: DirectiveFunction = (el, binding) => {
    this.bindingEle(binding, el, Timings.Interaction);
    el.addEventListener('click', evt =>
      this.directiveInvokeProxy(
        binding.modifiers,
        Timings.Interaction,
        evt,
      ),
    );
  };

  public trackDirective: DirectiveFunction = (el, binding, ...restParams) => {
    const arg = (binding.arg as unknown) as DirectiveMap;
    this[arg](el, binding, ...restParams);
  };
}
