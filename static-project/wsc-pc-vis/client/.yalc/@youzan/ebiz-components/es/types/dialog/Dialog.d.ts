import { ComponentType, FC } from 'react';
import { IopenDialogOptions, IDialogChildrenProps, IopenDialogRef } from './types';
/**
 * 打开 dialog 弹窗
 *
 * @param Child - 要打开弹窗组件
 * @param options - 参数
 */
export declare function openDialog<T, P = any>(Child: ComponentType<IDialogChildrenProps<T, P>>, options?: IopenDialogOptions<P>): IopenDialogRef<T>;
export declare const DialogBody: FC<{}>;
export declare const DialogFooter: FC<{}>;
