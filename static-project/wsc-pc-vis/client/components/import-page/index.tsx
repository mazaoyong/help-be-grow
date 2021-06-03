import React, { FC, useMemo } from 'react';
import { Icon, Checkbox } from 'zent';
import cx from 'classnames';
import { EasyFormArchive, Icon as EbizIcon } from '@youzan/ebiz-components';
import FileUploader from 'components/file-uploader';
import { StepWrapper } from './utils';

import { IImportPageProps, IImportFields, ITemplateField } from './types';
import './styles.scss';

const { EasyForm } = EasyFormArchive;

const TemplateField: FC<ITemplateField> = ({ templateFieldDesc, templateLink }) => {
  return (
    <div className="file-template">
      <span className="desc">{templateFieldDesc}</span>
      <a className="operation" href={templateLink} download>
        <EbizIcon type="doc" />
        下载文件模板
      </a>
    </div>
  );
};

const ImportPage: FC<IImportPageProps> = ({
  className = '',
  formRef,
  needSteps = false,
  prefields = [],
  suffields = [],
  enableTemplateField = true,
  templateFieldLabel = '',
  templateFieldDesc = '导入前，请下载文件模板，并按照模板格式填写数据后再导入',
  templateLink = '',
  enableUploadField = true,
  fileMaxSize = 2,
  uploadFieldLabel = '',
  uploadFieldDesc = (
    <div className="file-uploader__desc">
      <p>
        当前仅支持 excel 格式文件（大小在{fileMaxSize || 2}M以内），请使用 Office 2010
        及以上版本，否则可能出现乱码
      </p>
      <p>必须严格按照模板内容填入数据，否则可能会出现导入异常。</p>
    </div>
  ),
  agreeProtocol = true,
  toggleAgreeProtocol = () => {},
  onUploadFileChange = () => {},
  onSubmit,
  updateFieldsId,
}) => {
  const templateField: IImportFields = useMemo(
    () => ({
      keyName: 'templateKey',
      label: templateFieldLabel,
      component: TemplateField,
      display: !!enableTemplateField && !!templateLink,
      props() {
        return {
          index: prefields.length + +enableTemplateField,
          title: enableTemplateField && templateFieldLabel,
          templateFieldDesc,
          templateLink,
        };
      },
    }),
    [enableTemplateField, prefields.length, templateFieldDesc, templateFieldLabel, templateLink],
  );

  const uploadField: IImportFields = useMemo(
    () => ({
      name: 'fileUrl',
      label: uploadFieldLabel,
      component: FileUploader,
      children: [
        {
          keyName: 'fileUrlKey',
          component: uploadFieldDesc,
        },
      ],
      defaultValue: 'fileUrl',
      props: () => {
        return {
          className: 'file-upload',
          channel: 'owl_oc_import',
          fileLimit: fileMaxSize || 2,
          typeRegEx: /(.xls)|(.xlsx)$/,
          onChange: onUploadFileChange,
          uploadText: (
            <span className="operation">
              <Icon type="upload" />
              点击上传文件
            </span>
          ),
          showSize: false,
          clamp: true,
          clampWidth: 280,
          uploadFirst: !needSteps,
          index: prefields.length + +enableTemplateField + +enableUploadField,
          title: enableUploadField && uploadFieldLabel,
        };
      },
      required: true,
      display: !!enableUploadField,
    }),
    [
      enableTemplateField,
      enableUploadField,
      fileMaxSize,
      needSteps,
      onUploadFileChange,
      prefields.length,
      uploadFieldDesc,
      uploadFieldLabel,
    ],
  );

  const config = useMemo(
    () =>
      [...prefields, templateField, uploadField, ...suffields]
        .filter(item => item.display !== false)
        .map(field => {
          if (needSteps) {
            return {
              ...field,
              component: StepWrapper(field.component as any),
            };
          } else {
            return field;
          }
        }),
    [updateFieldsId],
  );

  return (
    <>
      <EasyForm
        className={cx(className, { 'show-steps': needSteps })}
        layout="horizontal"
        ref={
          formRef
            ? form => {
              formRef.current = form;
            }
            : undefined
        }
        config={config}
        onSubmit={onSubmit}
      />
      <div className="agree-rules">
        <Checkbox checked={agreeProtocol} onChange={toggleAgreeProtocol}>
          我已阅读并同意
          <a
            href={`${window._global.url.base}/intro/rule/detail?alias=st6h0mrh&pageType=rules`}
            target="_blank"
            rel="noopener noreferrer"
          >
            《数据导入免责声明》
          </a>
        </Checkbox>
      </div>
    </>
  );
};

export default ImportPage;
