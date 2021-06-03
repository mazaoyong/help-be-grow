import React, { ReactElement, cloneElement } from 'react';
import openLockDialog from './dialog';
export { default as openLockDialog, onOpenLockDialogClick } from './dialog';
import './style.scss'

export enum LockType {
  PCT_GOODS = 'PCT_GOODS',
  PCT_SHOP = 'PCT_SHOP',
  COURSE_GOODS = 'COURSE_GOODS',
  COURSE_SHOP = 'COURSE_SHOP',
}

interface ILockButtonProps {
  children: ReactElement<any> | string;
  lockType: LockType,
  isLock: boolean;
  onClick?: (...args: any) => void;
  triggerName?: string;
  [key: string]: any;
}

interface ILockButtonProps2 {
  lockType: LockType,
  isLock: boolean;
  onClick?: (...args: any) => void;
  triggerName?: string;
  [key: string]: any;
}

interface ILockButtonProps3 {
  onClick?: (...args: any) => void;
  [key: string]: any;
}

export default function LockWrap(props: ILockButtonProps) {
  const { children, ...restProps } = props;
  const modifedProps = modifyProps(restProps);
  if (typeof children === 'string' || Array.isArray(children)) {
    return <span {...modifedProps}>{children}</span>;
  }
  return cloneElement(children, modifedProps);
}

function modifyProps(props: ILockButtonProps2): ILockButtonProps3 {
  const { [props.triggerName || 'onClick']: rawTrigger, isLock, lockType, triggerName, ...restProps } = props;
  const trigger = isLock ? openLockDialog(lockType) : rawTrigger;
  return { [triggerName || 'onClick']: trigger, ...restProps };
}