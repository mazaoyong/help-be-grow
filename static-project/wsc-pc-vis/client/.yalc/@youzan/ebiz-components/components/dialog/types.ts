import { ReactNode, CSSProperties, ReactInstance } from 'react';

export interface IopenDialogOptions<P> {
  data?: P;
  dialogId?: string;
  title?: ReactNode; // 自定义弹框标题
  closeBtn?: boolean; // 是否显示右上角关闭按钮
  mask?: boolean; // 	是否显示遮罩
  maskClosable?: boolean; // 点击遮罩是否可以关闭
  parentComponent?: ReactInstance; // 可选，父组件的引用, 用于关联 context
  className?: string; // 自定义额外类名
  prefix?: string; // 自定义前缀
  style?: CSSProperties; // 自定义样式
  submitEffect?: IDialogSubmitEffect; // submit的副作用函数，触发submit之前会触发这个函数，可以返回Promise.resolve(false)阻断后续的submit
}

export type IDialogSubmitEffect<T = any> = (data: T) => Promise<boolean>;

export interface IopenDialogRef<T> {
  afterClosed: () => Promise<T>; // 关闭之后调用
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
