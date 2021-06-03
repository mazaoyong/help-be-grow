import React from 'react';
import cx from 'classnames';
import { Radio, IRadioGroupProps } from 'zent';
import { IRadioControlType } from '../../../types/filter';

const RadioGroup = Radio.Group;

const RadioType: React.FC<IRadioControlType> = (props) => {
  const {
    value,
    onChange,
    options,
    className,
    disabled: parentDisabledType,
    readOnly: parentReadOnlyType,
    ...passiveProps
  } = props;
  const isMultiLineRadio = React.useMemo(
    () => options.some((opt) => (opt.desc || opt.description) !== undefined),
    [options]
  );

  const handleChange: IRadioGroupProps<string>['onChange'] = React.useCallback(
    (evt) => {
      if (onChange) {
        onChange(evt.target.value);
      }
    },
    [onChange]
  );

  if (!options || !options.length) {
    return null;
  }
  return (
    <RadioGroup
      {...passiveProps}
      value={value}
      onChange={handleChange}
      disabled={parentDisabledType}
      readOnly={parentReadOnlyType}
      className={cx('easy-filter__field radio-group', className, {
        'multi-line': isMultiLineRadio,
      })}
    >
      {options.map((opt) => {
        const description = opt.desc || opt.description;
        return (
          <div key={opt.value} className="radio-item__container">
            <Radio
              value={opt.value}
              readOnly={parentReadOnlyType || opt.readOnly || false}
              disabled={parentDisabledType || opt.disabled || false}
            >
              {opt.text}
            </Radio>
            {description ? <p className="radio-item__description">{description}</p> : null}
          </div>
        );
      })}
    </RadioGroup>
  );
};

export default RadioType;
