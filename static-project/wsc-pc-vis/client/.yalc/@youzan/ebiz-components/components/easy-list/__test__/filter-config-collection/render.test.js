import React from 'react';
import { render, fireEvent, cleanup, screen, act, waitFor } from '@testing-library/react';
import EasyList from '../../index';

/**
 * @description 单测使用react-testing-library，具体doc查看如下链接
 * @see https://testing-library.com/docs/react-testing-library/api#render-result 方法合集
 * @see https://testing-library.com/docs/dom-testing-library/api-queries dom查询合集
 */

/** @typedef {import('../../types/list').IListProps} EasyListProps */
/** @typedef {import('../../types/filter').IFilterProps} EasyFilterProps */
/** @typedef {import('../../types/filter').FilterConfigType} EasyFilterConfig */
/** @typedef {React.RefObject<import('../../types/filter').FilterRefType>} EasyFilterRefType */

const { Filter, DatePickerTypes, InlineFilter, Tabs, Search, List } = EasyList;

// 渲染filter
let watcherChange = {};
/** @type {EasyFilterConfig} */
const filterConfig = [
  {
    name: 'input',
    type: 'Input',
    inheritProps: {
      placeholder: '请输入你想输入的文案',
    },
  },
  {
    name: 'select',
    type: 'Select',
    options: [
      { text: '选项1', value: 1 },
      { text: '选项2', value: 2 },
    ],
    inheritProps: {
      placeholder: '请选择你想要的选项',
    },
    watch: {
      input(value, { set }) {
        watcherChange.select = true;
        set({ value: 2 });
      },
    },
  },
  {
    name: 'selectPromise',
    type: 'Select',
    options() {
      return Promise.resolve([
        { text: '选项3', value: 3 },
        { text: '选项4', value: 4 },
      ]);
    },
    inheritProps: {
      placeholder: '请选择你想要的选项',
    },
    watch: {
      input(value, { set }) {
        watcherChange.select = true;
        set({ value: 2 });
      },
    },
  },
  {
    name: 'checkbox',
    label: 'checkbox',
    type: 'Checkbox',
    defaultValue: ['pineapple'],
    options: [
      { text: '凤梨', value: 'pineapple' },
      { text: '苹果', value: 'apple' },
      { text: '橘子', value: 'orange' },
      { text: '榴莲', value: 'durian', disabled: true },
    ],
    watch: {
      input(value, { set }) {
        watcherChange.checkbox = true;
        set({ value: ['pineapple', 'orange'] });
      },
    },
  },
  {
    name: 'radio',
    label: 'radio',
    type: 'Radio',
    options: [
      { text: '男', value: '1' },
      { text: '女', value: '0' },
    ],
  },
  {
    name: 'dateRangeQuickPicker',
    label: '快速时间范围：',
    type: DatePickerTypes.DateRangeQuickPicker,
    inheritProps: {
      valueType: 'number',
    },
  },
];
/**
 * @param {EasyFilterProps} [restProps=]
 */
const renderFilter = (restProps) => {
  /** @type {EasyFilterRefType} */
  const filterRef = React.createRef(null);
  /** @type {import('@testing-library/react').RenderResult<import('@testing-library/react').queries>} */
  let renderRes;
  act(() => {
    renderRes = render(<Filter config={filterConfig} {...restProps} ref={filterRef} />);
  });

  return {
    filter: renderRes,
    filterRef,
  };
};

/**
 * @param {EasyListProps} [listProps=]
 * @param {EasyFilterProps} [filterProps=]
 */
const renderFilterList = (listProps = {}, filterProps = {}) => {
  /** @type {EasyFilterRefType} */
  const filterRef = React.createRef(null);
  /** @type {import('@testing-library/react').RenderResult<import('@testing-library/react').queries>} */
  let renderRes;
  act(() => {
    renderRes = render(
      <List {...listProps} mode="none">
        <Filter config={filterConfig} {...filterProps} ref={filterRef} />
      </List>
    );
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
describe('EasyList.Filter 渲染部分', function () {
  test('测试折叠筛选项', async () => {
    const { filter, filterRef } = renderFilter({
      config: [{ name: 'visibleInput', type: 'Input' }],
      collapseConfig: [{ name: 'collapseInput', type: 'Input' }],
      collapseSwitcherLabel: ['关闭', '打开'],
    });
    expect(
      filter
        .queryByTestId('filter-collapse-fields')
        .classList.contains('easy-filter__panel_collapse')
    ).toBeTruthy();
    act(() => {
      fireEvent.click(screen.getByText('打开'));
    });
    expect(
      filter.queryByTestId('filter-collapse-fields').classList.contains('easy-filter__panel_expand')
    ).toBeTruthy();
    act(() => {
      filterRef.current.toggleState('collapse');
    });
    await waitFor(() => {
      expect(
        filter
          .queryByTestId('filter-collapse-fields')
          .classList.contains('easy-filter__panel_collapse')
      ).toBeTruthy();
    });
  });

  test('测试筛选按钮和重置按钮中间添加元素', () => {
    const { filter } = renderFilter({
      actionsOption: {
        beforeReset: <div>重置按钮之前</div>,
        afterReset: <div>重置按钮之后</div>,
      },
    });
    expect(filter.getByText('重置按钮之前')).toBeTruthy();
    expect(filter.getByText('重置按钮之后')).toBeTruthy();

    // 重新渲染提交按钮
    filter.rerender(<Filter renderActions={() => <div>自定义渲染</div>} />);
    expect(filter.getByText('自定义渲染'));
  });

  test('测试inheritProps', function () {
    const formatQueries = jest.fn((some) => some);
    const { filter } = renderFilter({ formatQueries });
    // invoke format queries
    expect(formatQueries).toBeCalled();

    const { queryByTestId } = filter;
    const selectEle = queryByTestId('select').querySelector('.zent-select-placeholder');
    const inputEle = queryByTestId('input').querySelector('input');
    expect(inputEle.placeholder).toEqual(filterConfig[0].inheritProps.placeholder);
    expect(selectEle.innerHTML).toEqual(filterConfig[1].inheritProps.placeholder);
  });

  test('测试InlineFilter组件', () => {
    const handleChange = jest.fn();
    const handleSubmit = jest.fn(() =>
      Promise.resolve({ dataset: [], pageInfo: { current: 1, total: 0 } })
    );
    const handlePressEnter = jest.fn();
    const inlineFilter = render(
      <List mode="none" onSubmit={handleSubmit} fetchInInit={false}>
        <InlineFilter
          right={<div id="rightNode">这是右边的内容</div>}
          left={[
            <div data-testid="search">
              <Search
                key="search0"
                name="search"
                onChange={handleChange}
                afterPressEnter={handlePressEnter}
              >
                <button>Search按钮</button>
              </Search>
            </div>,
            <Search key="search1" />,
          ]}
        />
      </List>
    );
    expect(screen.getByText('Search按钮')).toBeTruthy();
    const ele = inlineFilter.queryByTestId('easy-filter-inline');
    expect(ele.querySelector('#rightNode')).toBeTruthy();
    const searchEle = inlineFilter.queryByTestId('search').querySelector('input');
    act(() => {
      fireEvent.change(searchEle, { target: { value: 'search' } });
    });
    expect(handleChange).toBeCalled();
    act(() => {
      fireEvent.keyDown(searchEle, { key: 'Enter', code: 'Enter' });
    });
    act(() => {
      fireEvent.keyDown(searchEle, { key: 'Enter', code: 'Enter' });
    });
    expect(handlePressEnter.mock.calls.length).toBe(2);
    expect(handleSubmit.mock.calls.length).toBe(1);
  });

  test('测试Tabs', async () => {
    const handleChange = jest.fn();
    const handleSubmit = jest.fn(() =>
      Promise.resolve({ dataset: [], pageInfo: { current: 1, total: 0 } })
    );
    const tabContainer = render(
      <List mode="none" onSubmit={handleSubmit} defaultFilter={{ tabs: '2' }}>
        <Tabs
          name="tabs"
          tabs={[
            { label: '标签1', value: '1' },
            { label: '标签2', value: '2' },
          ]}
          onChange={handleChange}
        />
      </List>
    );
    const tabsBox = tabContainer.queryByTestId('easy-filter-tabs');
    const tabs = tabsBox.querySelectorAll('.zent-tabs-tab');
    expect(tabs.length).toBe(2);
    await waitFor(() => {
      expect(
        tabsBox.querySelector('.zent-tabs-tab__actived').innerHTML.includes('标签2')
      ).toBeTruthy();
    });
    act(() => {
      fireEvent.click(tabs[0]);
    });
    expect(
      tabsBox.querySelector('.zent-tabs-tab__actived').innerHTML.includes('标签1')
    ).toBeTruthy();
    expect(handleChange).toBeCalled();
  });
});

describe('测试数据是否正确', () => {
  // Check submit
  test('测试点击提交按钮', async () => {
    const formatFields = jest.fn((origin) => origin);
    const handleChange = jest.fn();
    const handleSubmit = jest.fn(() =>
      Promise.resolve({ dataset: [], pageInfo: { current: 1, total: 0 } })
    );
    const { filter, filterRef } = renderFilterList(
      { onSubmit: handleSubmit },
      { onChange: handleChange, formatFields }
    );
    const initValues = filterRef.current.getCurrentValues();
    const { queryByRole, queryByTestId } = filter;
    const inputEle = queryByTestId('input').querySelector('input');
    act(() => {
      fireEvent.change(inputEle, { target: { value: 'changed value' } });
    });

    const selectEle = queryByTestId('select').querySelector('.zent-select-placeholder');
    act(() => {
      fireEvent.click(selectEle);
    });
    const targetOpt = screen.queryByText('选项2');
    act(() => {
      fireEvent.click(targetOpt);
    });

    const checkboxEle = queryByTestId('checkbox').querySelector(
      '.zent-checkbox-checked .zent-checkbox-label'
    );
    // default value
    expect(checkboxEle.innerHTML).toEqual('凤梨');
    // change value
    const targetCheckbox = screen.queryByText('苹果');
    act(() => {
      fireEvent.click(targetCheckbox);
    });

    const targetRadio = screen.queryByText('女');
    act(() => {
      fireEvent.click(targetRadio);
    });

    const dateRangeQuickPickerEle = queryByTestId('dateRangeQuickPicker').querySelector(
      '.zent-date-range-picker__filter'
    );
    // has time preset
    expect(dateRangeQuickPickerEle).not.toBeNull();
    const targetPresetBtn = screen.queryByText('近7天');
    act(() => {
      fireEvent.click(targetPresetBtn);
    });

    // 选择一项，然后更改input的值，测试set(null)是否生效
    act(() => {
      fireEvent.change(inputEle, { target: { value: 'input value' } });
    });

    const submitButton = queryByRole('submit');
    act(() => {
      fireEvent.click(submitButton);
    });
    expect(handleSubmit.mock.calls.length).toBe(1);
    await waitFor(() => {
      expect(filterRef.current.getCurrentValues()).toMatchObject({
        input: 'input value',
        select: 2,
        checkbox: ['pineapple', 'apple'],
        radio: '0',
      });
      expect(filterRef.current.getCurrentValues().dateRangeQuickPicker.length).toBe(2);
      expect(filterRef.current.getCurrentValues().dateRangeQuickPicker[0].length).toBe(2);
    });

    // 响应onChange事件
    expect(handleChange).toBeCalled();
    act(() => {
      filterRef.current.reset();
    });
    await waitFor(() => {
      expect(filterRef.current.getCurrentValues()).toMatchObject(initValues);
    });
  });

  test('测试filter自动提交', async () => {
    const handleSubmit = jest.fn(() =>
      Promise.resolve({ dataset: [], pageInfo: { current: 1, total: 0 } })
    );
    const { filter, filterRef } = renderFilterList(
      { onSubmit: handleSubmit },
      { config: [{ name: 'autoFilter', type: 'Input' }], autoFilter: true }
    );
    const ele = filter.getByTestId('autoFilter');
    act(() => {
      fireEvent.change(ele.querySelector('input'), { target: { value: 'Mercedes' } });
    });
    expect(handleSubmit).toBeCalledWith(
      {
        autoFilter: 'Mercedes',
        page: 1,
        pageSize: 20,
      },
      {}
    );
    await waitFor(() => {
      expect(filterRef.current.getQueries()).toMatchObject({ autoFilter: 'Mercedes' });
    });
  });

  // 检测watch是否正常工作
  test('测试config watch属性是否正常工作', async () => {
    const { filter, filterRef } = renderFilter();
    const { queryByTestId } = filter;
    act(() => {
      const inputEle = queryByTestId('input').querySelector('input');
      fireEvent.change(inputEle, { target: { value: 'changed value' } });
    });

    // 是否触发watch函数
    const changeByWatchKey = Object.keys(watcherChange);
    expect(changeByWatchKey).toContain('checkbox');
    expect(changeByWatchKey).toContain('select');
    // 测试联动效果是否ok
    await waitFor(() => {
      expect(filterRef.current.getCurrentValues()).toMatchObject({
        select: 2,
        checkbox: ['pineapple', 'orange'],
      });
    });
  });
});

describe('测试EasyList Filter config属性', () => {
  test('测试自定义元素渲染', () => {
    renderFilter({
      config: [
        {
          name: 'custom',
          type: 'Custom',
          renderField() {
            return <span>自定义组件</span>;
          },
        },
      ],
    });
    expect(screen.getByTestId('custom')).toBeTruthy();
  });

  test('watch不能监听自身', () => {
    try {
      renderFilter({
        config: [
          {
            name: 'self',
            type: 'Input',
            watch: {
              self() {
                return;
              },
            },
          },
        ],
      });
    } catch (e) {
      expect(e instanceof Error).toBeTruthy();
    }
  });

  test('当需要options的组件缺少options属性', () => {
    expect(
      jest.fn(() => {
        renderFilter({
          config: [{ name: 'radio', type: 'Radio' }],
        });
      })
    ).toThrow();

    expect(
      jest.fn(() => {
        renderFilter({
          config: [{ name: 'checkbox', type: 'Checkbox' }],
        });
      })
    ).toThrow();
  });

  test('当Select.options为函数类型', () => {
    expect(
      jest.fn(() => {
        renderFilter({
          config: [
            {
              name: 'select',
              type: 'Select',
              options() {
                return null;
              },
            },
          ],
        });
      })
    ).toThrow();
  });

  test('inheritProps使用onChange属性', () => {
    const handleChange = jest.fn();
    const { filter, filterRef } = renderFilter({
      config: [{ name: 'input', type: 'Input', onChange: handleChange }],
    });
    const inputEle = filter.queryByTestId('input').querySelector('input');
    act(() => {
      fireEvent.change(inputEle, { target: { value: 'changed value' } });
    });
    expect(handleChange).toBeCalled();
  });
});
