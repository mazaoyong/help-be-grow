import { CSSProperties } from 'react';
import { ActionEnums } from '../../types';
import { ISourceInfo } from '@ability-center/clue';
export interface IOperatorButtonsProps {
  className?: string;
  style?: CSSProperties;
  clueId?: number;
  studentId: number | string;
  studentNo: number | string;
  studentName: string;
  customerId: number;
  campusKdtId: number;
  campusName: string;
  sourceInfo: ISourceInfo | undefined;
  onActionCallback(action: ActionEnums): void;
}
