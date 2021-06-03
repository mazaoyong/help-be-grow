import { Component, CSSProperties } from 'react';
import { IIconProps } from './types';
export default class Icon extends Component<IIconProps, {}> {
    static defaultProps: Partial<IIconProps>;
    get xlinkHref(): string;
    get className(): string;
    get style(): CSSProperties;
    render(): JSX.Element;
}
