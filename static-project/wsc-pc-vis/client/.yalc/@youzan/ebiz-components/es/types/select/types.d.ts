import React from 'react';
declare type FilterFunc = (keyword: string, option: IOption) => boolean;
declare type Mode = 'async' | 'sync';
interface IEbizSelectBaseProps {
    mode?: Mode;
    value?: any | any[];
    multiple?: boolean;
    tags?: boolean;
    offset?: number;
    onOpen?(): void;
    onClose?(): void;
    disabled?: boolean;
    noData?: React.ReactNode;
    placeholder?: string;
    defaultValue?: any[];
    width?: number | string;
    maxSize?: number | string;
    prefixOption?: React.ReactNode;
    suffixOption?: React.ReactNode;
    defaultOptions?: IOption[];
    filter?: boolean | FilterFunc;
    onSelect?(value: any, items: IOption[] | undefined): void;
    onChange?(values: any[], selectedItems: IOption[] | undefined): void;
    clearable?: boolean;
    closeOnSelect?: boolean;
    noAnimate?: boolean;
    noKeyboardHandle?: boolean;
    className?: string;
    dropdownClassName?: string;
    displayNum?: number;
    onKeywordChange?(keyword: string): any;
}
export interface IOption {
    text: string;
    value: any;
    extra?: React.ReactNode;
    disabled?: boolean;
    isGroup?: boolean;
}
export interface IEbizSelectSyncProps extends IEbizSelectBaseProps {
    mode?: 'sync';
    options: IOption[];
}
export interface IPageRequest {
    current: number;
    pageSize?: number;
    total: number;
}
export declare type FetchOptionsRes = Promise<{
    options: IOption[];
    pageInfo: IPageRequest;
}>;
interface IDebounceConfig {
    leading?: boolean;
    trailing?: boolean;
    wait?: number;
}
export interface IEbizSelectAsyncProps extends IEbizSelectBaseProps {
    mode: 'async';
    onAdd?(): void;
    showAdd?: boolean;
    onRefresh?(): void;
    showRefresh?: boolean;
    fetchOnOpened?: boolean;
    fetchOnMounted?: boolean;
    debounceConf?: IDebounceConfig;
    fetchOptions(filterKeyword: string, pageRequest: IPageRequest): FetchOptionsRes;
}
export declare type IEbizSelectProps = IEbizSelectSyncProps | IEbizSelectAsyncProps;
interface IEbizSelectTriggerBaseProps {
    mode: Mode;
    width: string;
    tags: boolean;
    keyword: string | undefined;
    visible: boolean;
    clearable: boolean;
    disabled?: boolean;
    displayNum: number;
    placeholder?: string;
    value: any[] | undefined;
    filter: boolean | FilterFunc;
    handleFocus(visibility: true): void;
    selectedOpts: IEbizSelectSyncProps['options'] | undefined;
    handleDeleteOption(option?: IOption, reset?: boolean): void;
    handleKeywordChange(value: string): void;
}
export interface IEbizSelectAsyncTriggerProps extends IEbizSelectTriggerBaseProps {
    mode: 'async';
    debounceConf?: IDebounceConfig;
    fetchNow?(reset?: boolean, keyword?: string): void;
}
export interface IEbizSelectSyncTriggerProps extends IEbizSelectTriggerBaseProps {
    mode: 'sync';
}
export declare type IEbizSelectTriggerProps = IEbizSelectSyncTriggerProps | IEbizSelectAsyncTriggerProps;
export interface IEbizSelectDropDownProps {
    mode: Mode;
    width: string;
    tags: boolean;
    offset?: string;
    keyword: string | undefined;
    visible: boolean;
    loading: boolean;
    className?: string;
    noData?: React.ReactNode;
    onScrollBottom(): void;
    prefixOption?: React.ReactNode;
    suffixOption?: React.ReactNode;
    filter: boolean | FilterFunc;
    handleSelect(option: IOption): void;
    options: IEbizSelectSyncProps['options'] | undefined;
    selectedOpts: IEbizSelectSyncProps['options'] | undefined;
    noKeyboardHandle: boolean;
}
export interface IOptionProps extends IOption {
    tags: boolean;
    keyword?: string;
    isChecked?: boolean;
    isKeyboardChecked?: boolean;
    handleClick?(option: IOption): void;
}
export interface IUseRemoteOptionsSettings extends IEbizSelectBaseProps {
    /**
     * 是否在过滤的时候开启缓存，一般要根据fetchOnOpened属性来判断，
     * 如果开启了上述功能，就不需要缓存了
     */
    useFilterCache: boolean;
    fetchOptions(filterKeyword: string, pageRequest: IPageRequest): FetchOptionsRes;
}
export interface IUseRemoteOptionsRes {
    loading: boolean;
    fetchNow?(reset?: boolean, keyword?: string): void;
    remoteOptions: IOption[];
    setOptionCache(cleanPrevCache: boolean): void;
}
export interface IEbizTagListProps {
    disabled: boolean;
    options?: IOption[];
    displayNum: number;
    className?: string;
    handleClose(option: IOption): void;
}
export {};
