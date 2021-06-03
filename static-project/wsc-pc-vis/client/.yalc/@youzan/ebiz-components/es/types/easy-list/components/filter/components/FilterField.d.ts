import React from 'react';
import { ZentForm } from 'zent/es/form/ZentForm';
import { FieldModel } from 'formulr';
import { ICombinedFilterConf, IFilterModelUnion } from '../../../types/filter';
interface IFilterFieldProps extends Record<string, any> {
    conf: ICombinedFilterConf;
    form: ZentForm<Record<string, FieldModel<IFilterModelUnion>>>;
    WrappedComp: React.ComponentType<any>;
    onValueChange(value: any, name: string): void;
}
declare const FilterField: React.FC<IFilterFieldProps>;
export default FilterField;
