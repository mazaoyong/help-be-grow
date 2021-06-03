import { ITreeData } from 'zent';

export interface IEditDirDialogProps {
  currentDir?: ITreeData;
  onCorfirm?: () => void;
  type: 'create' | 'update';
  level?: 'parentNode' | 'subNode',
  columnAlias: string;
  onCancel?: () => void;
}

export interface IEditDirFormProps extends IEditDirDialogProps {
  onCancel: () => void;
}
