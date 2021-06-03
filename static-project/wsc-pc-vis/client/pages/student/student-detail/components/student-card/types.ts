import { ReactNode, CSSProperties } from 'react';
import { ApplicableSceneEnums } from '@ability-center/student';

type DataItem = Record<string, any>;
export type formatFunc = (rowData: DataItem) => { label?: string; content: ReactNode };
interface IBaseStudentCardProps {
  studentNo: string | number;
  studentId?: string | number;
  clueId?: string | number; // 线索Id，可以不传，但是在线索页面可以使用这个做个修改
  showCollapse?: boolean;
  prefixContent?: DataItem[]; // 在content前面的数据，参与content的渲染
  decorateData?(rawData: DataItem[]): ({ attributeTitle: string; value: any } & DataItem)[];
  // 装饰数据，在渲染内容前会调用这个函数，可以在这里对渲染内容进行操作
  format?: formatFunc; // 格式化函数，用于格式化展示字段
  displayLimitation?: number; // 限制展示字段的数量[=5]
  triggerCollapse?(isCollapse: boolean): void; // 点击查看更多的回调函数
  onStudentInfoChange?(rawData: DataItem): void; // 当学员信息改变（获取到学员信息）
  updatingSignal?: number;
  fetchOnMounted?: boolean;
  children?(rawData: DataItem): ReactNode;
  applicableScene?: ApplicableSceneEnums;
}

export type IStudentCardProps = IBaseStudentCardProps;

export enum GenderEnums {
  UNKNOWN = 0,
  MALE,
  FEMALE,
}

export interface IStudentBaseInfo {
  studentAvatar?: string;
  studentName: string;
  studentPhone: string;
  studentGender: GenderEnums;
}
export interface IDividerProps {
  type?: 'solid' | 'dash' | 'dots';
  textAlign?: 'left' | 'right' | 'center';
  content?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export type IStudentHeaderProps = IStudentBaseInfo;
