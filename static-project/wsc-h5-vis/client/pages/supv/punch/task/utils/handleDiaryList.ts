import { CustomCommit } from '../store/mutations';
import { initialState } from '../store/state';

type DiaryListType = Array<ReturnType<typeof getFormattedDiaryData>>;
const handleDiaryList = {
  increasePage: (commit: CustomCommit) => async (data: any): Promise<any> => {
    const { total, pageable = {} } = data;
    const { pageNumber = 1 } = pageable;
    const payload = {
      page: pageNumber + 1,
      total,
    };

    await commit('SET_PAGE_INFO', payload);
    return data;
  },

  dataAdaptor: () => async (data: any): Promise<DiaryListType | undefined> => {
    const { content: contentList } = data;
    if (Array.isArray(contentList) && contentList.length) {
      const payload: DiaryListType = [];
      contentList.forEach(diaryContent => {
        const formattedDiaryContent = getFormattedDiaryData(diaryContent);
        payload.push(formattedDiaryContent);
      });
      return payload;
    }
    return undefined;
  },

  setDiaryList: (commit: CustomCommit) => async (
    payload: DiaryListType
  ): Promise<undefined> => {
    await commit('SET_HAS_DIARY', true);
    await commit('SET_DIARY_LIST', payload);
    return undefined;
  },

  updateDiaryList: (commit: CustomCommit) => async (
    payload: DiaryListType
  ): Promise<undefined> => {
    await commit('UPDATE_DIARY_LIST', payload);
    return undefined;
  },

  resetDiaryList: (commit: CustomCommit) => async (): Promise<undefined> => {
    await commit('SET_HAS_DIARY', false);
    await commit('SET_DIARY_LIST', initialState.diaryList);
    return undefined;
  },
};

export function getFormattedDiaryData(diaryContent: any) {
  const userData = getUserData(diaryContent);
  const contentData = getContentData(diaryContent);
  const commentData = getCommentData(diaryContent);

  return {
    id: diaryContent.id,
    gciId: diaryContent.gciId,
    userData,
    contentData,
    commentData,
  };
}

interface IUserData {
  nickname: string;
  avatar: string;
  clockInTimes: number; // 打卡次数
  fansId: number;
  fansType: number;
}
function getUserData(data: any): IUserData {
  const { avatar, nickname, cumulativeCount, fansId, fansType } = data;
  return {
    avatar,
    nickname,
    clockInTimes: cumulativeCount,
    fansId,
    fansType,
  };
}

interface IContentData {
  showDayClockIn: boolean; // 是否展示日签
  isHandPicker: boolean; // 是否是精选打卡
  plainText?: string;
  images?: string[]; // imageData[]
  video?: string[]; // videoData[]
  audio?: string[]; // audioData[]
  createdAt: string;
}
function getContentData(data: any): IContentData {
  const {
    selection,
    content,
    createTime,
    videos,
    audios,
    images,
  } = data;

  return {
    showDayClockIn: false, // 日签暂时不做
    isHandPicker: selection === 1,
    plainText: content,
    images,
    video: videos,
    audio: audios,
    createdAt: createTime,
  };
}

export interface ILikeStrut {
  nickname: string;
  fansId: number;
  fansType: number;
}
export interface ICommentStrut {
  publisher: string;
  publisherId: number;
  commentId: number;
  content: string;
  receiver?: string;
  receiverId?: number;
  type: 'student' | 'teacher';
}
interface ICommentData {
  hasLike: boolean;
  like: Array<ILikeStrut>;
  commentNumber: number;
  commentList: Array<ICommentStrut>;
}
export function getCommentData(data: any): ICommentData {
  const { praise, praises, stuComments, teacherComments } = data;

  const { content: praiseList, total: praiseNumber = 0 } = praises || {} as any;
  const hasLike = praise === 1;
  const like: ILikeStrut[] = getFormattedLikeList(praiseNumber > 0, praiseList);

  const commentList: ICommentStrut[] = [];
  const { content: studentCommentContents, total: studentTotalComments = 0 } =
    stuComments || {} as any;
  const { content: teacherCommentContents, total: teacherTotalComments = 0 } =
    teacherComments || {} as any;
  const hasTeacherComments = teacherTotalComments > 0;
  const hasStudentComments = studentTotalComments > 0;
  const hasComment = hasStudentComments || hasTeacherComments;
  if (hasComment) {
    if (hasTeacherComments) {
      (teacherCommentContents as any[]).forEach((comment = {}) => {
        if (comment.commentId) {
          commentList.push({
            commentId: comment.commentId,
            publisher: comment.nickname || '老师点评',
            publisherId: comment.fansId || 0,
            content: comment.comment || '',
            type: 'teacher',
          });
        }
      });
    }

    if (hasStudentComments) {
      (studentCommentContents as any[]).forEach((comment = {}) => {
        if (comment.commentId) {
          commentList.push({
            commentId: comment.commentId,
            publisher: comment.nickname || '',
            publisherId: comment.fansId || 0,
            receiver: comment.parentNickname || '',
            receiverId: comment.parentFansId || 0,
            content: comment.comment || '',
            type: 'student',
          });
        }
      });
    }
  }

  return {
    hasLike,
    like,
    commentList,
    commentNumber: studentTotalComments,
  };
}

export function getFormattedLikeList(
  hasLike: boolean,
  target: any[]
): ILikeStrut[] {
  const like: ILikeStrut[] = [];
  if (hasLike) {
    target.forEach(likeItem => {
      const temp: ILikeStrut = likeItem;
      temp.nickname = likeItem.nickName;
      like.push(temp);
    });
  }
  return like;
}

export default handleDiaryList;
