import { ReactNode } from 'react';
import { ITreeData } from 'zent';

export interface IBaseTreeProps {
  maxLevel?: number;
  treeData: ITreeData[];
  itemClassName?: string;
  getOperations?: (data: ITreeData, treeData: ITreeData[]) => any;
  hasOperation?: boolean;
  onSelect: (treeNode: ITreeData) => void;
  loadMore: (data: ITreeData) => Promise<any>;
  currentSelect: number | null;
  onRename?: (data: ITreeData) => void
  setTreeData: (treeData: ITreeData[]) => void;
  emitter: any;
  maxDirNameLength? : number;
}

export interface IDirectoryTreeProps {
  maxLevel?: number;
  currentDirectoryId?: number;
  itemClassName?: string;
  onDirectorySelect: (data: ITreeData) => void;
  getOperations?: (data: ITreeData, treeData: ITreeData[]) => any;
  hasOperation?: boolean;
  enableType: 'leaf' | 'branch' | 'none'; // 叶节点还是枝节点可选
  showRoot?: boolean; // 是否展示根节点
  onRename?: (data: ITreeData) => void
  columnAlias: string;
  showUnClassify?: boolean;
  afterTreeRender? : () => void;
  emptyText?: ReactNode;
  maxDirNameLength? : number;
}

export interface INodeItemProps {
  data: ITreeData;
  treeData: ITreeData[];
  getOperations?: (data: ITreeData, treeData: ITreeData[]) => any;
  hasOperation?: boolean;
  itemClassName?: string;
  isSelect?: boolean;
  onRename?: (data: ITreeData) => void;
  setTreeData: (treeData: ITreeData[]) => void;
  emitter: any;
  maxDirNameLength? : number;
}
