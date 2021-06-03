import { Pop, IPopProps } from '@zent/compat';
import React, { FC } from 'react';
import { Button } from 'zent';

const { withPop } = Pop;

const ConfirmText: any = withPop(function(props) {
  const { onConfirm, onCancel, text, pop } = props;

  const closePop = (isConfirm: boolean) => {
    if (isConfirm) {
      onConfirm();
    } else {
      onCancel && onCancel();
    }
    pop.close();
  };

  return (
    <div>
      {text}
      <Button onClick={() => closePop(false)}>取消</Button>
      <Button type="primary" onClick={() => closePop(true)}>确定</Button>
    </div>
  );
} as any);

const ConfirmPop: FC<Omit<IPopProps, 'content'> & {
  onConfirm(): void;
  onCancel?: () => void;
  text: string;
}> = props => {
  const {
    children,
    text,
    onConfirm,
    onCancel,
    ...inheritProps } = props;

  return (
    <Pop
      trigger="click"
      content={<ConfirmText onConfirm={onConfirm} onCancel={onCancel} text={text} />}
      {...inheritProps}
    >{children}</Pop>
  );
};

export default ConfirmPop;
