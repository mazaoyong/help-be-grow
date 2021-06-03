import { Pop, IPopProps } from '@zent/compat';
import React from 'react';
import { Button } from 'zent';
import cx from 'classnames';

import './styles.scss';

interface INoBalanceHintProps
  extends Omit<
  IPopProps,
  'trigger' | 'content' | 'onConfirm' | 'confirmText' | 'onCancel' | 'onCancel'
  > {
  hintContent: React.ReactNode;
  onConfirm?(): void;
  confirmText?: string;
  onCancel?(): void;
  cancelText?: string;
}

const NoBalanceHint: React.FC<INoBalanceHintProps> = (props) => {
  const {
    hintContent,
    children,
    className,
    onConfirm,
    confirmText,
    onCancel,
    cancelText,
    ...popProps
  } = props;
  const [visible, setVisible] = React.useState(false);

  const hasConfirm = React.useMemo(() => confirmText || onConfirm, [confirmText, onConfirm]);
  const hasCancel = React.useMemo(() => cancelText || onCancel, [cancelText, onCancel]);

  const handleToggleVisible = React.useCallback((method: any) => {
    setVisible(false);
    method && method();
  }, []);

  const PopContent = React.useMemo(() => {
    return (
      <div className="no-balance-hint__popContent">
        {hintContent}
        {(hasConfirm || hasCancel) && (
          <div className="no-balance-hint__footer">
            {hasCancel && (
              <Button onClick={() => handleToggleVisible(onCancel)}>{cancelText}</Button>
            )}
            {hasConfirm && (
              <Button type="primary" onClick={() => handleToggleVisible(onConfirm)}>
                {confirmText}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }, [
    cancelText,
    confirmText,
    handleToggleVisible,
    hasCancel,
    hasConfirm,
    hintContent,
    onCancel,
    onConfirm,
  ]);

  return (
    <Pop
      {...popProps}
      className={cx('no-balance-hint__content', className)}
      content={PopContent}
      trigger="hover"
      onVisibleChange={setVisible}
      visible={visible}
    >
      {children}
    </Pop>
  );
};

export default NoBalanceHint;
