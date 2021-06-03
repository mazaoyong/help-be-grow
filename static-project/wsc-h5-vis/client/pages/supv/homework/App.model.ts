import HomeworkStudent from '@/domain/student-domain/entities/homeworkStudent';
import { hookOf, ref } from '@youzan/tany-vue';

import { getThemeColor } from '@youzan/vue-theme-plugin';
import Track from 'common/directives/track/core';

import trackConfigs from './track-list';

const AppModel = () => {
  const mainColor: string = getThemeColor('main');

  const currentStudentInfo = ref<HomeworkStudent | undefined>();
  const setCurrentStudentInfo = (newStudent: HomeworkStudent | undefined) => {
    currentStudentInfo.value = newStudent;
  };

  const track = new Track({
    configs: trackConfigs,
    logClient: window.yzlogInstance,
  });

  return {
    mainColor,
    currentStudentInfo,
    setCurrentStudentInfo,
    track,
  };
};

export const useAppModel = hookOf(AppModel);
export default AppModel;
