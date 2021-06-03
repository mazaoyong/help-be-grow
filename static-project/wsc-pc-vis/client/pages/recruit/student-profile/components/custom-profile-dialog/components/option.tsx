import React, { FC } from 'react';
import { Input, Button, IInputChangeEvent } from 'zent';
import cx from 'classnames';

import get from 'lodash/get';

interface IOptType {
  text?: string;
  value: any;
}

const Option: FC<{
  opt: IOptType;
  index: number;
  onChange: (evt: IInputChangeEvent) => void;
  minus: () => void;
  isError: boolean;
  errorMsg: string;
}> = props => {
  const { opt, isError, index, minus, onChange, errorMsg } = props;
  return (
    <div className={cx(
      'zent-form__control-group options',
      { 'has-error': isError, 'last-option': index === 19 }
    )}>
      <label className="zent-form__control-label">
        <em className="zent-form__required">*</em>
        {`选项${index + 1}：`}
      </label>
      <div className="zent-form__controls">
        <Input
          className="custom-opt"
          placeholder="最多20个字"
          defaultValue={get(opt, 'text')}
          data-index={index}
          onChange={onChange}
        />
        {index > 0 ? (
          <Button
            outline
            type="primary"
            bordered={false}
            onClick={minus}
            className="no-active"
          >
          删除
          </Button>
        ) : null}
        {isError ? (
          <p className="zent-form__error-desc">{errorMsg}</p>
        ) : null}
      </div>
    </div>
  );
};

export default Option;
