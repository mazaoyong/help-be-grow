export interface IViewCellData {
  correctNum: number;
  errorNum: number;
  examRecordId: number;
  examTime: string;
  userInfo: IUserInfo;
}

export interface IUserInfo {
  anonymity: boolean;
  avatar: string;
  mobile: string;
  nickName: string;
  userId: number;
}

interface IPictureType {
  height: number;
  width: number;
  url: string;
}

interface IVideoType {
  categoryId: number;
  coverHeight: string;
  coverUrl: string;
  coverWidth: string;
  playedCount: number;
  videoDuration: number;
  videoId: number;
  videoName: string;
  videoPath: string;
  videoStatus: number;
  videoStatusDesc: string;
  videoUrl: string;
}

interface IMediaType {
  descUrl: string;
  height: number;
  mediaName: string;
  mediaSize: number;
  videoId: number;
  video: IVideoType;
  width: number;
}

export interface IQuestion {
  backgroundPic: IPictureType;
  description: string;
  examId: number;
  id: number;
  itemCount: number;
  itemList: any[];
  itemRowNum: number;
  kdtId: number;
  media: IMediaType;
  mediaType: number;
  nextQuestionMenuPic: IPictureType;
  parentQuestionId: number;
  questionType: number;
  scoreType: number;
  serialNo: number;
  style: number;
  totalScore: number;
}

export interface IAnswer {
  correctAnswerItemId: number[],
  questionId: number,
  result: number,
  userAnswerItemId: number[],
}

export interface IOption {
  detail: string;
  examId: number;
  id: number;
  itemPic: IPictureType;
  parentItemId: number;
  questionId: number;
  score: number;
  scoreType: number;
  serialNo: number;
  style: number;
  selected: boolean;
}

export interface IExamAnswerSheetProps {
  examDetail: IExamResult[];
  examRecord: IViewCellData;
  scrollToAnchor: Function;
}

export interface IExamHeaderProps {
  correctNum: number;
  errorNum: number;
}

export interface IOptionProps {
  questionType: number, // 1 单选 2 多选
  option: IOption,
  isCorrect: boolean,
  isSelected: boolean,
}

export interface IQuestionProps {
  id: number,
  question: IQuestion,
  answer: IAnswer,
}

export interface ITableProps {
  examId: string | number;
}

export interface IExamResult {
  questionId: number; // 问题id
  result: number; // 答题结果 0 用户未答题 1 正确 2 错误
  sort: number; // 题目序号
}
