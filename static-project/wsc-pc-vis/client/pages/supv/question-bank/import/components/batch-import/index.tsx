import React, { FC, Props, useState, useCallback, useRef } from 'react';
import { ICheckboxEvent, Notify, Button } from 'zent';
import { hashHistory } from 'react-router';
import { ZentForm } from 'zent/es/form/ZentForm';
import { Button as SamButton } from '@youzan/sam-components';
import get from 'lodash/get';

import ImportPage from 'components/import-page';
import { createImportTask } from '../../../../api/question-bank';
import CategoryField from '../../../edit/components/category-field';
import { QuestionBankImportTemplate, QuestionBankImportType } from '../../../constants';
import { IQuestionImportPageProps } from '../../types';

import './styles.scss';

function renderChildrenComponent({ children }: Props<{}>) {
  return children;
}

const QuestionBatchImport: FC<IQuestionImportPageProps> = ({ handleTabChange, onNextStep }) => {
  const [agreeProtocol, setAgreeProtocol] = useState(true);
  const [loading, toggleLoading] = useState(false);

  const formRef = useRef<ZentForm<any>>();
  const fileRef = useRef<string>();

  const toggleAgreeProtocol = useCallback((e: ICheckboxEvent<boolean>) => {
    setAgreeProtocol(e && e.target && e.target.checked);
  }, []);

  const onUploadFildChange = useCallback((fileInfo) => {
    const { value } = fileInfo;
    fileRef.current = value;
  }, []);

  const handleSubmit = useCallback(
    // @upgrade: zent8
    (form: ZentForm<{}>) => {
      const fileUrl = fileRef.current;
      if (!fileUrl) {
        Notify.error('请先上传文件');
        return;
      }

      toggleLoading(true);

      const formValue = form.getValue();
      const categoryId = get(formValue, 'categoryId');

      createImportTask({
        categoryId,
        importType: QuestionBankImportType,
        importFile: {
          fileUrl,
          privateUrl: true,
        },
        targetKdtId: _global.kdtId, // 暂只支持总店
      })
        .then((data) => {
          if (data) {
            handleTabChange(2);
            onNextStep && onNextStep();
          }
        })
        .catch((e) => {
          Notify.error(e || '导入任务创建失败，请稍后重试');
        })
        .finally(() => {
          toggleLoading(false);
        });
    },
    [handleTabChange, onNextStep],
  );

  const submit = useCallback(() => {
    formRef.current && formRef.current.submit();
  }, [formRef]);

  return (
    <>
      <ImportPage
        className="batchimport batchimport-form"
        formRef={formRef}
        needSteps
        prefields={[
          {
            keyName: 'categoryKey',
            component: renderChildrenComponent,
            props: () => {
              return {
                index: 1,
                title: '选择要导入的分类',
              };
            },
            children: [
              {
                name: 'categoryId',
                label: '所属分类：',
                type: 'field',
                required: '请选择要导入的分类',
                component: CategoryField,
                fieldProps() {
                  return {
                    needSystemDefault: true,
                    selectedCategory: {
                      categoryName: '',
                    },
                    dialogProps: {
                      title: '请选择',
                    },
                    style: {
                      minWidth: 220,
                      maxWidth: 300,
                    },
                  };
                },
                validators: [
                  (value) => {
                    if (!value) {
                      return {
                        name: 'empty-category',
                        message: '请选择要导入的分类',
                      };
                    }
                    return null;
                  },
                ],
              },
            ],
          },
        ]}
        enableTemplateField
        templateLink={QuestionBankImportTemplate}
        enableUploadField
        templateFieldLabel="下载文件模板"
        uploadFieldLabel="上传文件"
        fileMaxSize={10}
        agreeProtocol={agreeProtocol}
        toggleAgreeProtocol={toggleAgreeProtocol}
        onUploadFileChange={onUploadFildChange}
        onSubmit={handleSubmit}
      />
      <div className="submit-footer expand" role="submit-footer">
        <div>
          <Button onClick={() => hashHistory.push('list')}>取消</Button>
          <SamButton
            name="编辑"
            type="primary"
            loading={loading}
            disabled={!agreeProtocol}
            onClick={submit}
          >
            下一步
          </SamButton>
        </div>
      </div>
    </>
  );
};

export default QuestionBatchImport;
