import React, { FC } from 'react';
import { Button } from 'zent';

type ClickType = () => void;

const Add: FC<{add: ClickType}> = props => (
  <div className="zent-form__control-group add-options">
    <label className="zent-form__control-label" />
    <div className="zent-form__controls">
      <Button
        outline
        type="primary"
        bordered={false}
        onClick={props.add}
        className="no-active"
      >
        +添加选项
        <span className="tips">（最多40个）</span>
      </Button>
    </div>
  </div>
);

export default Add;
