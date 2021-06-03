import React from 'react';
import { ColorPicker, IColorPickerProps } from 'zent';
import { EasyFormFieldProps, IEasyFormExtendsColorPickerProps } from '../types';

const { ColorBoard } = ColorPicker;
type EasyFormColorPickerType = IColorPickerProps & IEasyFormExtendsColorPickerProps;
export const EasyFormColorPicker: React.FC<EasyFormFieldProps<EasyFormColorPickerType>> = (
  props
) => {
  const { value, onChange, displayType = 'simple', ...restProps } = props;

  const inheritProps = React.useMemo(
    () => ({
      value,
      onChange,
      ...restProps,
    }),
    [onChange, restProps, value]
  );
  if (displayType === 'board') return <ColorBoard {...inheritProps} />;
  return <ColorPicker {...inheritProps} />;
};
