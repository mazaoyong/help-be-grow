import React from 'react';
import { render, cleanup, fireEvent, waitFor, act } from '@testing-library/react';
import Select from '../index';
import { clickTrigger } from './sync.test';

/**
 * @description 单测使用react-testing-library，具体doc查看如下链接
 * @see https://testing-library.com/docs/react-testing-library/api#render-result 方法合集
 * @see https://testing-library.com/docs/dom-testing-library/api-queries dom查询合集
 */

const mock_defaultValues = [1, 2];
const mock_defaultOptions = [
  {
    text: '测试数据1',
    value: 1,
  },
  {
    text: '测试数据2',
    value: 2,
  },
];
const mock_options = [
  {
    text: 'fetch数据1',
    value: 11,
  },
  {
    text: 'fetch数据2',
    value: 12,
  },
];
let fetchSign = 0;
const mock_fetchOptions = (_, pagerequest) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      fetchSign += 1;
      resolve({
        options: mock_options,
        pageInfo: {
          current: pagerequest.current,
          total: mock_options.length,
        },
      });
    });
  });
};

// afterEach(() => (fetchSign = 0));
afterEach(cleanup);

// 多选模式下主要检验功能完整性，对UI渲染的检测不需要很完整，具体UI测试可以在同步模式中检验
describe('Select异步模式-单选', () => {
  test('测试新建、刷新按钮', async function () {
    const wrapper = render(
      <Select
        mode="async"
        showAdd
        showRefresh
        defaultValue={mock_defaultValues}
        defaultOptions={mock_defaultOptions}
        fetchOptions={mock_fetchOptions}
      />
    );
    // 需要打开一遍，要不会报act(https://reactjs.org/docs/test-utils.html#act)的错误
    clickTrigger(wrapper);
    await waitFor(() => {
      expect(fetchSign).toBe(1);
    });
    fireEvent.click(wrapper.baseElement);
    // RC的组件没有打进依赖，所以用mock的组件替代
    const operations = wrapper.queryByTestId('select-ops');
    expect(operations !== null).toBe(true);
  });

  test('组件加载完成请求数据', async function () {
    render(
      <Select
        mode="async"
        fetchOnMounted
        defaultValue={mock_defaultValues}
        defaultOptions={mock_defaultOptions}
        fetchOptions={mock_fetchOptions}
      />
    );
    await waitFor(() => {
      expect(fetchSign).toBe(1);
    });
  });

  test('打开输入框请求数据', async function () {
    const wrapper = render(
      <Select
        mode="async"
        fetchOnOpened
        defaultValue={mock_defaultValues}
        defaultOptions={mock_defaultOptions}
        fetchOptions={mock_fetchOptions}
      />
    );
    // 测试多次开启事件能够调用n次请求=
    const trigger = clickTrigger(wrapper);

    await waitFor(() => {
      expect(fetchSign).toBe(2);
    });
    fireEvent.click(wrapper.baseElement);
    act(() => {
      fireEvent.click(trigger);
    });
    await waitFor(() => {
      expect(fetchSign).toBe(3);
    });
  });
});

// describe('Select异步模式-多选', () => {
//   test('渲染和点击', function () {
//     expect(true).toBe(true); // add assert here!!
//   });
// });
