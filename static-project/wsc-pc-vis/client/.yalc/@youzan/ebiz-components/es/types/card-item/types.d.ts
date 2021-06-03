import { ReactNode } from 'react';
import { ICardListProps } from '../card-list';
export declare type RowData = Record<string, any>;
declare type RenderFunc<Value = any> = (rowData: Value & RowData) => ReactNode;
declare type GenericFunc<Value = any> = (rowData: Value & RowData) => any;
export interface IContentUnit {
    label: string;
    name: string;
    render?(data: any): ReactNode;
}
export interface IOperatorUnit<Value> {
    label: string;
    callback: GenericFunc<Value>;
}
export interface ICardRenderProps<Value = any> {
    title?: string;
    subtitle?: string;
    contentGroup?: IContentUnit[][];
    operators?: ReactNode | IOperatorUnit<Value> | IOperatorUnit<Value>[];
    renderTitle?: RenderFunc<Value>;
    renderSubtitle?: RenderFunc<Value>;
    renderContent?: RenderFunc<Value>;
    renderOperators?: RenderFunc<Value>;
    headerSplitRatio?: number;
    border?: boolean;
}
interface IExtendsProps {
    rowData: RowData;
    colorSchema?: ICardListProps['colorSchema'];
    className?: ICardListProps['className'];
    headerClassName?: ICardListProps['headerClassName'];
    contentClassName?: ICardListProps['contentClassName'];
}
export declare type CardItemPropsType = IExtendsProps & ICardRenderProps;
export interface ICardContentProps {
    rowData: RowData;
    className: string;
    contentGroup: ICardRenderProps['contentGroup'];
    renderContent: ICardRenderProps['renderContent'];
    colorSchema: Pick<IColorSchema, 'contentColor' | 'descriptionColor'>;
}
export interface IColorSchema {
    primaryColor?: string;
    secondaryColor?: string;
    interactionColor?: string;
    descriptionColor?: string;
    contentColor?: string;
}
export interface ICardHeaderProps {
    title: ReactNode;
    subtitle: ReactNode;
    headerClassName: string;
    colorSchema: Pick<IColorSchema, 'primaryColor' | 'secondaryColor'>;
    operators: ReactNode;
    ratio?: number;
}
export declare function isOperatorUnits(operators: ICardHeaderProps['operators']): operators is IOperatorUnit<any>[];
export {};
