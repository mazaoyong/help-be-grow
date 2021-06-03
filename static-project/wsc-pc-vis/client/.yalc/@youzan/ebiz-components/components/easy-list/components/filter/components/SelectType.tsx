import React from 'react';
import { Select, ISelectProps } from 'zent';
import { ISelectControlType, IOption } from '../../../types/filter';

type SelectChangeHandler = Required<ISelectProps>['onChange'];
const SelectType: React.FC<ISelectControlType> = (props) => {
  const { value, onChange, options, ...passiveProps } = props;
  const [internalOpts, setOpts] = React.useState<IOption[]>([]);

  const handleChange = React.useCallback<SelectChangeHandler>(
    (evt) => {
      onChange && onChange(evt.target.value);
    },
    [onChange]
  );

  React.useEffect(() => {
    if (Array.isArray(options)) {
      setOpts(options);
      return;
    } else if (typeof options === 'function') {
      const res = options();
      if (res instanceof Promise) {
        res.then((opts) => {
          setOpts(!Array.isArray(opts) ? [] : opts);
        });
        return;
      }
    }
    throw new Error(
      'type of options should be array-type or should return a Promise-like, please check config where you use "Select" configuration'
    );
  }, [options]);

  return <Select {...passiveProps} data={internalOpts} value={value} onChange={handleChange} />;
};

export default SelectType;
