import React, {
  useMemo,
  useState,
  MouseEventHandler,
  ReactElement,
  MouseEvent
} from 'react';
import { Popover, Input, Icon } from 'zent';

import {
  ITimePickerProps,
  valueType,
  ITimePickerValue,
  timePickerType
} from './types';
import { formatType, formatValue, formatResult } from './format';
import TimePickerPanel from './TimePanel';
import { formatValueString, isEmpty } from './utils';

const { Content } = Popover as any;
const { AutoBottomLeft } = Popover.Position as any;

function TimePicker<T extends valueType>({
  name,
  type = 'HH:mm:ss',
  value,
  placeholder = '请选择',
  disabled = false,
  onChange,
  clearable = false,
  disabledTime,
  hideTime
}: ITimePickerProps<T>): ReactElement<ITimePickerProps<T>> {
  const [show, setShow] = useState(false);
  const [showClear, setShowClear] = useState(false);

  const pickerType = useMemo(() => formatType(type as timePickerType), [type]);
  const valueObj = useMemo(() => formatValue(value, pickerType), [
    value,
    type,
    pickerType
  ]);

  const formattedValue = useMemo(
    () => formatValueString(valueObj, pickerType),
    [valueObj, value, pickerType]
  );

  const togglePicker = () => {
    if (disabled) return;
    setShow(!show);
  };

  const onMouseEnter: MouseEventHandler = () => {
    clearable && setShowClear(true);
  };

  const onSubmit = (res: Required<ITimePickerValue>) => {
    setShow(false);
    onChange(formatResult(value, res, pickerType));
  };

  const onClear = (e: MouseEvent) => {
    onChange(
      formatResult(value, { hour: 0, minute: 0, second: 0 }, pickerType)
    );
    e.stopPropagation();
  };

  return (
    <div className="ebiz-time-picker">
      <Popover
        visible={show}
        onVisibleChange={togglePicker}
        cushion={5}
        position={AutoBottomLeft}
      >
        <Popover.Trigger.Click>
          <div
            className="ebiz-time-picker__trigger"
            onClick={() => {
              !disabled && setShow(!show);
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={() => setShowClear(false)}
          >
            <Input
              name={name}
              width="125px"
              value={formattedValue}
              onChange={() => {}}
              placeholder={placeholder}
              disabled={disabled}
            />
            {showClear && !isEmpty(valueObj) ? (
              <Icon type="close-circle" onClick={onClear} />
            ) : (
              <Icon type="clock-o" />
            )}
          </div>
        </Popover.Trigger.Click>
        <Content>
          <TimePickerPanel
            value={valueObj}
            type={pickerType}
            onSubmit={onSubmit}
            disabledTime={disabledTime}
            hideTime={hideTime}
          />
        </Content>
      </Popover>
    </div>
  );
}

export default TimePicker;
