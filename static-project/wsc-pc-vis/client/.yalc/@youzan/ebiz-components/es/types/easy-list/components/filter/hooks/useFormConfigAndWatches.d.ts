export declare const useFormModelAndWatches: (config: import("../../../types/filter").FilterConfigType) => {
    models: import("formulr").FormBuilder<Record<string, import("formulr").FieldBuilder<import("../../../types/filter").IFilterModelUnion>>, import("formulr").BasicBuilder<any, import("formulr/lib/models/basic").BasicModel<any>>, import("formulr/lib/models/basic").BasicModel<any>>;
    watches: Record<string, [[import("../../../types/filter").WatchFunc, string]]>;
};
