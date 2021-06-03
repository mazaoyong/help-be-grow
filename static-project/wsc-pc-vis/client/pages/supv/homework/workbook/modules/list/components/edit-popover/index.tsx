import React, { useState } from 'react';
import { Pop } from '@zent/compat';
import { Icon, Button, NumberInput } from 'zent';
import './style.scss';

interface IEditPopover {
  value: number | null;
  unit: string,
  onOpen: Function;
  onOk: Function;
  onHide: Function;
}

function EditPopover(props: IEditPopover) {
  let { onOpen, onOk, value, onHide, unit } = props;
  const [count, setCount] = useState(value);
  const [visible, setVisible] = useState(false);
  const [errorText, setErrorText] = useState('');

  const Content = (
    <>
      <div className="edit-form__wrap">
        送
        <NumberInput
          value={count}
          min={0}
          showStepper
          integer
          className="edit-form-number-field"
          onChange={val => setCount(val)}
        />
        <span className="edit-form-number-unit">{unit}</span>
        <div className="btn-wrap">
          <Button size="small" onClick={() => setVisible(false)}>
            取消
          </Button>
          <Button
            size="small"
            type="primary"
            onClick={() => {
              onOk(count).then(({ result, errorText = '' }) => {
                result ? setVisible(false) : setErrorText(errorText);
              });
            }}
          >
            保存
          </Button>
        </div>
      </div>
      {errorText && <p className="edit-form-number-error__text">{errorText}</p>}
    </>
  );
  return (
    <Pop
      trigger="click"
      position="bottom-center"
      content={Content}
      centerArrow
      onBeforeShow={() => {
        setErrorText('');
        setCount(value);
      }}
      cushion={-10}
      onClose={() => onHide()}
      visible={visible}
      onVisibleChange={status => setVisible(status)}
    >
      <div className="icon-edit__wrap">
        <Icon type="edit-o" className="shortcut-icon edit-o icon-edit" onClick={() => onOpen()} />
      </div>
    </Pop>
  );
}

export default EditPopover;
