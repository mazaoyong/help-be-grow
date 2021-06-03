import { merge } from 'lodash';
import { Timings, IViewDisplayConfig, IIntersectionObserverEntry, ITrackSetting } from '../types';
import Task from './task';
import { getParamsFromConfig } from '../utils/invoke-log';
import getIntersectionRatio from '../utils/get-intersection-ratio';
import { logProxy } from '@/common/directives/track/utils/log-proxy';

export default class Events extends Task {
  private _invokeEnterPage = () => {
    if (this.$setting.logClientSetting.autoEnterpage) {
      const enterpageTasks = this.$timingTask.get(Timings.EnterPage);
      if (enterpageTasks) {
        enterpageTasks.forEach((task) => {
          const { config } = task;
          this.invokeTask(config);
        });
      }
      this.runTasksOnPageEnter();
    }
  };

  private _sendLeaveBacon = (passiveData: Record<string, any>) => {
    const logNodeHref = `${(this.$setting.leavePagePrefix || '').replace(
      /^[^/]{1}/,
      ($1) => `/${$1}`,
    )}/track/api/leavepage`;
    logProxy('离开页面埋点需要在node端实现相关接口');
    return navigator.sendBeacon(logNodeHref, JSON.stringify(passiveData));
  };

  private _initLeavePage = () => {
    if (navigator.sendBeacon !== undefined) {
      window.addEventListener('beforeunload', () => {
        const leavepageTasks = this.$timingTask.get(Timings.LeavePage);
        if (leavepageTasks) {
          const logDefaultParams = this.$logClient.getData();
          const eventTpl = logDefaultParams.event || {};
          leavepageTasks.forEach((task) => {
            const { config } = task;
            const trackData = this.getStore(config);
            if (trackData.params === 'TERMINATE') return;
            // prettier-ignore
            const [passiveParams] = getParamsFromConfig(config, trackData)(config.eventType || 'custom');
            const _leaveParams = {
              ...logDefaultParams,
              events: [merge(eventTpl, passiveParams.event)],
            };
            const res = this._sendLeaveBacon(_leaveParams);
            if (res) leavepageTasks.delete(config.name);
          });
          this.runTasksOnPageLeave();
        }
      });
    } else {
      // eslint-disable-next-line no-console
      console.error('浏览器不支持sendBeaconAPI');
    }
  };

  private _mapDisplayTasks = () => {
    const displayTasks = this.$timingTask.get(Timings.ViewDisplay);
    if (displayTasks) {
      displayTasks.forEach((taskConfig) => {
        const { ele: elements, config } = taskConfig;
        const viewDisplayConfig = config as IViewDisplayConfig;
        const { data } = viewDisplayConfig;
        let intersectionEntries: IIntersectionObserverEntry[] | undefined;
        if (data) {
          if (elements && elements.length) {
            intersectionEntries = elements.map((ele) => {
              const DOMRect = ele.getBoundingClientRect();
              const { intersectionRatio, contentDisplayRatio } = getIntersectionRatio(DOMRect);
              return {
                element: ele,
                intersectionRatio,
                contentDisplayRatio,
                intersectionRect: DOMRect,
                isIntersection: intersectionRatio > 0,
                boundingClientRect: ele.getBoundingClientRect,
              };
            });
          }

          if (typeof data === 'function') {
            const passiveData = data(this.$store, intersectionEntries);
            this.invokeTask(viewDisplayConfig, this.attachTimestamp({ params: passiveData }));
          } else {
            this.invokeTask(viewDisplayConfig, this.attachTimestamp({ params: data }));
          }
        }
      });
    }
  };

  // 是否初始化曝光事件的标志位
  private _runningViewDisplay = false;
  // 添加页面曝光事件的监听
  private _initViewDisplay = () => {
    if (this.$timingTask.get(Timings.ViewDisplay)) {
      this._runningViewDisplay = true;
      const timer = setTimeout(() => {
        this._mapDisplayTasks();
        clearTimeout(timer);
      }, 0);
      window.addEventListener('scroll', () => {
        window.requestAnimationFrame(() => this._mapDisplayTasks());
      });
    }
  };

  constructor(setting: ITrackSetting) {
    super(setting);

    // 触发enterpage事件上报
    this._invokeEnterPage();
    // 初始化离开页面上报数据
    this._initLeavePage();
    this._initViewDisplay();
  }

  public checkAndRunViewDisplayTasks = () => {
    if (!this._runningViewDisplay) {
      this._initViewDisplay();
    }
  };

  public runDisplayTasks = () => {
    this._mapDisplayTasks();
  };
}
