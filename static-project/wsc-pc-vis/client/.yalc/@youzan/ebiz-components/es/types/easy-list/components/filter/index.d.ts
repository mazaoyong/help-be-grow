import React from 'react';
import { IFilterProps, ReservedType } from '../../types/filter';
export declare const ReservedCompReflect: Record<Exclude<ReservedType, 'Custom'>, React.ComponentType<any>>;
declare const FilterWithRef: React.ForwardRefExoticComponent<IFilterProps & React.RefAttributes<import("../../types/filter").IRenderPropsType>>;
export default FilterWithRef;
