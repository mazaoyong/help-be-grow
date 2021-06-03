import React, { PureComponent } from 'react';
import { PopPosition } from './types';
interface IPopProps {
    top: number;
    left: number;
    position: PopPosition;
    cushion?: {
        top?: number;
        left?: number;
    };
}
export default class Pop extends PureComponent<IPopProps, {}> {
    private readonly el;
    private dom;
    componentDidMount(): void;
    componentWillUnmount(): void;
    get childrenStyle(): {
        width: number;
        height: number;
    };
    get style(): string;
    render(): React.ReactPortal;
}
export {};
