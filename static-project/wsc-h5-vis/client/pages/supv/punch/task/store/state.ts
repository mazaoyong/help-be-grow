import { cloneDeep } from 'lodash';
import { format, isAfter, isBefore } from 'date-fns';
import Args from '@youzan/utils/url/args';
import { ProceedStatusEnum } from '../utils/getButtonSetting';

export enum Role {
  TEACHER = 1,
  STUDENT,
}

export interface IStoreState extends Record<string, any> {
  alias: string;
  bought: boolean;
  allowStudentView: boolean;
  allowStudentEdit: boolean;
  user: {
    avatar: string;
    role?: Role;
  },
  calendar: Partial<{
    hasInit: boolean;
    startDate: Date | string | number;
    endDate: Date | string | number;
    taskState: Record<string, any>;
    chooseDate: string;
  }>;
  buttonSetting: Record<string, any>;
  taskContent: Array<any>;
  task: {
    taskStatus: ProceedStatusEnum;
    hasTask?: boolean;
    taskContent?: Partial<{
      config: Record<string, any>;
      richText: Record<string, any>;
      audio: Record<string, any>;
      video: Record<string, any>;
      empty: boolean;
      collapse: boolean;
    }>;
    config?: Partial<{
      gciId: number;
      taskId: number;
      gciName: string;
      taskName: string;
      isCompleted: boolean;
      clockInTimes: number;
      fansId: number,
      fansType: number,
    }>;
  };
  pageInfo: {
    prePage?: number;
    page: number;
    size?: number;
    total?: number;
  };
  hasDiary: boolean;
  fetchDiary: boolean;
  myDiary: Record<string, any>;
  diaryList: any[];
}

const now = format(new Date(), 'YYYY-MM-DD');
const currentDate = Args.get('current_date') || now;
const formattedCurrentDate = format(currentDate, 'YYYY-MM-DD 00:00:00');
const startDate = Args.get('start_date');
const endDate = Args.get('end_date');
let defaultChooseDate = currentDate;
let formattedDate = '';
if (startDate) {
  formattedDate = format(startDate, 'YYYY-MM-DD 00:00:00');
  defaultChooseDate = isBefore(formattedCurrentDate, formattedDate) ? startDate : currentDate;
}
if (endDate) {
  formattedDate = format(endDate, 'YYYY-MM-DD 00:00:00');
  defaultChooseDate = isAfter(formattedCurrentDate, formattedDate) ? endDate : currentDate;
}

export const initialState: IStoreState = {
  alias: Args.get('alias'),
  bought: false,
  allowStudentView: false, // 是否允许学员在没打卡的情况下查看打卡列表
  allowStudentEdit: false,
  calendar: {
    hasInit: false, // 打卡任务列表初始化完成之后才会触发calendar的渲染
    startDate,
    endDate,
    taskState: {},
    chooseDate: defaultChooseDate,
  },
  user: {
    avatar: '',
    role: Role.STUDENT,
  },
  buttonSetting: {
    primaryText: '',
    secondaryText: '',
    buttonScheme: {},
    showButton: false,
    canPunch: false,
  },
  taskContent: [],
  task: {
    taskStatus: ProceedStatusEnum.PENDING,
    hasTask: false,
    taskContent: {
      richText: undefined,
      audio: undefined,
      video: undefined,
      empty: true,
      collapse: false,
    },
    config: {
      taskId: undefined,
      isCompleted: false,
      clockInTimes: 0,
    },
  },
  pageInfo: {
    prePage: -1,
    page: 1,
    size: 10,
    total: -1,
  },
  hasDiary: false,
  fetchDiary: false,
  myDiary: {},
  diaryList: [],
};

const state: IStoreState = cloneDeep(initialState);

export default state;
