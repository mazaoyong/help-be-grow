import { ICombinedFilterConf, INeedOptionsConfType, IFilterActionsAdaptor } from '../../types/filter';
export declare function needOptions(conf: ICombinedFilterConf): conf is INeedOptionsConfType;
export declare const ERROR_HINTS: {
    NOT_CUSTOM_TYPE: string;
    NOT_VALID_ELEMENT: string;
};
export declare const adaptorConstructor: IFilterActionsAdaptor;
