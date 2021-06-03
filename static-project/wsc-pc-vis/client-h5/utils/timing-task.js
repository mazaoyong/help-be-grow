class TimingTask {
  constructor(time = 10000) {
    this.time = time;
    this.count = 0;
    this.sum = time / 500;
  }

  start(cb) {
    return new Promise((resolve, reject) => {
      this.timer = setInterval(() => {
        this.count++;
        cb();

        if (this.count >= this.sum) {
          this.stop();
          reject();
        }
      }, 500);
    });
  }

  stop() {
    clearInterval(this.timer);
  }
};
export default TimingTask;
