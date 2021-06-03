import {
  ICustomProfileProps,
  ApplicableSceneEnums,
  DataType,
} from '../../../pages/student/student-detail/components/modify-student/types';

export { ApplicableSceneEnums, DataType };
export type IPartialCustomProfile = Omit<ICustomProfileProps, 'updateSignal' | 'refreshSignal' | 'onSubmit'>;
