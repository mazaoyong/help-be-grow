import { ZentForm } from 'zent/es/form/ZentForm';
import { EasyFormConfigType, EasyFormModelType, GroupEasyFormModel, NormalEasyFormModel } from '../types';
interface IUseEasyFormWatchesParams {
    config: EasyFormConfigType[];
    formInstance: ZentForm<Record<string, EasyFormModelType>>;
    formStatusInstance: ZentForm<Record<string, NormalEasyFormModel | GroupEasyFormModel>>;
}
interface IUseEasyFormWatchesRes {
    handleValueChange(key: string, value: any): void;
}
declare type UseEasyFormWatches = (params: IUseEasyFormWatchesParams) => IUseEasyFormWatchesRes;
export declare const useFormWatches: UseEasyFormWatches;
export {};
