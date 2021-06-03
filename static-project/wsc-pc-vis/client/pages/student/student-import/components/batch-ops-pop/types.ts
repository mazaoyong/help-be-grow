import { IEbizSelectProps } from '@youzan/ebiz-components/es/types/select';

interface IOption {
  text: string;
  value: string | number;
}

export interface IOptionBaseProps {
  trigger?: 'hover' | 'click' | 'focus';
  opmode: 'select' | 'date' | 'input' | 'numberinput' | 'ebizSelect' | 'custom';
  className?: string;
  defaultValue?: string;
  placeholder?: string;
  showBottomActions?: boolean;
  onConfirm?: () => any;
  onCancel?: () => any;
  children: React.ReactElement;
}

export interface IOptionSelectProps extends IOptionBaseProps {
  opmode: 'select';
  selectOptions?: IOption[];
}

export interface IOptionInputProps extends IOptionBaseProps {
  opmode: 'input';
}

export interface IOptionNumberInputProps extends IOptionBaseProps {
  opmode: 'numberinput';
  decimal?: number;
  min?: number;
  max?: number;
}

export interface IOptionDateProps extends IOptionBaseProps {
  opmode: 'date';
  date?: Date | number;
}

export interface IOptionCustomProps extends IOptionBaseProps {
  opmode: 'custom';
  component?: React.ComponentClass<any> | React.FC<any>;
}

export interface IOptionEbizSelectProps extends IOptionBaseProps {
  opmode: 'ebizSelect';
  selectProps: IEbizSelectProps;
}

export type IOptionProps = IOptionBaseProps
| IOptionSelectProps
| IOptionInputProps
| IOptionNumberInputProps
| IOptionDateProps
| IOptionEbizSelectProps
| IOptionCustomProps;
