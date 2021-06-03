import React from 'react';
import { isElement } from 'react-is';
import { Pop, Sweetalert, IPopoverContext } from 'zent';
import cx from 'classnames';
import pick from 'lodash/pick';
import { ListContext } from '../../list';
import { IGridSweetAlert, IGridPop } from '../../../types/grid';

const { withPop } = Pop;

const popPassiveProps = [
  'trigger',
  'centerArrow',
  'cushion',
  'position',
  'type',
  'className',
  'onConfirm',
  'onCancel',
  'confirmText',
  'cancelText',
];

const sweetAlertPassiveProps = [
  'contnet',
  'type',
  'title',
  'onConfirm',
  'confirmText',
  'confirmType',
  'closeBtn',
  'maskCloseable',
  'className',
  'cancelText',
  'onCancel',
];

export const GridPop: React.FC<IGridPop> = (props) => {
  const {
    disabled,
    text,
    children,
    data,
    content,
    preventDefault = false,
    adjustPositionOnShow = false,
    ...otherProps
  } = props;
  const popRef = React.useRef<Pop | null>(null);
  const list = React.useContext(ListContext);

  const passiveProps = React.useMemo(() => pick(otherProps, popPassiveProps), [otherProps]);

  const popContent = React.useMemo(() => {
    if (content) return content;
    if (typeof children === 'function') {
      const Component = withPop(((popProps: any) => {
        const pop: IPopoverContext = popProps.pop;
        const childrenProps = {
          pop,
          list,
          data,
        };
        return children(childrenProps);
      }) as any);
      return <Component />;
    }
    return children;
  }, [children, content, data, list]);

  const disabledClassName = React.useMemo(() => (disabled ? 'operations-item__disabled' : ''), [
    disabled,
  ]);

  const handleAdjustPos = React.useCallback(() => {
    if (adjustPositionOnShow && popRef.current) popRef.current.adjustPosition();
  }, [adjustPositionOnShow]);

  const handlePreventDefault = React.useCallback(
    (evt: React.MouseEvent<HTMLAnchorElement>) => {
      if (preventDefault) {
        evt.stopPropagation();
        evt.preventDefault();
      }
    },
    [preventDefault]
  );

  const PopChild = React.useMemo(() => {
    if (typeof text === 'string' || isElement(text)) {
      return text;
    }
    return null;
  }, [text]);

  if (!PopChild) {
    return null;
  }

  return (
    <Pop
      {...passiveProps}
      ref={popRef}
      onShow={handleAdjustPos}
      content={<div className="pop-content">{popContent}</div>}
      position={passiveProps.position || 'auto-top-left'}
      className={cx(passiveProps.className, 'easy-grid__grid-pop')}
    >
      <a
        data-testid="easy-grid-gridPop"
        className={disabledClassName}
        onClick={handlePreventDefault}
      >
        {PopChild}
      </a>
    </Pop>
  );
};

export const GridSweetAlert: React.FC<IGridSweetAlert> = (props) => {
  const { text, data, sweetType, children, content, ...otherProps } = props;
  const list = React.useContext(ListContext);
  const passiveProps = React.useMemo(() => pick(otherProps, sweetAlertPassiveProps), [otherProps]);
  const dialogContent = React.useMemo(() => {
    if (content) return content;
    /* istanbul ignore next */
    if (typeof children === 'function') {
      return children({
        list,
        data,
      });
    }
    return children;
  }, [children, content, data, list]);

  const onClick = React.useCallback(() => {
    const openType = sweetType || 'confirm';

    Sweetalert[openType]({
      content: dialogContent,
      ...passiveProps,
    });
  }, [dialogContent, passiveProps, sweetType]);
  return (
    <a data-testid="easy-grid-sweetAlert" onClick={onClick} href="#">
      {text}
    </a>
  );
};
