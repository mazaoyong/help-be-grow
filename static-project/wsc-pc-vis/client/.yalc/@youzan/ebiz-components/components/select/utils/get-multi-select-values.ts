import { getEqualOptionIndex } from './handle-select-options';
import { IOption } from '../types';

export default function getMultiSelectValues(
  selectedOpts: IOption | IOption[] | undefined,
  option: IOption
): IOption[] {
  let currentSelectedOpts;
  const selectedList = selectedOpts as IOption[] | undefined;
  if (selectedList !== undefined) {
    currentSelectedOpts = selectedList;
    const equalOptionIndex = getEqualOptionIndex(option, currentSelectedOpts);

    if (equalOptionIndex === -1) {
      currentSelectedOpts = currentSelectedOpts.concat(option);
    } else {
      currentSelectedOpts = currentSelectedOpts.filter(
        (_opt, selectIndex) => selectIndex !== equalOptionIndex
      );
    }
  } else {
    /* istanbul ignore next */
    currentSelectedOpts = [option];
  }

  return currentSelectedOpts;
}
