/// <reference types="react" />
export declare type PopPosition = 'TopLeft' | 'TopCenter' | 'TopRight' | 'BottomLeft' | 'BottomCenter' | 'BottomRight' | 'LeftCenter' | 'RightCenter';
export interface IMouseFollowProps {
    popContent: JSX.Element;
    position: PopPosition;
    cushion?: {
        top?: number;
        left?: number;
    };
}
