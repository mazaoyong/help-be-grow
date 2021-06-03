import { ReactNode, CSSProperties, ReactInstance } from 'react';
export interface IopenDialogOptions<P> {
    data?: P;
    dialogId?: string;
    title?: ReactNode;
    closeBtn?: boolean;
    mask?: boolean;
    maskClosable?: boolean;
    parentComponent?: ReactInstance;
    className?: string;
    prefix?: string;
    style?: CSSProperties;
    submitEffect?: IDialogSubmitEffect;
}
export declare type IDialogSubmitEffect<T = any> = (data: T) => Promise<boolean>;
export interface IopenDialogRef<T> {
    afterClosed: () => Promise<T>;
    close: () => void;
}
/**
 * T - 返回值类型
 * P - 参数类型
 */
export interface IDialogChildrenProps<T, P> {
    data: P;
    dialogref: {
        submit: (data: T) => void;
        close: () => void;
    };
    loadingState: boolean;
}
