import { FieldBuilder } from 'zent';
import { IFilterProps, IStatusType, IFilterModelUnion } from '../../../types/filter';
export default function getModelFromConf(conf: IFilterProps['config']): import("zent").FormBuilder<Record<string, FieldBuilder<IFilterModelUnion>>, import("zent").BasicBuilder<any, import("formulr/lib/models/basic").BasicModel<any>>, import("formulr/lib/models/basic").BasicModel<any>>;
interface IResponse {
    values: Record<string, any>;
    status: Record<string, IStatusType>;
    props: Record<string, any>;
}
export declare function splitValuesFromModel(models: Record<string, IFilterModelUnion>, updateStatus?: Record<string, Omit<IFilterModelUnion, 'fieldValue'>>): IResponse;
export {};
