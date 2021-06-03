import isEqual from 'lodash/isEqual';

import { IOption } from '../types';

export function setSelectedFlag(
  options: IOption[],
  selectedOpts: IOption | IOption[] | undefined,
  keyboardSelect: number
) {
  if (keyboardSelect === -1 && selectedOpts === undefined) {
    return options;
  }

  return options.map((currentOpt, index) => {
    let isChecked = false;
    let isKeyboardChecked = false;
    // 如果是被键盘选中的
    if (keyboardSelect !== -1 && index === keyboardSelect) isKeyboardChecked = true;
    if (Array.isArray(selectedOpts)) {
      isChecked = getEqualOptionIndex(currentOpt, selectedOpts) > -1;
    } else if (selectedOpts !== undefined) {
      isChecked = isEqual(currentOpt.value, selectedOpts.value);
    }
    return Object.assign({}, currentOpt, { isChecked, isKeyboardChecked });
  });
}

export function getEqualOptionIndex(currentOpt: IOption, options: IOption[] | undefined): number {
  const currentValue = currentOpt.value;
  let equalOptionIndex = -1;
  if (options !== undefined) {
    equalOptionIndex = options.findIndex((opt) => isEqual(opt.value, currentValue));
  }

  return equalOptionIndex;
}

export function getNewSelectedOptions(
  deleteOption: IOption | undefined,
  selectedOpts: IOption | IOption[] | undefined
) {
  let newSelectOpts;
  if (Array.isArray(selectedOpts) && selectedOpts.length > 0) {
    newSelectOpts = selectedOpts;
    if (deleteOption !== undefined) {
      const deleteIndex = newSelectOpts.findIndex((opt) => isEqual(opt.value, deleteOption.value));
      if (deleteIndex > -1) {
        newSelectOpts = newSelectOpts
          .slice(0, deleteIndex)
          .concat(newSelectOpts.slice(deleteIndex + 1, newSelectOpts.length));
      }
    } else {
      newSelectOpts = selectedOpts.slice(0, selectedOpts.length - 1);
    }
  } else {
    newSelectOpts = undefined;
  }

  return newSelectOpts;
}
