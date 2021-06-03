import React from 'react';
import { IEbizSelectDropDownProps, IOption } from '../types';
interface ISyncExtendsProps {
    options: IOption[];
    tags: boolean;
}
declare const SyncDropDown: React.ForwardRefExoticComponent<Partial<IEbizSelectDropDownProps> & ISyncExtendsProps & React.RefAttributes<HTMLUListElement>>;
export default SyncDropDown;
