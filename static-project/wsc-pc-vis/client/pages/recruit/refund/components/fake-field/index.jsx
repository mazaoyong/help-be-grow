import React from 'react';
import classnames from 'classnames';

export default function FakeField({ label, component: Comp, wrapClassName, ...restProps }) {
  const _className = classnames(['zent-form__control-group', wrapClassName]);
  return (
    <div className={_className}>
      <div className="zent-form__control-label">{label}</div>
      <div className="zent-form__controls">
        <Comp {...restProps} />
      </div>
    </div>
  );
}
