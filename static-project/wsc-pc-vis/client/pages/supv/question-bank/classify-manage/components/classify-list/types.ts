import { ITreeData, PopPositions } from 'zent';

export enum IClassifyActions {
  addItem = 0,
  refactorItem,
  moveItem,
  deleteItem,
}

export interface IClassifyTreeItem extends ITreeData {
  title: string;
  id: number;
  parentId: number;
  /** 题目数量统计 */
  questionCount?: number;
  /** 指明有哪些操作 */
  operators?: IClassifyActions[];
  children: IClassifyTreeItem[];
  /** 深度指针[0, 1, 2] 表示list[0][1][2]的数据，可以根据这个数据非常方便的拿到父节点列表 */
  depPointer: number[];
}

export type IClassifyTree = IClassifyTreeItem[];

export type IModifyTreeDataParams = (
  modifiedValues: Record<string, any>,
  dep: IClassifyTreeItem['depPointer'],
) => void;

export type IDeleteTreeDataParams = (dep: IClassifyTreeItem['depPointer']) => void;

export interface IClassifyListProps {
  /** 可以在这里添加一个IClassifyTreeItem类型的数据来包裹后续数据 */
  defaultTreeNode?: IClassifyTreeItem;
  /** 是否显示未分类 */
  needSystemDefault?: boolean;
  /** 更新标识 */
  updateSignal?: number;
  /** 是否显示标题，默认不显示 */
  withHeader?: boolean;
  /** 是否显示操作，默认不显示 */
  showOperators?: boolean;
  /** 是否显示题目统计，默认显示 */
  showQuestionCount?: boolean;
  onDataChange?(categoryData: IClassifyTree): void;
  /** 点击某个分类的回调 */
  onClickItem?(targetId: number, targetTreeNode: IClassifyTreeItem): void;
  className?: string;
  /** 弹出的气泡的位置 */
  popPosition?: PopPositions;
  style?: React.CSSProperties;
  /** 剔除不显示的子节点 */
  omitChild?: IClassifyTreeItem['depPointer'];
}
