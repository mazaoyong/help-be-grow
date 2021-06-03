import './style.scss';

class TimingTask {
  private time: number;
  private count: number;
  private sum: number;
  private timer: NodeJS.Timer | number | null;
  private interval: number;

  constructor(time: number = 10000, interval: number = 500) {
    this.time = time;
    this.interval = interval;
    this.count = 0;
    this.sum = time / 500;
    this.timer = null;
  }

  start(cb: () => void) {
    if (!this.interval || this.time < this.interval) {
      this.interval = this.time;
    }

    /* eslint-disable-next-line */
    return new Promise((_resolve, reject) => {
      this.timer = setInterval(() => {
        this.count++;
        cb();

        if (this.count >= this.sum) {
          this.stop();
          reject();
        }
      }, this.interval);
    });
  }

  stop() {
    clearInterval(Number(this.timer));
  }
}

export default TimingTask;
export * from './types';
