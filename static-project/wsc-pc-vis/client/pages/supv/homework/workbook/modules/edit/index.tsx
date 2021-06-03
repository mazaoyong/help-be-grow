import { React, useState, useCallback, createBlock, ModelOf } from '@youzan/tany-react';
import { Validators, ValidateOccasion, Notify, BlockLoading } from 'zent';
import { ArthurContainer, ArthurDecorator, useArthurModel } from '@youzan/arthur-scheduler-react';
import { EasyForm } from '@youzan/ebiz-components';
import { EasyFormConfigType, IEasyFormInstance } from '@youzan/ebiz-components/es/types/easy-form';
import { isEduShop } from '@youzan/utils-shop';
import { Button as SamButton } from '@youzan/sam-components';
import { abilityCheck } from 'fns/auth/ability-check-status';

import InfoCollectField from 'components/field/info-collect';
import JoinTypeSelect from './components/join-type-select';
import NeedInfoCollect from './components/need-info-collect';
import CommonLink from 'components/common-link';
import TeacherSelector from '@ability-center/edu-course/teacher-selector';
import useWorkbookEditModel from './models/workbook-edit';
import WorkbookService from 'domain/workbook-domain/services';
import { workbookManageRoute } from '../../router';

import { APPID, AbilityCode, AppName } from '../../../constants';

import { joinLimit, visibleOccasionType, visibleRangeType } from 'domain/workbook-domain/types';
import { BooleanLike } from './types';

import './styles.scss';

const { EasyFormRenderer } = EasyForm;

const { createWorkbook, updateWorkbook } = WorkbookService;

const model = () => {
  const {
    id,
    isEdit,
    formRef,
    workbookAddition,
    boundClass,
    fromEduClassId,
    needInfoCollect,
    visibleOccasionTextMap,
    visibleOccasionDescMap,
    visibleRangeTextMap,
    visibleRangeDescMap,
    loading,
    infoCollect,
  } = useWorkbookEditModel();

  // const WorkbookListLink = workbookListRoute.getLinkComponent();

  const [submitLoading, toggleSubmitLoading] = useState(false);

  const { model: educlassSelectModel } = useArthurModel('educlassSelect', '督学互动');
  const classAvailable = educlassSelectModel.available; // 基础版不支持班级

  const handleSubmit = useCallback(
    (form: IEasyFormInstance) => {
      toggleSubmitLoading(true);
      const formData = form.zentForm?.getValue() as any;
      const {
        needInfoCollect: rawNeedInfoCollect,
        teacherList: rawTeacherList,
        joinType: rawJoinType,
        infoCollect: rawInfoCollect,
      } = formData;

      formData['needInfoCollect'] = rawNeedInfoCollect ? BooleanLike.True : BooleanLike.False;

      formData['teacherList'] = rawTeacherList.map((formTeacher, index) => {
        const { id: teacherId } = formTeacher;
        return {
          teacherId,
          serialNo: index + 1,
        };
      });
      if (fromEduClassId) {
        formData['joinType'] = {
          type: joinLimit.boundClass,
          classId: fromEduClassId,
        };
      } else if (!classAvailable) {
        formData['joinType'] = {
          type: joinLimit.freeToJoin,
        };
      } else {
        formData['joinType'] = {
          type: rawJoinType?.type ?? joinLimit.freeToJoin,
          classId: rawJoinType?.eduClass?.classId || null,
        };
      }

      formData['infoCollect'] = {
        inClue: rawInfoCollect?.inClue ?? 0,
        attributeIds: rawInfoCollect?.customizeItems || [],
      };

      const submitFunc = isEdit ? updateWorkbook : createWorkbook;

      submitFunc(isEdit ? { ...formData, ...workbookAddition } : formData)
        .then(res => {
          Notify.success(`作业本${isEdit ? '编辑' : '新建'}成功`);
          workbookManageRoute.push({ params: { id: res, viewType: 'homeworks' } });
        })
        .catch(e => {
          Notify.error(e || '表单提交出错，请返回重试');
        })
        .finally(() => toggleSubmitLoading(false));
    },
    [classAvailable, fromEduClassId, isEdit, workbookAddition],
  );

  const saveCheck = useCallback((form: IEasyFormInstance) => {
    abilityCheck({
      abilityCode: AbilityCode,
      appId: APPID,
      name: AppName
    }).then(() => {
      handleSubmit(form);
    });
  }, [handleSubmit]);

  const getConfig: EasyFormConfigType[] | any = useCallback(
    (disabled?: boolean) => [
      {
        name: 'title',
        label: '作业本名称',
        type: 'Input',
        required: true,
        inheritProps: {
          placeholder: '最多可输入40个字',
          width: 360,
          disabled,
        },
        validateOccasion: ValidateOccasion.Change,
        validators: [
          Validators.required('请输入作业本名称'),
          Validators.maxLength(40, '最多可输入40个字'),
        ],
      },
      {
        name: 'joinType',
        label: '领取方式',
        type: 'Custom',
        required: true,
        renderField: JoinTypeSelect,
        inheritProps: {
          disabled: disabled || isEdit,
        },
        defaultValue: {
          type: joinLimit.freeToJoin,
        },
        visible: !fromEduClassId && classAvailable,
        validators: [
          Validators.required('请选择领取方式'),
          value => {
            const { type, eduClass } = value;
            const noClass = !eduClass || !eduClass?.classId;
            if (type === joinLimit.boundClass && noClass) {
              return {
                name: 'no class',
                message: '请选择关联班级',
              };
            }
          },
        ],
      },
      {
        name: 'needInfoCollect',
        label: '信息采集',
        type: 'Custom',
        renderField: NeedInfoCollect,
        inheritProps: {
          disabled,
        },
        visible: !fromEduClassId && !boundClass,
        defaultValue: false,
        watch: {
          joinType(value, ctx) {
            const type: joinLimit = value?.type ?? joinLimit.freeToJoin;
            ctx.set({
              status: {
                visible: type !== joinLimit.boundClass,
              },
            });
          },
        },
        // todo: 需要考虑下不支持信息采集的场景
      },
      {
        name: 'infoCollect',
        type: 'Custom',
        renderField: InfoCollectField,
        defaultValue: !isEdit
          ? {
            customizeItems: [],
            inClue: 0,
          }
          : infoCollect,
        inheritProps: {
          showInClue: isEduShop,
          sceneId: 6,
          enableSessionStorage: false,
          disabled,
        },
        visible: needInfoCollect === BooleanLike.True && !fromEduClassId && !boundClass,
        watch: {
          joinType(value, ctx, form) {
            const type: joinLimit = value?.type ?? joinLimit.freeToJoin;
            const formValue = form.getValue();
            const { needInfoCollect } = formValue;

            ctx.set({
              status: {
                visible: type !== joinLimit.boundClass && needInfoCollect,
              },
            });
          },
          needInfoCollect(value, ctx, form) {
            const needInfoCollectFieldValue = value;
            const formValue = form.getValue();
            const { joinType } = formValue;
            const type = joinType.type;

            ctx.set({
              status: {
                visible:
                  !fromEduClassId && type === joinLimit.freeToJoin && needInfoCollectFieldValue,
              },
            });
          },
        },
        validators: [
          (value, ctx) => {
            const { needInfoCollect } = ctx.getSectionValue();

            const { customizeItems = [] } = value;
            if (needInfoCollect && customizeItems.length === 0) {
              return {
                name: 'empty collect info',
                message: '请选择资料项',
              };
            }
          },
        ],
      },
      {
        name: 'teacherList',
        label: '老师',
        type: 'Custom',
        renderField: TeacherSelector,
        inheritProps: {
          desc:
            '最多选择10个老师；作业本关联老师后，老师可布置及批阅作业；老师将收到批阅作业的提醒。',
          queryStaff: true,
          showOnlyScheduledFilter: false,
          disabled,
        },
        defaultValue: [],
      },
      {
        name: 'visibleOccasion',
        label: '学员查看作业',
        type: 'Radio',
        required: true,
        inheritProps: {
          disabled,
        },
        options: [
          {
            value: String(visibleOccasionType.submitted),
            text: visibleOccasionTextMap[visibleOccasionType.submitted],
            desc: visibleOccasionDescMap[visibleOccasionType.submitted],
          },
          {
            value: String(visibleOccasionType.marked),
            text: visibleOccasionTextMap[visibleOccasionType.marked],
            desc: visibleOccasionDescMap[visibleOccasionType.marked],
          },
        ],
        defaultValue: String(visibleOccasionType.submitted),
      },
      {
        name: 'visibleRange',
        label: '查看作业范围',
        type: 'Radio',
        required: true,
        inheritProps: {
          disabled,
        },
        options: [
          {
            value: String(visibleRangeType.all),
            text: visibleRangeTextMap[visibleRangeType.all],
            desc: visibleRangeDescMap[visibleRangeType.all],
          },
          {
            value: String(visibleRangeType.goodOnesOnly),
            text: visibleRangeTextMap[visibleRangeType.goodOnesOnly],
            desc: visibleRangeDescMap[visibleRangeType.goodOnesOnly],
          },
        ],
        defaultValue: String(visibleRangeType.all),
      },
    ],
    [
      isEdit,
      fromEduClassId,
      classAvailable,
      boundClass,
      infoCollect,
      needInfoCollect,
      visibleOccasionTextMap,
      visibleOccasionDescMap,
      visibleRangeTextMap,
      visibleRangeDescMap,
    ],
  );

  return {
    id,
    isEdit,
    formRef,
    getConfig,
    handleSubmit: saveCheck,
    submitLoading,
    loading,
  };
};

const EditPage = (params: ModelOf<typeof model>) => {
  const { formRef, getConfig, handleSubmit, submitLoading, loading } = params;
  return (
    <div className="app-design workbook-edit">
      {loading ? (
        <BlockLoading loading={loading} height="600px" />
      ) : (
        <ArthurContainer name="editHomework" namespace="督学互动" preventDefault>
          <ArthurDecorator preventDefault>
            {model => (
              <EasyFormRenderer
                ref={formRef}
                addColon
                config={getConfig(model?.disabled)}
                onSubmit={handleSubmit}
                renderSubmit={submit => (
                  <div className="easy-form-actions">
                    <SamButton
                      loading={submitLoading}
                      onClick={submit}
                      name="编辑"
                      type="primary"
                      htmlType="submit"
                      disabled={model?.disabled}
                    >
                      保存
                    </SamButton>
                    <CommonLink
                      displayType="button"
                      type="default"
                      url="/v4/vis/supv/homework/workbook/list"
                      style={{ marginLeft: 8 }}
                    >
                      取消
                    </CommonLink>
                  </div>
                )}
              />
            )}
          </ArthurDecorator>
        </ArthurContainer>
      )}
    </div>
  );
};

export default createBlock({
  root: EditPage,
  model,
  components: [JoinTypeSelect],
});
