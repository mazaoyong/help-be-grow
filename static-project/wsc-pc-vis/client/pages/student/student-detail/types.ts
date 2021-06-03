import { CSSProperties } from 'react';
import { ITabsProps } from 'zent';
import { ICluePhaseProps } from '@ability-center/clue';

export interface IStudentDetailRouteParams {
  studentId: string;
}

export type IContractInfoStruct = Record<string, any>[];

export enum ActionEnums {
  APPOINTMENT = 0, // 预约上课
  ENROLLMENT,
  COMMENT,
  MODIFY,
  TRANSFORM,
  MODIFY_SOURCE,
  DELETE,
  CLUE_TAGS,
  CLUE_PHASE,
  MODIFY_CLUE_RECORDS,
}

export interface ITabsContainerProps {
  className?: string;
  style?: CSSProperties;
  type?: ITabsProps<string>['type'];
  studentNo: string;
  studentId: string;
  studentName: string;
  studentPhone: string;
  campusKdtId: number;
  campusName: string;
  updatingSignal: {
    studentCard?: number;
    signedCourse?: number;
    trailCourse?: number;
    classSchedule?: number;
    studyRecords?: number;
    commentRecords?: number;
    clueModifyRecords?: number;
  };
  onActionCallback(action: ActionEnums): void;
  clueInfo: ICluePhaseProps;
}
