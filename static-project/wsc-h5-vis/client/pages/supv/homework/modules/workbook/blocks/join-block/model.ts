import { computed } from '@youzan/tany-vue';
import { listRoute } from '../../../../router';
import { useAppModel } from 'supv/homework/App.model';
import { useWorkbookModuleModel } from '../../model';

import { IAttributeInfoDTO } from 'definitions/api/owl/api/UserExerciseFacade/getUserExercise';
import WorkbookService from '@/domain/workbook-domain/services';
import commonLogin from '@/common/utils/login';

import { openCollectInfoPopup } from '@/components/info-collect-popup';
import { Toast } from 'vant';

import { InfoCollectItem } from '@/domain/workbook-domain/data-source/apis';

export enum DynamicFormTypeEnum {
  TEXT= 0,
  NUMBER= 1,
  DATE= 2,
  PROVINCE= 3,
  GENDER= 4,
  IMAGE= 5,
  ADDRESS= 6,
  SINGLESELECT= 7,
  MULTISELECT= 8,
  PHONE= 9,
  CUSTOM= 10,
  TIME_RANGE= 11,
  DIGIT= 12,
}

function JoinBlockModel() {
  const {
    mainColor,
  } = useAppModel();

  const {
    title,
    alias,
    infoCollect,
    isClassJoin,
    isShare,
    homeworkAlias,
    targetKdtId,
  } = useWorkbookModuleModel();

  const joinButtonText = computed(() => isClassJoin.value ? '请联系老师，加入作业本' : '领取作业本');
  const handleJoinWorkbook = () => {
    if (!isClassJoin.value) {
      commonLogin({
        getUser: false,
        forceLogin: false,
        authTypeList: ['nicknameAndAvatar', 'mobile'],
      }).then(() => {
        if (infoCollect.value?.open === 1) {
          openCollectInfoPopup({
            props: {
              infoCollectionItems: infoCollect.value!.attributeList,
              // infoCollectDto: formatInfoCollectDTO(infoCollect.value as unknown as IExerciseInfoCollectDTO),
              noRequiredText: false,
            },
          }).then((data: any) => {
            const { values: infoCollectItems } = data;
            const info: InfoCollectItem[] = [];
            for (let itemKey in infoCollectItems) {
              let infoCollectItem: IAttributeInfoDTO;
              let value: string;
              if (Number.isNaN(Number(itemKey))) {
                // eslint-disable-next-line max-len
                infoCollectItem = infoCollect.value!.attributeList.find(item => item.attributeKey === itemKey) as unknown as IAttributeInfoDTO;
              } else {
                // eslint-disable-next-line max-len
                infoCollectItem = infoCollect.value!.attributeList.find(item => item.attributeId === Number(itemKey)) as unknown as IAttributeInfoDTO;
              }
              if (Array.isArray(infoCollectItems[itemKey])) {
                if (infoCollectItem.dataType === DynamicFormTypeEnum.PROVINCE) {
                  value = JSON.stringify(infoCollectItems[itemKey].slice(0, 3));
                } else if (infoCollectItem.dataType === DynamicFormTypeEnum.MULTISELECT) {
                  value = infoCollectItems[itemKey].join(',');
                } else {
                  value = JSON.stringify(infoCollectItems[itemKey]);
                }
              } else {
                value = infoCollectItems[itemKey] as string;
              }
              info.push({
                attributeId: infoCollectItem.attributeId,
                value: value,
                attributeKey: infoCollectItem.attributeKey,
                attributeTitle: infoCollectItem.attributeTitle,
                createdAt: infoCollectItem.createdAt,
              });
            }
            WorkbookService.joinWorkbook({ alias, infoCollectItems: info, targetKdtId: targetKdtId.value })
              .then(() => {
                listRoute.push({
                  query: {
                    workbookAlias: alias,
                    isShare,
                    homeworkAlias,
                    kdt_id: window._global.shopMetaInfo.rootKdtId || window._global.kdt_id,
                  },
                });
              })
              .catch((e: string) => {
                Toast(e);
              });
          }).catch((e: string) => {
            Toast(e);
          });
        } else {
          WorkbookService.joinWorkbook({ alias, targetKdtId: targetKdtId.value })
            .then(() => {
              listRoute.push({
                query: {
                  workbookAlias: alias,
                  isShare,
                  homeworkAlias,
                  kdt_id: window._global.shopMetaInfo.rootKdtId || window._global.kdt_id,
                },
              });
            })
            .catch((e: string) => {
              Toast(e);
            });
        }
      });
    }
  };

  return {
    mainColor,
    title,
    handleJoinWorkbook,
    joinButtonText,
  };
}

export default JoinBlockModel;
