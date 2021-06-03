import React from 'react';
import { IEbizSelectDropDownProps, IOption } from '../types';
interface IASyncExtendsProps {
    tags: boolean;
    loading: boolean;
    options: IOption[];
    onScrollBottom(): void;
}
declare const AsyncDropDown: React.ForwardRefExoticComponent<Partial<IEbizSelectDropDownProps> & IASyncExtendsProps & React.RefAttributes<HTMLUListElement>>;
export default AsyncDropDown;
