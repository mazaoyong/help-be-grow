import { React, useState, useCallback, createBlock, ModelOf } from '@youzan/tany-react';
import { Notify, BlockLoading, Button } from 'zent';
import { ArthurContainer, ArthurDecorator } from '@youzan/arthur-scheduler-react';
import { IEasyFormInstance } from '@youzan/ebiz-components/es/types/easy-form';
import redirect from '@youzan/utils/url/redirect';
import { EasyForm } from '@youzan/ebiz-components';
import { Button as SamButton } from '@youzan/sam-components';
import CommonLink from 'components/common-link';
import { abilityCheck } from 'fns/auth/ability-check-status';

import Detail from './components/detail';
import useHomeworkEditModel from './models/homework-edit';
import { RouterFallback } from '../../../components/router-fallback';
import HomeworkPreview from './components/vue-preview';
import { BooleanLike } from '../../../types';
import { APPID, AbilityCode, AppName } from '../../../constants';
import { RateType } from 'domain/homework-domain/types/homework';

import './styles.scss';

const { EasyFormRenderer } = EasyForm;

const HomeworkEditModel = () => {
  const {
    title,
    detail,
    publishTime,
    formLoading,
    homeworkId,
    viewType,
    config,
    formRef,
    workbookId,
    onCreateHomework,
    onUpdateHomework,
    isAuthorized,
    onShowErrorChange,
  } = useHomeworkEditModel();
  const routeIsUnknown = viewType === 'unknown';

  const [submitLoading, toggleSubmitLoading] = useState<boolean>(false);
  const isEdit = viewType === 'edit';

  const workbookManageLink = `/v4/vis/supv/homework/workbook/${workbookId}/manage/homeworks`;

  const handleSubmit = useCallback(
    (form: IEasyFormInstance) => {
      toggleSubmitLoading(true);
      const formData = form.zentForm?.getValue() as any;

      // todo: form会保留invisible的字段
      const { hasPublishTimer, rateType } = formData;
      if (hasPublishTimer === String(BooleanLike.False)) {
        delete formData.timerPublishAt;
      }
      if (rateType === String(RateType.GRADE)) {
        delete formData.scoreRule;
      }

      const submitFunc = isEdit ? onUpdateHomework : onCreateHomework;

      submitFunc(
        isEdit ? { ...formData, workbookId, id: Number(homeworkId) } : { ...formData, workbookId },
      )
        .then(() => {
          Notify.success(`作业${isEdit ? '编辑' : '创建'}成功`);
          redirect(workbookManageLink);
        })
        .catch((e) => {
          Notify.error(e || '表单提交出错，请返回重试');
        })
        .finally(() => toggleSubmitLoading(false));
    },
    [
      isEdit,
      onUpdateHomework,
      onCreateHomework,
      workbookId,
      homeworkId,
      workbookManageLink,
    ],
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

  // const WorkbookManageLink = workbookManageRoute.getLinkComponent();

  return {
    title,
    detail,
    publishTime,
    homeworkId,
    viewType,
    routeIsUnknown,
    config,
    formRef,
    submitLoading,
    workbookManageLink,
    handleSubmit: saveCheck,
    formLoading,
    isAuthorized,
    onShowErrorChange,
  };
};

const HomeworkEdit = (model: ModelOf<typeof HomeworkEditModel>) => {
  const {
    config,
    routeIsUnknown,
    formRef,
    handleSubmit,
    submitLoading,
    formLoading,
    workbookManageLink,
    isAuthorized,
    onShowErrorChange,
  } = model;

  return (
    <div className="app-design homework-edit">
      {routeIsUnknown ? (
        <RouterFallback />
      ) : (
        <>
          <HomeworkPreview
            title={model.title}
            detail={model.detail}
            publishTime={model.publishTime}
            footerBtnText="写作业"
          />
          <div className="form">
            {formLoading ? (
              <BlockLoading loading={true} height={600} />
            ) : (
              <ArthurContainer name="editHomework" namespace="督学互动" preventDefault>
                <ArthurDecorator preventDefault>
                  {(model) => (
                    <EasyFormRenderer
                      ref={formRef as any}
                      addColon
                      config={config as any}
                      onSubmit={handleSubmit}
                      renderSubmit={(submit) => (
                        <div className="easy-form-actions">
                          {isAuthorized ? (
                            <Button
                              loading={submitLoading}
                              onClick={() => {
                                onShowErrorChange(true);
                                submit();
                              }}
                              type="primary"
                              htmlType="submit"
                              disabled={model?.disabled}
                            >
                              保存
                            </Button>
                          ) : (
                            <SamButton
                              loading={submitLoading}
                              onClick={() => {
                                onShowErrorChange(true);
                                submit();
                              }}
                              name="编辑"
                              type="primary"
                              htmlType="submit"
                              disabled={model?.disabled}
                            >
                              保存
                            </SamButton>
                          )}
                          <CommonLink
                            displayType="button"
                            type="default"
                            url={workbookManageLink}
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
        </>
      )}
    </div>
  );
};

export default createBlock({
  root: HomeworkEdit,
  model: HomeworkEditModel,
  components: [Detail, HomeworkPreview],
});
