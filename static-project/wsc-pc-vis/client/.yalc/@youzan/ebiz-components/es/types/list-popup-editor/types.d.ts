import { Component, FunctionComponent, ReactElement } from 'react';
export declare enum ListPopupEditorType {
    STR = "STR",
    NUM = "NUM",
    CUSTOM = "CUSTOM"
}
export interface IListPopupEditorProps {
    type: ListPopupEditorType;
    children: ReactElement;
    width?: string | number;
    initialValue: any;
    validate: (value: any) => string;
    onSubmit: <T>(data: T) => void | Promise<T>;
    popupEl?: ReactElement;
    samName?: string;
}
export interface IListPopupEditorContentProps {
    pop: {
        open: () => void;
        close: () => void;
    };
    value: any;
    width?: number | string;
    validate: (value: any) => string;
    onChange: (data: any) => void;
    onSubmit: (callback: () => void) => () => void;
    onCancel: (callback: () => void) => () => void;
}
export declare type IListPopupEditorContent = FunctionComponent<IListPopupEditorContentProps> | Component<IListPopupEditorContentProps>;
