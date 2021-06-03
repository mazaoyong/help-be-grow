import { ITreeData } from 'zent';

export interface IMoveDirProps {
  enableType: 'leaf' | 'branch' | 'none'; // 叶节点可选还是枝节点可选
  onConfirm: (node: ITreeData) => Promise<any>;
  columnAlias: string;
  showUnClassify?: boolean;
  onCancel?: () => void;
}

export interface IMoveDirContentProps extends IMoveDirProps {
  onClose: () => void;
}
