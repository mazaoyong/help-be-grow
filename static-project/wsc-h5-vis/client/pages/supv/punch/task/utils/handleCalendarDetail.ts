import { CustomCommit } from '../store/mutations';

const handleCalendarDetail = {
  handleBoughtStatus: (commit: CustomCommit) => async (data: any) => {
    const { bought } = data;
    await commit('SET_BOUGHT_STATUS', bought);
    if (!bought) {
      return Promise.reject('未加入群打卡');
    }
    return data;
  },

  handleViewStatus: (commit: CustomCommit) => async (data: any) => {
    commit('SET_ALLOW_VIEW', data.allowStudentView === 1 || false);
    return data;
  },

  handleEditStatus: (commit: CustomCommit) => async (data: any) => {
    commit('SET_ALLOW_EDIT', data.allowStudentEdit === 1 || false);
    return data;
  },

  handleCalendarData: (commit: CustomCommit) => async (data: any) => {
    const { startAt, endAt, taskCalenders } = data;
    await commit('SET_CALENDAR', {
      hasInit: true,
      startDate: startAt,
      endDate: endAt, // 截止时间为当前时间，会默认在向后延续一周
      taskState: getTaskStateAndColorPlan(taskCalenders),
    });
    return data;
  },

  handleUserInfo: (commit: CustomCommit) => async (data: any) => {
    const { avatar } = data;
    await commit('SET_USER', { avatar });
    return data;
  },
};

enum TaskStatus {
  NOT_AVAILABLE = 0,
  NOT_CLOCK_IN,
  CLOCK_IN,
  ADD_CLOCK_IN
}
interface TaskDTO {
  customerTaskStatus: TaskStatus;
  taskDate: string;
}

const colorPlan: Record<
TaskStatus,
{
  state: string;
  style?: { color?: string; backgroundColor?: string; border?: string };
}
> = {
  [TaskStatus.NOT_AVAILABLE]: {
    state: 'NOT_AVAILABLE',
  },
  [TaskStatus.NOT_CLOCK_IN]: {
    state: 'NOT_CLOCK_IN',
    style: {
      color: '#fff',
      backgroundColor: '#999999',
      border: '1px solid #999999',
    },
  },
  [TaskStatus.CLOCK_IN]: {
    state: 'CLOCK_IN',
    style: {
      color: '#fff',
      backgroundColor: '#00B389',
      border: '1px solid #00b389',
    },
  },
  [TaskStatus.ADD_CLOCK_IN]: {
    state: 'ADD_CLOCK_IN',
    style: {
      color: '#fff',
      backgroundColor: '#FFBB17',
      border: '1px solid #FFBB17',
    },
  },
};

function getTaskStateAndColorPlan(taskCalenders: TaskDTO[]): Record<string, any> {
  const result: Record<string, any> = {};
  taskCalenders.map(task => {
    const taskDate = task.taskDate;
    if (task.customerTaskStatus >= 0) {
      result[taskDate] = colorPlan[task.customerTaskStatus];
    }
  });

  return result;
}

export default handleCalendarDetail;
