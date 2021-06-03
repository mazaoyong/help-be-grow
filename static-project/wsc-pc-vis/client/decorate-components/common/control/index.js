import React from 'react';
import { Checkbox, Radio } from 'zent';
import ControlGroup from '../control-group';
import RadioButton from '../radio-button';

const nodeMap = {
  Checkbox,
  Radio,
  RadioButton,
};

export default props => {
  const {
    component = 'RadioButton',
    name,
    options = [],
    valueMap = {},
    value,
    onChange,
    componentProps = {},
    children,
    showHoverTip = true,
    ...restProps
  } = props;
  const NodeName = typeof component === 'string' ? nodeMap[component] : component;
  // 没有类型，或类型没有 Group，或者没有 options 可选项，则直接返回 null
  if (!NodeName || !NodeName.Group || !options || options.length === 0) {
    return null;
  }
  // 默认 RadioButton 开启 hoverTip
  const hoverTip = showHoverTip && component === 'RadioButton';

  return (
    <ControlGroup value={valueMap[value]} {...restProps}>
      <NodeName.Group value={value} onChange={onChange} {...componentProps}>
        {options.map(({ key, ...rest }, index) => {
          let prevValue = key || rest.value;
          if (prevValue == null) prevValue = index;
          return (
            <NodeName
              key={prevValue}
              tip={hoverTip && rest.icon ? valueMap[rest.value] : ''}
              name={name}
              {...rest}
            />
          );
        })}
      </NodeName.Group>
      {children}
    </ControlGroup>
  );
};
