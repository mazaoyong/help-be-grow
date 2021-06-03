export type PopPosition =
  | 'TopLeft'
  | 'TopCenter'
  | 'TopRight'
  | 'BottomLeft'
  | 'BottomCenter'
  | 'BottomRight'
  | 'LeftCenter'
  | 'RightCenter';

export interface IMouseFollowProps {
  popContent: JSX.Element;
  position: PopPosition;
  cushion?: {
    // 定位的偏移量
    top?: number;
    left?: number;
  };
}
