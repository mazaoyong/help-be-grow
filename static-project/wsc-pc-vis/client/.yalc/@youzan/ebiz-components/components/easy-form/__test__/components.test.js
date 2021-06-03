import React from 'react';
import { render, cleanup, act } from '@testing-library/react';
import EasyForm from '../index';

/**
 * @description 单测使用react-testing-library，具体doc查看如下链接
 * @see https://testing-library.com/docs/react-testing-library/api#render-result 方法合集
 * @see https://testing-library.com/docs/dom-testing-library/api-queries dom查询合集
 */

afterEach(cleanup);

const { EasyFormRenderer } = EasyForm;
const inputLikeConfigs = [
  {
    name: 'test$$input',
    type: 'Input',
    label: '文本',
    inheritProps: {
      placeholder: '文本组件的placeholder',
    },
  },
  {
    name: 'test$$numberInput',
    type: 'NumberInput',
    label: '数字输入',
    defaultValue: 1.2,
    inheritProps: {
      integer: true,
    },
  },
];
const selectLikeConfigs = [
  {
    name: 'test$$checkbox',
    label: '多选项',
    type: 'Checkbox',
    options: [
      { text: '多选项1', value: 1 },
      { text: '多选项2', value: 2 },
      { text: '多选项3', value: 3 },
    ],
  },
  {
    name: 'test$$radio',
    label: '单选项',
    type: 'Radio',
    options: [
      { text: '多选项4', value: 4 },
      { text: '多选项5', value: 5 },
    ],
  },
  {
    name: 'test$$select',
    label: '选择组件',
    type: 'Select',
    options: [
      { text: '多选项6', value: 6 },
      { text: '多选项7', value: 7 },
    ],
  },
];
describe('EasyForm组件渲染', () => {
  test('渲染文本框组件', async () => {
    const form = render(<EasyFormRenderer config={inputLikeConfigs} />);
    const inputEle = (await form.findByTestId('easy-form-field-test$$input')).querySelector(
      'input'
    );
    expect(inputEle.getAttribute('placeholder')).toEqual('文本组件的placeholder');
    const numberInputEle = (
      await form.findByTestId('easy-form-field-test$$numberInput')
    ).querySelector('input');
    expect(Number(numberInputEle.value)).toEqual(1);
  });

  test('测试选择类型组件', async () => {
    const form = render(<EasyFormRenderer config={selectLikeConfigs} />);
    const checkboxEle = (await form.findByTestId('easy-form-field-test$$checkbox'));
    console.log(checkboxEle);
  });
});
