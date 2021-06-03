import React from 'react';
import isNil from 'lodash/isNil';
import { IEasyGridSelection } from '../../../types/grid';

type GetRadioPropsType = Required<IEasyGridSelection>['getCheckboxProps'];
interface IEasyGridRadioSelectCtx {
  selected: any | undefined;
  setSelect(index: number, row: any): void;
  getRadioProps: GetRadioPropsType;
}
export const RadioContext = React.createContext<IEasyGridRadioSelectCtx>({
  selected: undefined,
  setSelect() {},
  getRadioProps() {
    return {};
  },
});
RadioContext.displayName = 'EasyGridRadioContext';
interface IRadioContextProps {
  getRadioProps: GetRadioPropsType;
  handleSelect: IEasyGridSelection['onSelect'];
  selectedRowKey?: any;
}
export const RadioContextProvider: React.FC<IRadioContextProps> = (props) => {
  const { selectedRowKey, handleSelect, getRadioProps } = props;
  const [selected, setSelected] = React.useState(selectedRowKey);
  const setSelect = React.useCallback(
    (rowKey: any, row: any) => {
      // 处理onSelect返回布尔值的情况
      const handleSelectSideEffectRes = handleSelect && handleSelect([rowKey], [row], row);
      if (!isNil(handleSelectSideEffectRes) && !handleSelectSideEffectRes) return;
      setSelected(rowKey);
    },
    [handleSelect]
  );
  return (
    <RadioContext.Provider value={{ selected, setSelect, getRadioProps }}>
      {props.children}
    </RadioContext.Provider>
  );
};
