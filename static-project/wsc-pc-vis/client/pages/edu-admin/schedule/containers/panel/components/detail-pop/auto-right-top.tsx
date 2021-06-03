import { Popover } from '@zent/compat';
import getViewportSize from 'fns/dom/get-viewport-size';

const { create, LeftBottom, RightBottom, LeftTop, RightTop } = Popover.Position as any;

interface IPosition {
  getCSSStyle: () => React.CSSProperties;
  name: string;
}

const positionMap = {
  LeftBottom,
  RightBottom,
  LeftTop,
  RightTop,
};

type PositionFunction = (
  anchorBoundingBox: ClientRect, // 相对于 container 左上角的坐标
  containerBoundingBox: ClientRect,
  contentDimension: { width: number; height: number }, // 是弹层的宽高
  options: {
    cushion: number; // Props 上传进来的定位偏移量
    anchor: HTMLElement; //  anchor 的 DOM 节点
    container: HTMLElement; //  container 的 DOM 节点
    anchorBoundingBoxViewport: any; //  anchor 相对于 viewport 的坐标
    containerBoundingBoxViewport: any; // container 相对于 viewport 的坐标
  },
) => IPosition;

const locate: PositionFunction = (
  anchorBoundingBox,
  containerBoundingBox,
  contentDimension,
  options,
) => {
  const viewport = getViewportSize();
  const { anchorBoundingBoxViewport, cushion } = options;
  let horizontal;
  let vertical;

  // 只有当右边放不下，并且左边能够放下的时候才移动到左边，210 是页面帮助的宽度
  if (anchorBoundingBoxViewport.right + contentDimension.width + 210 > viewport.width) {
    horizontal = 'Left';
  } else {
    horizontal = 'Right';
  }

  // 只有当下面放不下，并且上面能够放下时才移动到上面
  if (
    anchorBoundingBox.height > contentDimension.height ||
    anchorBoundingBoxViewport.top + cushion + contentDimension.height < viewport.height
  ) {
    vertical = 'Top';
  } else {
    vertical = 'Bottom';
  }

  const key = `${horizontal}${vertical}`;

  return positionMap[key].locate(
    anchorBoundingBox,
    containerBoundingBox,
    contentDimension,
    options,
  );
};

export default create(locate);
