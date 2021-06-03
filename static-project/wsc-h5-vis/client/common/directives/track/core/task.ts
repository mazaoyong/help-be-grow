import {
  ITrackSetting,
  Timings,
  IConfig,
  ICirculationConfig,
  IChangeByDataConfig,
} from '../types';
import getGCD from '../utils/get-gcd';
import mapKeys from '../utils/map-keys';
import canInvokeChecker from '../utils/can-invoke-checker';
import Client from './client';
import { VNodeDirective } from 'vue';
import { logProxy } from '@/common/directives/track/utils/log-proxy';

export interface TimingTask {
  config: IConfig;
  ele: HTMLElement[] | null;
  lastUpdateTime: number | null;
  updateTimes: number;
  overloaded: boolean;
}

const restProps = {
  ele: null,
  lastUpdateTime: null,
  updateTimes: 0,
  overloaded: false,
};

export default class Task extends Client {
  public $timingTask: Map<Timings, Map<string, TimingTask>> = new Map();
  public $taskInit: boolean = false;

  private _runningCirculationTasks = false;
  private _$circulationTasks: Map<string, TimingTask> = new Map();

  private _initTrackers = (configs: ITrackSetting['configs']) => {
    if (Array.isArray(configs) && configs.length) {
      configs.forEach(this._pushTask);
    }
  };

  private _addCirculationTask(config: ICirculationConfig) {
    const { interval, name } = config as ICirculationConfig;
    if (interval < 5000) {
      logProxy('循环事件的上报时间间隔应该不小于5s');
    } else {
      // 如果是循环事件，统一放到一个循环事件的Map中
      this._$circulationTasks.set(name, { config, ...restProps });
    }
    this._checkAndRunCirculationTasks();
  }

  private _pushTask = (config: IConfig) => {
    const { name, timing } = config || {};
    if (name && timing) {
      if (config.timing === Timings.Circulation) {
        this._addCirculationTask(config);
        return;
      }
      const currentTypeTasks = this.$timingTask.get(timing);
      if (currentTypeTasks) {
        currentTypeTasks.set(name, { config, ...restProps });
      } else {
        const taskMap = new Map<string, TimingTask>();
        taskMap.set(name, { config, ...restProps });
        this.$timingTask.set(timing, taskMap);
      }
    }
  };

  private _runCirculationTasks = (interval: number) => {
    if (this._$circulationTasks.size) {
      const timer = setInterval(() => {
        const curTimestamp = new Date().getTime();
        this._$circulationTasks.forEach(task => {
          const { config, lastUpdateTime } = task;
          const {
            interval: taskInterval,
            name,
            maxTimes,
          } = config as ICirculationConfig;
          // 不能直接跟时间间隔进行比较，setInterval有误差，需要设置触发间隔可以接受的区间
          const minTaskInterval = taskInterval - 300;
          const curInterval = curTimestamp - (lastUpdateTime || 0);
          if (minTaskInterval <= curInterval) {
            this.invokeTask(config);
            task.lastUpdateTime = curTimestamp;
            task.updateTimes += 1;
          }

          // 如果限制了最大运行次数，就在完成后删除该任务
          if (maxTimes && task.updateTimes >= maxTimes) {
            this._$circulationTasks.delete(name);
            logProxy(
              `%c任务${name}触发次数已达上限`,
              'background-color: green; color: #fff',
            );
            // 如果没有定时任务，就设置标志位为false，以便下次再次开启
            if (this._$circulationTasks.size === 0) {
              this._runningCirculationTasks = false;
              logProxy(
                '%c循环任务执行完毕，清除定时器',
                'background-color: green; color: #fff',
              );
              clearInterval(timer);
            }
          }
        });
      }, interval);
    }
  };

  // 检测是否有循环任务，以及循环任务是否开启
  private _checkAndRunCirculationTasks = () => {
    if (!this._runningCirculationTasks) {
      if (this._$circulationTasks.size) {
        const timerList: number[] = [];
        this._$circulationTasks.forEach(task =>
          timerList.push((task.config as ICirculationConfig).interval),
        );
        logProxy(
          '%c发现循环任务，正在初始化定时器...',
          'background-color: yellow; color: #323233',
        );
        const timer = setTimeout(() => {
          const timeGap = getGCD(timerList);
          logProxy(
            `%c初始化完成定时器，定时器间隔为: ${timeGap}ms`,
            'background-color: green; color: #fff',
          );
          this._runCirculationTasks(timeGap);
          clearTimeout(timer);
        }, 0);
        this._runningCirculationTasks = true;
      }
    }
  };

  constructor(setting: ITrackSetting) {
    super(setting);

    this._initTrackers(setting.configs);
    this._checkAndRunCirculationTasks();
    this.$taskInit = true;
  }

  public getCurrentTask = (timing: Timings, name: string) => {
    if (this.$timingTask.size) {
      const currentTypeTasks = this.$timingTask.get(timing);
      if (currentTypeTasks) {
        return currentTypeTasks.get(name);
      }
    }
    return undefined;
  };

  public runTasksOnPageEnter = () => {
    if (this._$circulationTasks.size) {
      this._$circulationTasks.forEach(task => {
        const { lastUpdateTime = null, config } = task;
        const { runOnEnterPage = false } = config as ICirculationConfig;
        if (runOnEnterPage && lastUpdateTime === null) {
          this.invokeTask(config);
          task.lastUpdateTime = new Date().getTime();
        }
      });
    }
  };

  public runTasksOnPageLeave = () => {
    if (this._$circulationTasks) {
      this._$circulationTasks.forEach(task => {
        const { config } = task;
        const { name, runOnLeavePage = false } = config as ICirculationConfig;
        if (runOnLeavePage) {
          this.invokeTask(config);
          this._$circulationTasks.delete(name);
        }
      });
    }
  };

  private _checkOverload = (task: TimingTask) => {
    const { config, updateTimes, overloaded } = task;
    const { maxTimes, name } = config as IChangeByDataConfig;
    if (maxTimes && updateTimes >= maxTimes) {
      if (!overloaded) {
        logProxy(
          `%c任务${name}触发次数已达上限`,
          'background-color: green; color: #fff',
        );
        task.overloaded = true;
      }
      return true;
    }
    return false;
  };

  public runDataChangeTasks = (prevStore: Record<string, any>) => {
    const changedByDataTasks = this.$timingTask.get(Timings.ChangeByData);
    if (changedByDataTasks) {
      changedByDataTasks.forEach(task => {
        const { config } = task;
        const overloaded = this._checkOverload(task);
        const canInvoke = canInvokeChecker(config, prevStore, {
          ...this.$store,
        });
        if (!overloaded && canInvoke) {
          this.invokeTask(config);
          task.updateTimes += 1;
          task.lastUpdateTime = new Date().getTime();
        }
      });
    }
  };

  public directiveInvokeProxy = (
    modifiers: object,
    type: Timings,
    evt?: any,
  ) => {
    if (this.$taskInit) {
      const taskName = mapKeys(modifiers)[0];
      const currentTask = this.getCurrentTask(type, taskName);
      if (currentTask) {
        const overloaded = this._checkOverload(currentTask);
        if (!overloaded) {
          const { config } = currentTask;
          // 如果存在任务配置，需要将evt作为部分入参
          this.invokeTask(config, this.getStore(config, evt));
          currentTask.updateTimes += 1;
          currentTask.lastUpdateTime = new Date().getTime();
        }
      }
    }
  };

  private rebindEle = (task: IConfig, binding: VNodeDirective) => {
    const newBinding: VNodeDirective = {
      ...binding,
      value: undefined,
      modifiers: {
        [task.name]: true,
      },
    };
    return (el: HTMLElement, type: Timings) => {
      this.bindingEle(newBinding, el, type);
    };
  };

  public bindingEle = (
    binding: VNodeDirective,
    el: HTMLElement,
    type: Timings,
  ) => {
    const { modifiers, value } = binding;
    const taskName = mapKeys(modifiers)[0];
    const currentTask = this.getCurrentTask(type, taskName);
    if (currentTask) {
      if (currentTask.ele) {
        currentTask.ele.push(el);
      } else {
        currentTask.ele = [el];
      }
    } else {
      if (value) {
        // 如果没有找到相应的任务，但是指定了value属性，就当做value属性是一个合法的任务配置进行初始化
        const bindingTasks: IConfig | IConfig[] = value;
        this.addTask(bindingTasks);
        // 因为事件没有被添加进去，所以在添加完之后重新绑定事件
        if (Array.isArray(bindingTasks)) {
          bindingTasks.forEach(task => this.rebindEle(task, binding)(el, type));
        } else {
          this.rebindEle(bindingTasks, binding)(el, type);
        }
      }
    }
  };

  // 重置任务状态
  public resetTasks = () => {
    if (this.$timingTask.size) {
      this.$timingTask.forEach(taskMap => {
        if (taskMap.size) {
          taskMap.forEach(task => {
            task.lastUpdateTime = null;
            task.updateTimes = 0;
          });
        }
      });
    }
  };

  // 动态添加埋点配置
  public addTask = (task: IConfig | IConfig[]) => {
    if (Array.isArray(task)) {
      task.forEach(this._pushTask);
    } else {
      this._pushTask(task);
    }
  };

  // 直接运行任务，如果没有指定timing会运行第一个找到的任务
  public runTask = (id: string, timing?: Timings) => {
    let curTask: TimingTask | undefined;
    if (timing) {
      curTask = this.getCurrentTask(timing, id);
    } else {
      // 没有指定事件类型
      this.$timingTask.forEach(timingTasks => {
        if (!curTask) {
          curTask = timingTasks.get(id);
        }
      });
    }
    if (curTask) {
      const { config } = curTask;
      this.invokeTask(config, this.getStore(config));
    }
  };
}
