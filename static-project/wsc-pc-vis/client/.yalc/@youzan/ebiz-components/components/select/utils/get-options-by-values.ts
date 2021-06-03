import { IOption } from '../types';

import isEqual from 'lodash/isEqual';

export function getOptionsByValues(
  values: any[] | undefined,
  options: IOption[] | undefined
): IOption[] {
  const selectedOptions: IOption[] = [];
  if (values && options && options.length > 0) {
    values.forEach(currentValue => {
      const indexedOption = options.find(currentOption =>
        isEqual(currentOption.value, currentValue)
      );
      indexedOption && selectedOptions.push(indexedOption);
    });
  }
  return selectedOptions;
}
