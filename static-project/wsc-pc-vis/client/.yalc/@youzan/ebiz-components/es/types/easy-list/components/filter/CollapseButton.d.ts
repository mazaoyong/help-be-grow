import React from 'react';
import { ICollapseButtonRef } from '../../types/filter';
interface ICollapseButtonProps {
    labels?: [string, string];
    defaultValue: boolean;
    onChange(state: boolean): void;
}
export declare const CollapseButton: React.ForwardRefExoticComponent<ICollapseButtonProps & React.RefAttributes<ICollapseButtonRef>>;
export {};
