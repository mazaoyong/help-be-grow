import React from 'react';
import { Pop, Input, Icon, IGridColumnBodyRenderFunc, Button, Validators } from 'zent';
import cx from 'classnames';
import get from 'lodash/get';

import { IQuickEditConfig, IBodyRenderFunc } from '../../../types/grid';
import { useLayoutEffect } from '../../../../utils/use-ssr-hooks';

interface IPosType {
  row: number;
  column: number;
  fixed?: 'left' | 'right';
}

const QuickEditInput: React.FC<
  {
    cancelText: string;
    confirmText: string;
    onCancel(): void;
    onConfirm(val: any): void;
    accepter?(value: any): string;
    formatter?(value: string): any;
    error: string | undefined;
    confirmLoading: boolean;
    onValueChange(value: any): void;
  } & IQuickEditConfig
> = (props) => {
  const {
    type,
    error,
    onCancel,
    onConfirm,
    formatter,
    pressEnter,
    cancelText,
    confirmText,
    placeholder,
    onValueChange,
    confirmLoading,
    inputProps = {},
    defaultValue = '',
  } = props;
  const [text, setText] = React.useState(defaultValue);

  const handleConfirm = React.useCallback(() => {
    const TEXT = formatter ? formatter(text) : text;
    onConfirm(TEXT);
  }, [text, onConfirm, formatter]);
  const handlePressEnter = React.useCallback(() => (pressEnter ? handleConfirm : () => void 0), [
    pressEnter,
    handleConfirm,
  ]);
  const handleValueChange = React.useCallback(
    (evt) => {
      const value = evt.target.value;
      setText(value);
      onValueChange(value);
    },
    [onValueChange]
  );

  return (
    <div
      data-testid="easy-grid-quickEdit"
      className={cx('easy-grid__quickEdit-input', { 'has-error': Boolean(error) })}
    >
      <div className="line">
        <Input
          {...inputProps}
          autoFocus
          type={type}
          value={text}
          placeholder={placeholder}
          onPressEnter={handlePressEnter}
          onChange={handleValueChange}
        />
        <div className="easy-grid__quickEdit-actions">
          <Button
            outline
            onClick={handleConfirm}
            loading={confirmLoading}
            data-testid="easy-grid-quickEdit-confirm"
            className="easy-grid__quickEdit-action"
          >
            {confirmText}
          </Button>
          <span className="easy-grid__quickEdit-actions-split">|</span>
          <Button
            outline
            bordered={false}
            onClick={onCancel}
            disabled={confirmLoading}
            data-testid="easy-grid-quickEdit-cancel"
            className="easy-grid__quickEdit-action"
          >
            {cancelText}
          </Button>
        </div>
      </div>
      {Boolean(error) && <div className="error-message">{error}</div>}
    </div>
  );
};

const QuickEdit: React.FC<
  {
    data: any;
    name: string;
    NodeRender: IBodyRenderFunc | string;
    pos: IPosType;
  } & IQuickEditConfig
> = (props) => {
  const {
    pos,
    data,
    name,
    onCancel,
    required,
    onConfirm,
    NodeRender,
    validators,
    defaultValue,
    icon = 'edit-o',
  } = props;
  const [popVisible, setStatus] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const popRef = React.useRef<Pop | null>();

  const cls = React.useMemo(() => {
    if (popVisible) {
      return 'easy-grid__quickEdit-icon visible';
    }
    return 'easy-grid__quickEdit-icon';
  }, [popVisible]);

  const Node = React.useMemo(() => {
    if (typeof NodeRender === 'string') {
      return get(data, NodeRender);
    }
    return NodeRender(data, pos, name);
  }, [NodeRender, data, name, pos]);

  const INIT_VALUE = React.useMemo(() => {
    if (defaultValue) {
      /* istanbul ignore next */
      if (typeof defaultValue === 'function') {
        return defaultValue(data, name);
      }
      return defaultValue;
    }
    return get(data, name);
  }, [data, name, defaultValue]);

  const handleVisibleChange = React.useCallback((nextState?: boolean) => {
    setError('');
    setStatus((prevStatus) => (nextState !== undefined ? nextState : !prevStatus));
  }, []);

  const handleConfirm = React.useCallback(
    (value: number | string) => {
      const _validators = validators || [];
      if (required) {
        _validators.unshift(
          Validators.required(typeof required === 'string' ? required : '输入不能为空')
        );
      }
      if (_validators.length) {
        const isInvalidate = _validators.some((validator) => {
          const validateResult = validator(value, {} as any);
          if (validateResult) {
            setError(validateResult.message);
            return true;
          }
          return false;
        });
        if (isInvalidate) return;
      }
      new Promise<boolean>((resolve) => {
        if (onConfirm) {
          setConfirmLoading(true);
          const promiseCB = onConfirm(value, data);
          if (promiseCB && promiseCB instanceof Promise) {
            promiseCB.then(resolve);
            return;
          }
        }
        resolve(true);
      })
        .then((res) => {
          if (res) {
            handleVisibleChange(false);
          }
        })
        .finally(() => {
          setConfirmLoading(false);
        });
    },
    [data, handleVisibleChange, onConfirm, required, validators]
  );

  const passiveProps = React.useMemo(
    () => ({
      ...props,
      pressEnter: props.pressEnter || false,
      cancelText: props.cancelText || '取消',
      confirmText: props.confirmText || '确定',
      defaultValue: INIT_VALUE,
      onConfirm: handleConfirm,
      onCancel() {
        handleVisibleChange();
        onCancel && onCancel();
      },
    }),
    [INIT_VALUE, handleConfirm, handleVisibleChange, onCancel, props]
  );
  const handleValueChange = React.useCallback(() => setError(''), []);

  const CONTENT = React.useMemo<React.ReactNode>(
    () => (
      <QuickEditInput
        {...passiveProps}
        error={error}
        confirmLoading={confirmLoading}
        onValueChange={handleValueChange}
      />
    ),
    [passiveProps, confirmLoading, error, handleValueChange]
  );

  // 设置error之后重新设置pop的位置
  useLayoutEffect(() => {
    popRef.current && popRef.current.adjustPosition();
  }, [error]);

  return (
    <span className="easy-grid__quickEdit-container">
      {Node}
      <Pop
        trigger="click"
        visible={popVisible}
        ref={(pop) => (popRef.current = pop)}
        onVisibleChange={handleVisibleChange}
        content={CONTENT}
      >
        <Icon type={icon} className={cls} onClick={() => setStatus(true)} />
      </Pop>
    </span>
  );
};

function quickEdit(
  NodeRender: IBodyRenderFunc | string,
  quickEditOpts: IQuickEditConfig
): IGridColumnBodyRenderFunc<any> {
  return function QuickEditRender(data: any, pos: IPosType, name?: string) {
    let _name = name || '';
    if (typeof NodeRender === 'string') {
      _name = NodeRender;
    }
    return (
      <QuickEdit {...quickEditOpts} name={_name} data={data} pos={pos} NodeRender={NodeRender} />
    );
  };
}

export default quickEdit;
