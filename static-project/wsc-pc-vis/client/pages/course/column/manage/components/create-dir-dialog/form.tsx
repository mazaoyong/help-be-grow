import React, { FC, useCallback, useEffect, useRef } from 'react';
import { EasyFormArchive } from '@youzan/ebiz-components';
import { IEditDirFormProps } from './types';
import { ZentForm } from 'zent/es/form/ZentForm';
import { Button, FormInputField, Validators, Notify } from 'zent';
import { IFormCreatorConfig } from '@youzan/ebiz-components/es/types/easy-form-archive';
import { createColumnDir, updateColumnDir } from '../../api';
import './style.scss';

const { EasyForm } = EasyFormArchive;

const EditDirForm: FC<IEditDirFormProps> = (props) => {
  const { currentDir = {}, type, onCorfirm, onCancel, columnAlias, level = 'parentNode' } = props;
  const ref = useRef<ZentForm<any>>();
  const showDesc = currentDir && currentDir.contentNum > 0 && !currentDir.childrenDirectoryNum;
  const initialize = useCallback(() => {
    if (type === 'update' && currentDir && ref.current) {
      const { name } = currentDir;
      ref.current.patchValue({ name });
    }
  }, [currentDir, type]);

  const config: IFormCreatorConfig[] = [{
    name: 'name',
    label: `${level === 'subNode' ? '子' : ''}目录名称`,
    type: 'field',
    component: FormInputField,
    required: true,
    helpDesc: showDesc && type === 'create' ? '目录已存在内容，新建后会将内容全部移动到该子目录中。' : '',
    props() {
      return {
        props: {
          placeholder: '输入目录名称，40个字以内',
          width: '350px',
        },
      };
    },
    validators: [
      Validators.required('请填写目录名称'),
      Validators.maxLength(40, '目录名称不能超过40字')
    ]
  }];

  const onSubmit = useCallback((ctx: ZentForm<any>) => {
    const formValue = ctx.getValue();
    const params = {
      name: formValue['name'],
      columnAlias,
    };
    if (type === 'create') {
      params['pid'] = currentDir['id'];
      createColumnDir({ createDirectoryDTO: params })
        .then(() => {
          onCancel();
          onCorfirm && onCorfirm();
          Notify.success('目录创建成功');
        })
        .catch(() => Notify.error('创建失败，请重试'));
    } else {
      params['id'] = currentDir['id'];
      updateColumnDir({ updateDTO: params })
        .then(() => {
          onCancel();
          onCorfirm && onCorfirm();
          Notify.success('重命名成功');
        })
        .catch(() => Notify.error('重命名失败，请重试'));
    }
  }, [columnAlias, currentDir, onCancel, onCorfirm, type]);

  useEffect(() => {
    initialize();
  }, []);

  return (<EasyForm ref={form => { ref.current = form; }} layout="horizontal" config={config} onSubmit={onSubmit}>
    <div className="createdir-form-actions">
      <Button onClick={() => onCancel()}> 取消 </Button>
      <Button type="primary" htmlType="submit"> 保存 </Button>
    </div>
  </EasyForm>);
};

export default EditDirForm;
