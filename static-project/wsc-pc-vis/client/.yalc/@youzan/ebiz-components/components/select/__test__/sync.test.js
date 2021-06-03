import React from 'react';
import { render, cleanup, fireEvent, act } from '@testing-library/react';
import Select from '../index';

/**
 * @description 单测使用react-testing-library，具体doc查看如下链接
 * @see https://testing-library.com/docs/react-testing-library/api#render-result 方法合集
 * @see https://testing-library.com/docs/dom-testing-library/api-queries dom查询合集
 */

afterEach(cleanup);

const staticOptions = [
  {
    text: '测试数据1',
    value: 1,
    extra: '额外的内容',
  },
  {
    text: '测试数据2',
    value: 2,
    disabled: true,
  },
  {
    text: '测试数据3',
    value: 3,
  },
  {
    text: '测试数据4',
    value: 4,
  },
  {
    text: '测试数据5',
    value: 5,
  },
];

const noData = [];

export function testFocus(trigger) {
  const focus = fireEvent.click(trigger);
  expect(focus).toBe(true);
}

/**
 * @return {Element}
 */
export function clickTrigger(wrapper) {
  const triggerWrapper = wrapper.queryByTestId('select-trigger');
  const trigger = triggerWrapper.querySelector('input');
  if (trigger) {
    act(function () {
      fireEvent.click(trigger);
    });
    return trigger;
  }
  act(function () {
    fireEvent.click(triggerWrapper);
  });
  return triggerWrapper;
}

describe('Select同步模式-单选', () => {
  test('渲染和点击', function () {
    let _value = [];
    let _openSign = 0;
    let _selectSign = 0;
    // onClose回调因为popover实现问题，在点击document.body的时候不会触发onVisibleChange
    // 所以改为判断是否有下拉框来判断
    const wrapper = render(
      <Select
        clearable
        mode="sync"
        width="250px"
        className="$$test"
        defaultValue={[4]}
        dropdownClassName="$$test"
        options={staticOptions}
        placeholder="测试placeholder"
        onOpen={() => _openSign++}
        onSelect={() => _selectSign++}
        onChange={(val) => (_value = val)}
      />
    );

    const container = wrapper.queryByTestId('select-container');
    // className
    expect(container.classList.contains('$$test')).toBe(true);

    const triggerWrapper = wrapper.queryByTestId('select-trigger');
    /** @type {HTMLInputElement} */
    const trigger = triggerWrapper.querySelector('input');

    // width
    expect(triggerWrapper.style.width).toBe('250px');

    // placeholder
    expect(trigger.placeholder).toBe('测试placeholder');
    expect(trigger !== null).toBe(true);

    // default value
    expect(trigger.value).toBe('测试数据4');

    testFocus(trigger);
    // onOpen
    expect(_openSign).toBe(1);
    const dropdown = wrapper.baseElement.querySelector('.option-list');
    expect(dropdown.childElementCount).toBe(staticOptions.length);

    // dropdownClass
    const dropdownProvider = wrapper.baseElement.querySelector('.ebiz-select-dropdown-provider');
    expect(dropdownProvider.classList.contains('$$test')).toBe(true);

    // 点击第一个选项
    act(() => {
      fireEvent.click(dropdown.childNodes[0]);
    });
    expect(_value.length).toBe(1);
    expect(_value).toEqual([1]);
    // 展示delete按钮
    expect(triggerWrapper.classList.contains('show-delete')).toBe(true);
    // onSelect
    expect(_selectSign > 0).toBe(true);

    // 清空选项
    const clearBtn = wrapper.queryByTestId('select-clearBtn');
    fireEvent.click(clearBtn);
    expect(_value.length).toBe(0);
    // delete按钮清空
    expect(triggerWrapper.classList.contains('show-delete')).toBe(false);

    // 测试禁用
    const disabledNodes = dropdown.querySelectorAll('.set-option-disabled');
    expect(disabledNodes.length).toBe(1);

    // 点击外部区域
    fireEvent.click(wrapper.baseElement);
    const nullableDropdown = wrapper.baseElement.querySelector('.option-list');
    expect(nullableDropdown).toBe(null);

    // 测试没有备选项的情况
    wrapper.rerender(<Select options={noData} noData="没有可选项" />);
    testFocus(trigger);
    const noDataDropdown = wrapper.baseElement.querySelector('.option-list');
    expect(noDataDropdown.childElementCount).toBe(1);
    expect(noDataDropdown.firstChild.textContent).toBe('没有可选项');
  });

  test('选项prefix和suffix', function () {
    const wrapper = render(
      <Select
        prefixOption={<div>这里是prefixOption</div>}
        suffixOption={<div>这里是suffixOption</div>}
      />
    );
    clickTrigger(wrapper);

    const dropdown = wrapper.baseElement.querySelector('.option-list');
    expect(dropdown.childElementCount).toBe(3);
    expect(dropdown.firstChild.textContent).toBe('这里是prefixOption');
    expect(dropdown.lastChild.textContent).toBe('这里是suffixOption');
  });

  test('输入事件', function () {
    const wrapper = render(<Select options={staticOptions} filter />);
    const trigger = clickTrigger(wrapper);

    // 输入筛选条件
    fireEvent.input(trigger, { target: { value: '测试数据3' } });
    const dropdown = wrapper.baseElement.querySelector('.option-list');
    expect(dropdown.childElementCount).toBe(1);
    expect(dropdown.firstChild.textContent).toBe('测试数据3');
  });

  test('测试键盘事件', function () {
    let _selectedOpts = null;
    const wrapper = render(
      <Select options={staticOptions} onChange={(vals) => (_selectedOpts = vals)} />
    );
    clickTrigger(wrapper);

    fireEvent.keyDown(wrapper.baseElement, { code: 'ArrowDown' });
    fireEvent.keyDown(wrapper.baseElement, { code: 'Enter' });
    expect(_selectedOpts).toEqual([staticOptions[0].value]);
  });
});

describe('Select同步模式-多选', function () {
  test('渲染和点击', function () {
    let _selectedValues = null;
    let _curValue = null;
    let _selectedOpts = null;
    const wrapper = render(
      <Select
        multiple
        maxSize={2}
        options={staticOptions}
        onChange={(values) => (_selectedValues = values)}
        onSelect={(val, opts) => {
          _curValue = val;
          _selectedOpts = opts;
        }}
      />
    );
    const trigger = clickTrigger(wrapper);

    // 判断是否处于多选模式
    const tagsContainer = trigger.querySelector('.ebiz-select-trigger__tags');
    expect(tagsContainer !== null).toBe(true);
    const dropdown = wrapper.baseElement.querySelector('.multi-select-dropdown');
    expect(dropdown !== null).toBe(true);

    // 测试点击不关闭
    const options = dropdown.children;
    const option3 = options.item(2);
    fireEvent.click(option3);
    expect(_curValue).toBe(staticOptions[2].value);
    const option4 = options.item(3);
    fireEvent.click(option4);
    expect(_curValue).toBe(staticOptions[3].value);
    // 删除第一个多选项
    const deleteTag = tagsContainer.children.item(0);
    const closeBtn = deleteTag.querySelector('.zent-tag-close-btn');
    fireEvent.click(closeBtn);
    expect(_selectedValues).toEqual([staticOptions[3].value]);

    // 测试最大可选择
    const option5 = options.item(4);
    fireEvent.click(option5);
    expect(_selectedOpts.length).toBe(2);

    // 测试点击一个选项会被关闭
    wrapper.rerender(<Select multiple options={staticOptions} closeOnSelect />);
    const rerenderTriggerWrapper = wrapper.queryByTestId('select-trigger');
    testFocus(rerenderTriggerWrapper);
    expect(rerenderTriggerWrapper.querySelector('.ebiz-select-trigger__tags') !== null).toBe(true);
    const rerenderDropdown = wrapper.baseElement.querySelector('.multi-select-dropdown');
    expect(rerenderDropdown !== null).toBe(true);
    const rerenderOptions = rerenderDropdown.children;
    fireEvent.click(rerenderOptions.item(3));
    expect(wrapper.baseElement.querySelector('.multi-select-dropdown')).toBe(null);
  });
});

describe('兼容性测试', function () {
  test('tags属性', function () {
    const wrapper = render(<Select tags options={staticOptions} />);
    const trigger = clickTrigger(wrapper);
    // 判断是否处于多选模式
    const tagsContainer = trigger.querySelector('.ebiz-select-trigger__tags');
    expect(tagsContainer !== null).toBe(true);
    const dropdown = wrapper.baseElement.querySelector('.multi-select-dropdown');
    expect(dropdown !== null).toBe(true);
  });
  test('受控非受控模式兼容', function () {
    const wrapper = render(<Select value={[staticOptions[0].value]} options={staticOptions} />);
    const trigger = wrapper.queryByTestId('select-trigger');
    const selectInput = trigger.querySelector('.ebiz-select-trigger__input');
    expect(selectInput.value).toMatch(new RegExp(staticOptions[0].text));
  });
});
