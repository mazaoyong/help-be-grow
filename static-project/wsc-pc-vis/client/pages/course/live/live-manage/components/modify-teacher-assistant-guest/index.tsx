import React from 'react';
import { EasyFormArchive, Dialog } from '@youzan/ebiz-components';
import { Button, FormInputField, Form, Validators, Notify } from 'zent';

import './styles.scss';
import { IDialogChildrenProps } from '@youzan/ebiz-components/es/types/dialog';
import { IFormCreatorConfig } from '@youzan/ebiz-components/es/types/easy-form-archive';
import { ZentForm } from 'zent/es/form/ZentForm';

const { EasyForm } = EasyFormArchive;

export interface IModifyRoleProps {
  type: 'add' | 'edit';
  prefix: string;
  name?: string;
  /** 头衔 */
  title?: string;
  channelId?: string;
  /** 密码 */
  inviteCode?: string;
  onConfirm?(values: IModifyRoleResponse): void;
  onCancel?(): void;
  fetchFunction(...args: any[]): Promise<any>;
}
export interface IModifyRoleResponse {
  type: IModifyRoleProps['type'];
  name: string;
  title: string;
  channelId?: string;
  inviteCode?: string;
}

const { openDialog, DialogBody, DialogFooter } = Dialog;
const { ValidateOption } = Form;
const VALIDATE_OPTION = ValidateOption.IncludeUntouched | ValidateOption.IncludeChildrenRecursively;

const ModifyRole: React.FC<IDialogChildrenProps<
IModifyRoleResponse,
IModifyRoleProps
>> = (props) => {
  const { data, dialogref } = props;
  const { onCancel, onConfirm, prefix, fetchFunction, ...initValues } = data;
  const [loading, setLoading] = React.useState(false);
  const formRef = React.useRef<ZentForm<{ title: any; name: any }> | null>(null);

  const handleCancel = React.useCallback(() => {
    onCancel && onCancel();
    dialogref.close();
  }, [dialogref, onCancel]);

  const handleConfirm = React.useCallback(() => {
    if (formRef.current) {
      setLoading(true);
      formRef.current
        .validate(VALIDATE_OPTION)
        .then((errors) => (errors as any[]).every((err) => err === null))
        .then((isValidate) => {
          if (isValidate) {
            // @upgrade: zent8
            const values = formRef.current && formRef.current.getValue() as {title: any; name: any};
            if (values) {
              const { type, channelId, inviteCode } = initValues;
              const confirmValues: IModifyRoleResponse = Object.assign({}, values, {
                type,
                channelId,
                inviteCode,
              });
              onConfirm && onConfirm(confirmValues);
              return Promise.resolve(confirmValues);
            }
          }
          return Promise.reject();
        })
        .then((confirmValues) => fetchFunction(confirmValues))
        .then(dialogref.submit)
        .catch((err) => {
          err && Notify.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [dialogref, fetchFunction, initValues, onConfirm]);

  return (
    <div className="modify-teacherAndAssistant__container">
      <DialogBody>
        <EasyForm
          ref={(form) => (formRef.current = form)}
          layout="horizontal"
          config={ModifyTeacherConfigs({
            prefix,
            initValues,
          })}
        />
        {initValues.type === 'edit' && (
          <div className="zent-form-horizontal">
            <div className="addon-info zent-form-control">
              <label className="zent-form-label ">频道号：</label>
              <div className="zent-form-control-content">{initValues.channelId || '-'}</div>
            </div>
            <div className="addon-info zent-form-control">
              <label className="zent-form-label ">密码：</label>
              <div className="zent-form-control-content">{initValues.inviteCode || '-'}</div>
            </div>
          </div>
        )}
      </DialogBody>
      <DialogFooter>
        <Button onClick={handleCancel}>取消</Button>
        <Button type="primary" loading={loading} onClick={handleConfirm}>
          保存
        </Button>
      </DialogFooter>
    </div>
  );
};

const modifyRoleDialog = (params: IModifyRoleProps) => {
  const { prefix, type } = params;
  const MODE_PREFIX = type === 'add' ? '新建' : '编辑';

  return openDialog(ModifyRole, {
    title: `${MODE_PREFIX}${prefix}信息`,
    data: params,
    maskClosable: false,
  });
};

interface IFormConfigParams {
  prefix: string;
  initValues: {
    title?: string;
    name?: string;
  };
}
const ModifyTeacherConfigs = (params: IFormConfigParams): IFormCreatorConfig[] => {
  const { prefix, initValues } = params;

  return [
    {
      name: 'name',
      label: `${prefix}名称：`,
      required: `请输入${prefix}名称`,
      type: 'field',
      defaultValue: initValues.name || '',
      component: FormInputField,
      props() {
        return {
          props: {
            placeholder: `请输入${prefix}名称`,
          },
        };
      },
      validators: [Validators.maxLength(8, '最多可输入8个字')],
    },
    {
      name: 'title',
      label: `${prefix}头衔：`,
      required: `请输入${prefix}头衔`,
      type: 'field',
      defaultValue: initValues.title || '',
      component: FormInputField,
      props() {
        return {
          props: {
            placeholder: `请输入${prefix}头衔`,
          },
        };
      },
      validators: [Validators.maxLength(8, '最多可输入8个字')],
    },
  ];
};

export { ModifyRole, modifyRoleDialog };
