import React from 'react';
import Countdown, { ITime } from './index';
import { cleanup, render } from '@testing-library/react/pure';
jest.useFakeTimers();

function getCustomReaminTimeText(time: ITime) {
  const { day, hour, minute, second } = time;
  return day + '天' + hour + '小时' + minute + '分钟' + second + '秒';
}

describe('倒计时组件', () => {
  afterEach(cleanup);

  test('组件成功渲染', () => {
    const callback = jest.fn();
    const { container } = render(<Countdown time={610} refresh={callback} />);
    expect(container.querySelector('em')).toBeTruthy();
  });

  test('组件按照传入方法渲染', async () => {
    const callback = jest.fn();
    const { findAllByText } = render(
      <Countdown time={610} refresh={callback} getCustomReaminTimeText={getCustomReaminTimeText} />,
    );
    expect(
      await findAllByText(
        getCustomReaminTimeText({
          day: 0,
          hour: 0,
          minute: 10,
          second: 10,
        }),
      ),
    ).toHaveLength(1);
  });

  test('倒计时结束调用传入refresh方法', async () => {
    const callback = jest.fn();
    render(
      <Countdown time={610} refresh={callback} getCustomReaminTimeText={getCustomReaminTimeText} />,
    );
    expect(callback).not.toBeCalled();
    jest.runAllTimers();
    expect(callback).toBeCalledTimes(1);
  });

  test('传入时间为0时, 不调用refresh方法', async () => {
    const callback = jest.fn();
    render(
      <Countdown time={0} refresh={callback} getCustomReaminTimeText={getCustomReaminTimeText} />,
    );
    jest.runAllTimers();
    expect(callback).not.toBeCalled();
  });
});
