/**
 * 批量曝光
 * 通过addLogItem 触发定时 每次发布完之后取消定时器
 * @type {{__log: Array, __logSubscribe: Array, __logInterval: null, __intervalTime: number, addLogItem(*=): void, clearLog(): void, clearInterval(): void, initLog(): undefined, logSubscribe(): undefined, setLogSubscribe(*=): void}}
 */
const batchLog = {
  // 数据
  __log: [],

  // 订阅
  __logSubscribe: [],

  // 定时器
  __logInterval: null,

  // 时间间隔
  __intervalTime: 2000,

  // 添加
  addLogItem(item) {
    this.__log.push(item);
    this.initLog();
  },

  // 清空定时器
  clearInterval() {
    clearInterval(this.__logInterval);
    this.__logInterval = null;
    this.__log = [];
  },

  // 初始化
  initLog() {
    if (this.__logInterval) return;
    this.__logInterval = setInterval(() => {
      this.logSubscribe();
    }, this.__intervalTime);
  },

  // 触发订阅
  logSubscribe() {
    const logItems = this.__log;
    if (!logItems.length) return;
    this.__logSubscribe.forEach(item => {
      item.fn(logItems);
    });
    this.clearInterval();
  },

  // 添加订阅
  setLogSubscribe(fn) {
    this.__logSubscribe.push({
      fn,
    });
  },

};

export default batchLog;
