export interface IEditorItemProps {
  // 子组件
  children: React.ReactNode;
  // 组件所在位置的下标
  index: number;
  // 是否可拖拽
  canDrag: boolean;
  // 是否可删除
  canDelete: boolean;
  // 删除组件的回调函数
  onDelete: (...args) => void;
  // 禁止拖拽的类名
  filterClass: string;
}

export interface IEditorItemState {
  overInput: boolean;
}

export interface IEditorCardAddProps {
  text?: React.ReactNode;
  onAdd?: (...args) => void;
  selfDefinedText?: boolean;
  filterClass?: string;
  disable?: boolean;
  disableText?: string;
}

export interface IEditorCardItemProps {
  // 子组件
  children: React.ReactNode;
  // 组件所在位置的下标
  index: number;
  // 是否可拖拽
  isDragable: boolean;
  // 是否可删除
  canDelete: boolean;
  // 是否为行内样式
  isInline: boolean;
  // 删除组件的回调函数
  onDelete: (...args) => void;
  // 拖拽时移动组件的回调函数
  onMove: (...args) => void;
  isDragging: boolean;
  connectDragSource: (...args) => React.ReactNode;
  connectDropTarget: (...args) => void;
}

type anyFunc = (...args) => any;

export interface IEditorCardProps {
  list: any[];
  onAdd?: anyFunc;
  onChange: anyFunc;
  canDrag: boolean | anyFunc;
  canDelete?: boolean | anyFunc;
  canAdd: boolean;
  isInline?: boolean;
  addText?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  selfDefinedText?: boolean;
  filterClass: string;
  disable?: boolean;
  disableText?: string;
}
