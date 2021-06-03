import { IClassifyTreeItem } from '@ability-center/supv/question-bank';

export interface IMoveClassifyProps {
  /** 是否显示副标题 */
  showSubtitle?: boolean;
  // 当前选中的子节点数据
  selectedTreeNode?: IClassifyTreeItem;
  // 深度信息，用于标记移除这个层级的数据
  depPointer?: IClassifyTreeItem['depPointer'];
  // 选中了目标节点后触发
  onSelect?(targetId: number, rowData?: IClassifyTreeItem): void;
  needSystemDefault?: boolean;
}

export interface IMoveClassifyData {
  targetParentId: number;
  targetId: number;
  rowData?: IClassifyTreeItem;
}

export interface IRichTextJSON {
  origin: string;
  parsed: IParagraph[];
}

export type IParagraph = {
  type: string;
  attr?: string;
  text: string;
  nodes: IParagraph[];
  src?: string;
  size?: { w: string; h: string };
};
