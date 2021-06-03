import './style.scss';
declare class TimingTask {
    private time;
    private count;
    private sum;
    private timer;
    private interval;
    constructor(time?: number, interval?: number);
    start(cb: () => void): Promise<unknown>;
    stop(): void;
}
export default TimingTask;
export * from './types';
