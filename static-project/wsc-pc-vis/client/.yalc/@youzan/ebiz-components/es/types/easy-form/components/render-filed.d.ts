import React from 'react';
import { ZentForm } from 'zent/es/form/ZentForm';
import { EasyFormConfigType, EasyFormModelType, EasyFormStatusModelType } from '../types';
interface IEasyFormFieldRendererProps {
    addColon: boolean;
    config: EasyFormConfigType;
    valueForm: ZentForm<Record<string, EasyFormModelType>>;
    statusForm: ZentForm<Record<string, EasyFormStatusModelType>>;
    onChange(key: string, value: any): void;
}
export declare const RenderField: React.FC<IEasyFormFieldRendererProps>;
export {};
