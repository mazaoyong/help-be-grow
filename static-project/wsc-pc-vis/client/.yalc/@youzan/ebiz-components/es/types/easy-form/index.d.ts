import React from 'react';
import { IEasyFormInstance, IEasyFormProps } from './types';
import './styles.scss';
declare const EasyForm: {
    EasyFormRenderer: React.ForwardRefExoticComponent<IEasyFormProps & React.RefAttributes<IEasyFormInstance>>;
    list: (listConfig: import("./types").IListEasyFormConfigs) => import("./types").EasyFormConfigType;
    group: (groupConfig: import("./types").IGroupEasyFormConfigs) => import("./types").EasyFormConfigType;
};
export default EasyForm;
export * from './types';
