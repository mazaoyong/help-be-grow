import { EasyFormConfigType, EasyFormConfigLabel } from '../types';
interface IUseFormConfigProps {
    config: EasyFormConfigType[];
    overrideConfigs: any;
}
export declare const useFormConfigs: (params: IUseFormConfigProps) => {
    valueBuilder: import("formulr").FormBuilder<Record<string, import("formulr").FieldSetBuilder<any> | import("formulr").FieldArrayBuilder<any> | import("formulr").FieldBuilder<any>>, import("formulr").BasicBuilder<any, import("formulr/lib/models/basic").BasicModel<any>>, import("formulr/lib/models/basic").BasicModel<any>>;
    statusBuilder: import("formulr").FormBuilder<Record<string, import("formulr").FieldSetBuilder<any> | import("formulr").FieldBuilder<any>>, import("formulr").BasicBuilder<any, import("formulr/lib/models/basic").BasicModel<any>>, import("formulr/lib/models/basic").BasicModel<any>>;
    decoratedConfigs: EasyFormConfigType[];
    formConfigs: EasyFormConfigType[];
};
interface IDecoratedLabelProps {
    fieldName?: string;
    addColon?: boolean;
    filedIndex?: number;
}
export declare function getDecoratedLabel(label: EasyFormConfigLabel | undefined, params: IDecoratedLabelProps): string | undefined;
export {};
