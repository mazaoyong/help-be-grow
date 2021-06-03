import { CSSProperties, PureComponent, MouseEvent } from 'react';
import './style.scss';
export interface ImgWrapProps {
    src: string;
    alt?: string;
    width: string;
    height: string;
    backgroundColor?: string;
    cover?: boolean;
    prefix?: string;
    fullfill: string;
    watermark?: string;
    disableFullfill?: boolean;
    onClick?: (e: MouseEvent<HTMLImageElement>) => void;
}
export default class ImgWrap extends PureComponent<ImgWrapProps, {}> {
    static readonly defaultProps: Partial<ImgWrapProps>;
    get wrapStyle(): CSSProperties;
    get imgStype(): CSSProperties;
    get src(): string;
    render(): JSX.Element;
}
