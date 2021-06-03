import { FieldArrayBuilder, FieldBuilder, FieldSetBuilder } from 'zent';
import { EasyFormConfigType, EasyFormStatusModelType } from '../types';
interface IGetFormBuilderConfig {
}
/**
 * 根据config构建form所需的form model
 */
export declare const getFormBuilder: (config: EasyFormConfigType[], _fieldConfig: IGetFormBuilderConfig) => {
    value: import("zent").FormBuilder<Record<string, FieldSetBuilder<any> | FieldArrayBuilder<any> | FieldBuilder<any>>, import("zent").BasicBuilder<any, import("formulr/lib/models/basic").BasicModel<any>>, import("formulr/lib/models/basic").BasicModel<any>>;
    status: import("zent").FormBuilder<Record<string, FieldSetBuilder<any> | FieldBuilder<any>>, import("zent").BasicBuilder<any, import("formulr/lib/models/basic").BasicModel<any>>, import("formulr/lib/models/basic").BasicModel<any>>;
};
export declare function initModelValue(config: EasyFormConfigType): any;
/** 需要包裹一下，防止invisible的model被校验 */
export declare function initValidators(validators: EasyFormConfigType['validators'], statusModel: EasyFormStatusModelType): ((value: any, ctx: any) => any)[];
export {};
