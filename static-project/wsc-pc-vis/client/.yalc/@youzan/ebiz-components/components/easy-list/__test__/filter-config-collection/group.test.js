import React from 'react';
import { render, cleanup, act, fireEvent, waitFor } from '@testing-library/react';
import EasyList from '../../index';

/**
 * @description 单测使用react-testing-library，具体doc查看如下链接
 * @see https://testing-library.com/docs/react-testing-library/api#render-result 方法合集
 * @see https://testing-library.com/docs/dom-testing-library/api-queries dom查询合集
 */
const { Filter } = EasyList;

let watcherChange = {};
const filterConfig = [
  [
    {
      name: 'input1',
      type: 'Input',
      watch: [
        [
          function (value, { set }) {
            watcherChange.select = true;
            set({ value: 2 });
          },
          ['input2', 'input3'],
        ],
      ],
    },
  ],
  [
    {
      name: 'input2',
      type: 'Input',
    },
  ],
  [
    {
      name: 'input3',
      type: 'Input',
    },
  ],
];
const renderFilter = () => {
  /** @type {EasyFilterRefType} */
  const filterRef = React.createRef(null);
  /** @type {import('@testing-library/react').RenderResult<import('@testing-library/react').queries>} */
  let renderRes;
  act(() => {
    renderRes = render(<Filter ref={filterRef} config={filterConfig} />);
  });

  return {
    filter: renderRes,
    filterRef,
  };
};

afterEach(() => {
  watcherChange = Object.create({});
  cleanup();
});

describe('EasyList.Filter分组功能', function () {
  test('filter有三个分组', function () {
    const { filter } = renderFilter();
    const panels = filter.queryByTestId('filter-fields').querySelectorAll('.easy-filter__panel');
    expect(panels.length).toBe(3);
  });

  test('测试分组下watch函数是否有效', async () => {
    const { filter, filterRef } = renderFilter();
    act(() => {
      const inputEle = filter.queryByTestId('input2').querySelector('input');
      fireEvent.change(inputEle, { target: { value: 'changed value' } });
    });

    // 测试联动效果是否ok
    await waitFor(() => {
      expect(filterRef.current.getCurrentValues()).toMatchObject({
        input1: 2,
        input2: 'changed value',
        input3: '',
      });
    });
  });
});
