import React, { Component } from 'react';

interface IProps {
  time: number;
  className?: string;
  refresh: () => void;
  getCustomReaminTimeText?: (T: ITime) => string | JSX.Element;
}

export interface ITime {
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export interface ICountdownState {
  remainTime: number;
}

/**
 * iron-front 迁移过来
 */
class Countdown extends Component<IProps, ICountdownState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      remainTime: props.time,
    };
  }

  private interval;

  componentDidMount() {
    this.startInterval();
  }

  componentWillUnmount() {
    this.stopInterval();
  }

  componentWillReceiveProps(nextProps: IProps) {
    this.setState({
      remainTime: nextProps.time,
    });
    this.stopInterval();
    this.startInterval();
  }

  startInterval() {
    if (this.state.remainTime <= 0) {
      return;
    }

    // eslint-disable-next-line @youzan/wsc-pc/no-interval
    this.interval = setInterval(() => {
      const remainTime = this.state.remainTime - 1;
      if (remainTime >= 0) {
        this.setState({ remainTime });
      } else {
        this.stopInterval();
        this.props.refresh();
      }
    }, 1000);
  }

  stopInterval() {
    // eslint-disable-next-line @youzan/wsc-pc/no-interval
    clearInterval(this.interval);
  }

  addZero(num) {
    return num >= 10 ? num : `0${num}`;
  }

  getRemainTimeText() {
    let time = this.state.remainTime;

    const second = this.addZero(time % 60);
    time = (time - second) / 60;
    const minute = this.addZero(time % 60);
    time = (time - minute) / 60;
    const hour = time % 24;
    time = (time - hour) / 24;
    const day = time;

    const getCustomReaminTimeText = this.props.getCustomReaminTimeText;

    if (typeof getCustomReaminTimeText === 'function') {
      return getCustomReaminTimeText({
        day,
        hour,
        minute,
        second,
      });
    }

    return day + '天' + hour + '小时' + minute + '分钟' + second + '秒';
  }

  render() {
    const remainTimeText = this.getRemainTimeText();
    return <em className={this.props.className}>{remainTimeText}</em>;
  }
}

export default Countdown;
