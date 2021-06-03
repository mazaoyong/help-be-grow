import React from 'react';
import { IEasyGridSelection, IEasyGridProps } from '../../../types/grid';

type SelectConfigResType = IEasyGridSelection | null;
const defaultSelectConfig: IEasyGridSelection = { selectType: 'multiple' };
function getInitSelectConfig(selection: IEasyGridProps['selection']): SelectConfigResType {
  if (typeof selection === 'boolean' && selection === true) return defaultSelectConfig;
  else if (typeof selection === 'string') {
    return { selectType: selection || 'multiple' };
  } else if (typeof selection === 'object') {
    return {
      selectType: 'multiple',
      ...selection,
    };
  }
  return null;
}
export const useSelectConfig = (params: IEasyGridProps['selection']): SelectConfigResType => {
  const selectConfig = React.useMemo(() => getInitSelectConfig(params), [params]);
  return selectConfig;
};
