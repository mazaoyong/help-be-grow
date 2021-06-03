import { ICheckboxProps, IRadioProps } from 'zent';

export type IIndicatrixType = 'radio' | 'checkbox';

export interface IBaseData<V> {
  text: React.ReactNode;
  helpIconPop?: React.ReactNode;
  value: V;
}

export interface IIndicatrixConfig<V, Type extends IIndicatrixType = IIndicatrixType> {
  label?: React.ReactNode;
  helpIconPop?: React.ReactNode;
  data: Array<IBaseData<V> & Partial<Type extends 'radio' ? IRadioProps<V> : ICheckboxProps<V>>>;
}
