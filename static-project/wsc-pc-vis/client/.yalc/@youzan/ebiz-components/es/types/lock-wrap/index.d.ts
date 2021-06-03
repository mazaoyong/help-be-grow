import { ReactElement } from 'react';
export { default as openLockDialog, onOpenLockDialogClick } from './dialog';
import './style.scss';
export declare enum LockType {
    PCT_GOODS = "PCT_GOODS",
    PCT_SHOP = "PCT_SHOP",
    COURSE_GOODS = "COURSE_GOODS",
    COURSE_SHOP = "COURSE_SHOP"
}
interface ILockButtonProps {
    children: ReactElement<any> | string;
    lockType: LockType;
    isLock: boolean;
    onClick?: (...args: any) => void;
    triggerName?: string;
    [key: string]: any;
}
export default function LockWrap(props: ILockButtonProps): JSX.Element;
