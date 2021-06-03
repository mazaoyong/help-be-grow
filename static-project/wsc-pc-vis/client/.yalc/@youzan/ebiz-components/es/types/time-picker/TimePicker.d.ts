import { ReactElement } from 'react';
import { ITimePickerProps, valueType } from './types';
declare function TimePicker<T extends valueType>({ name, type, value, placeholder, disabled, onChange, clearable, disabledTime, hideTime }: ITimePickerProps<T>): ReactElement<ITimePickerProps<T>>;
export default TimePicker;
