import { FieldModel } from 'zent';
export declare type NoticeFuncType = (curValue: any, nextValue: any) => void;
export declare function updateModel(valueModel: FieldModel<any>, statusModel: FieldModel<any>, payload: any, notice: NoticeFuncType): void;
