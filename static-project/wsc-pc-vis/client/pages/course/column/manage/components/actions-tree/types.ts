import { ReactNode } from 'react';

export interface IActionTreeProps {
  maxLevel?: number;
  enableType: 'leaf' | 'branch' | 'none'; // 叶节点还是枝节点可选
  columnAlias: string;
  afterTreeRender?: () => void;
  emptyText?: ReactNode;
}
