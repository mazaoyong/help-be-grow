/**
 * 用于编辑题目的弹窗
 */
import React from 'react';
import { Button, Notify, BlockLoading } from 'zent';
import { Dialog } from '@youzan/ebiz-components';
import { IDialogChildrenProps } from '@youzan/ebiz-components/es/types/dialog';
import { ZentForm } from 'zent/es/form/ZentForm';

import SwitchComponent from './blocks/switch-component';
import preSubmitQuestion from './utils/pre-submit-question';
import separateResponse, { IQuestionSubmitSettingForm } from './utils/separate-response';
import submitQuestion from './utils/submit-question';

import { getQuestionDetail } from '../../api/question-bank';
import { IQuestionSubmitForm, IQuestionResponse } from './types';
import { QuestionType } from '@ability-center/supv/question-bank';
import './styles.scss';

const { openDialog, DialogBody, DialogFooter } = Dialog;

interface IEditQuestionContentProps {
  questionId: number;
}
const EditQuestionContent: React.FC<IDialogChildrenProps<
IQuestionSubmitForm,
IEditQuestionContentProps
>> = (props) => {
  const { dialogref, data, loadingState } = props;
  const { questionId } = data;
  const [loading, setLoading] = React.useState(true);
  // prettier-ignore
  const [questionSettingForm, setQuestionSettingForm] = React.useState<IQuestionSubmitSettingForm>();
  const [questionType, setQuestionType] = React.useState<QuestionType>(QuestionType.Single);
  // @upgrade: zent8
  const questionContentFormRef = React.useRef<ZentForm<{}> | null>(null);

  const handleSubmit = React.useCallback(() => {
    if (questionContentFormRef.current) {
      questionContentFormRef.current.submit();
    }
  }, []);

  const invokeDialogSubmit = React.useCallback(() => {
    if (questionContentFormRef.current) {
      // 这玩意一定是一个合法的form value
      const questionContentForm = questionContentFormRef.current.getValue() as IQuestionSubmitForm;
      if (questionSettingForm) {
        preSubmitQuestion(questionType, questionContentForm)
          .then((data) => {
            const submitData: IQuestionSubmitForm = Object.assign({}, questionSettingForm, data);
            dialogref.submit(submitData);
          })
          .catch(Notify.error);
      }
    }
  }, [dialogref, questionSettingForm, questionType]);

  React.useLayoutEffect(() => {
    if (questionId) {
      getQuestionDetail<IQuestionResponse>({ id: questionId })
        .then(separateResponse)
        .then((res) => {
          if (res) {
            const [defaultQuestionSetting, defaultQuestionContent] = res;
            // 设置试题类型
            const { type } = defaultQuestionSetting;
            setQuestionType(type);
            setQuestionSettingForm(Object.assign({}, defaultQuestionSetting, { id: questionId }));
            if (questionContentFormRef.current) {
              questionContentFormRef.current.initialize(defaultQuestionContent);
            }
          }
        })
        .catch(Notify.error)
        .finally(() => setLoading(false));
    } else {
      console.error('缺少questionId');
      Notify.error('网络错误，请稍后重试');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BlockLoading loading={loading} className="question-bank__edit-dialog">
      <DialogBody>
        <div className="content">
          <SwitchComponent
            ref={questionContentFormRef}
            questionType={questionType}
            onSubmit={invokeDialogSubmit}
          />
        </div>
      </DialogBody>
      <DialogFooter>
        <Button onClick={dialogref.close}>取消</Button>
        <Button type="primary" loading={loadingState} onClick={handleSubmit}>
          确定
        </Button>
      </DialogFooter>
    </BlockLoading>
  );
};

const openEditQuestionDialog = (editQuestionProps: IEditQuestionContentProps) => {
  return openDialog<IQuestionSubmitForm, IEditQuestionContentProps>(EditQuestionContent, {
    title: '编辑试题',
    dialogId: 'editQuestion',
    data: editQuestionProps,
    style: { width: '930px' },
    submitEffect: (formData) => submitQuestion('update', formData),
  });
};

export default openEditQuestionDialog;
