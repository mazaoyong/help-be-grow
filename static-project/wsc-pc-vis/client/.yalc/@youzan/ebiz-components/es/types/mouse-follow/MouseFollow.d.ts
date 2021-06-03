import { Component, MouseEventHandler } from 'react';
import { IMouseFollowProps } from './types';
interface IMouseFollowState {
    showPop: boolean;
    top: number;
    left: number;
}
export default class MouseFollow extends Component<IMouseFollowProps, IMouseFollowState> {
    state: {
        showPop: boolean;
        top: number;
        left: number;
    };
    onMouseEnter: MouseEventHandler;
    onMouseLeave: MouseEventHandler;
    onMouseMove: MouseEventHandler;
    render(): JSX.Element;
}
export {};
