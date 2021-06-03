import { hookOf, ref } from '@youzan/tany-vue';
import { useRouter, listRoute } from '../../router';

import WorkbookService from '@/domain/workbook-domain/services';
import { IExerciseInfoCollectDTO } from 'definitions/api/owl/api/UserExerciseFacade/getUserExercise';
// @ts-ignore
import { openStudentChoosePopup } from '../../components/student-choose-popup/index.vue';

import { Toast } from 'vant';

function WorkbookModuleModel() {
  document.title = '我的作业';

  const { route } = useRouter();
  const kdtId = route.value.query.kdt_id;
  window._global.kdt_id = Number(kdtId);
  const alias = route.value.query.alias;
  const isShare = route.value.query.isShare;
  const homeworkAlias = route.value.query.homeworkAlias;

  const isEmpty = ref(false);
  const title = ref('');
  const infoCollect = ref<IExerciseInfoCollectDTO | null>(null);
  const isClassJoin = ref(false);
  const targetKdtId = ref(0);
  if (alias === '') {
    isEmpty.value = true;
  } else {
    WorkbookService.getWorkbookDetail({ alias }).then((workbook) => {
      targetKdtId.value = workbook.targetKdtId;
      isClassJoin.value = workbook.isCLassJoin;
      if (workbook.hasJoined) {
        if (workbook.studentList.length === 1) {
          listRoute.push({
            query: {
              workbookAlias: alias,
              kdt_id: window._global.shopMetaInfo.rootKdtId || kdtId,
            },
          });
        } else {
          // 班级加入多学员从分享链接进入
          openStudentChoosePopup({
            props: {
              studentList: workbook.workbook.studentList,
            },
          }).then((studentId: number) => {
            listRoute.push({
              query: {
                workbookAlias: alias,
                studentId: studentId,
                kdt_id: window._global.shopMetaInfo.rootKdtId || kdtId,
              },
            });
          });
        }
      } else if (!workbook.isOnShelf) {
        isEmpty.value = true;
      } else {
        title.value = workbook.title;
        if (workbook.isFreeJoin) {
          infoCollect.value = workbook.infoCollect;
        }
      }
    })
      .catch((e: string) => {
        Toast(e);
        isEmpty.value = true;
      });
  }

  return {
    alias,
    isEmpty,
    title,
    infoCollect,
    isClassJoin,
    isShare,
    homeworkAlias,
    targetKdtId,
  };
}

export const useWorkbookModuleModel = hookOf(WorkbookModuleModel);
export default WorkbookModuleModel;
