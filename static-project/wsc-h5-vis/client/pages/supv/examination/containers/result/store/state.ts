import { ExamResultStatus, ExamStatus } from 'supv/examination/types';

export interface ResultState {
  examStatus: ExamStatus;
  status: ExamResultStatus;
  studentName: string;
  studentScore: number;
  completedTime: number; // 学员考试结束时间戳
  showAnswerCard: boolean; // 是否展示答题卡
  showMpQrcode: boolean; // 是否展示关注公众号弹窗
  canReexam: boolean; // 可以重考
  reexamLeftSeconds: number; // 重考间隔剩余时间
  canJoinExam: boolean; // 可以参加考试，需要检查门槛
  qrcode: string; // 公众号二维码
  publishStatus: 1 | 2; // 1 已发布 2 未发布
  reexamStudentId: number; // 重考使用的学员id
}

const state: ResultState = {
  examStatus: ExamStatus.STARTED,
  status: ExamResultStatus.REVIEWING,
  studentName: '',
  studentScore: 0,
  completedTime: 0,
  showAnswerCard: false,
  showMpQrcode: false,
  canReexam: false,
  reexamLeftSeconds: 0,
  canJoinExam: false,
  qrcode: '',
  publishStatus: 2,
  reexamStudentId: 0,
};

export default state;
