import { ModelOf, Ref, take } from '@youzan/tany-vue';
import { Toast } from 'vant';
import { OPEN_SHARE_POPUP } from '../events';
import { fetchAssignmentPoster } from 'domain/supv/homework/services/assignment';
import Assignment from 'domain/supv/homework/entities/Assignment';
import {
  getExposeAssignmentBlocks as detailToPoster,
  getExposeCorrectMediaBlocks as commentToPoster,
} from '@/vis-shared/utils/supv/homework/poster';
import OpenPoster from '@/vis-shared/components/standard-share/share-poster/main';
import { shareHomeworkLog } from '../../../log';

const SharePopupModel = (currentAssignment: Ref<Assignment>) => {
  take(OPEN_SHARE_POPUP, () => {
    shareHomeworkLog();
    OpenPoster({
      props: {
        getPoster,
      },
    });
  });

  const getPoster = () => {
    return fetchAssignmentPoster(
      currentAssignment.value as Assignment,
      detailToPoster(currentAssignment.value.detail as any || []),
      commentToPoster(currentAssignment.value.comment as any || []),
    )
      .then((url: string) => {
        if (url) {
          return url;
        } else {
          Toast('生成海报失败');
        }
      })
      .catch((errMsg: string) => {
        Toast(errMsg || '生成海报失败');
      })
      .finally(() => '');
  };

  return {};
};

export type SharePopupModelType = ModelOf<typeof SharePopupModel>;
export default SharePopupModel;
