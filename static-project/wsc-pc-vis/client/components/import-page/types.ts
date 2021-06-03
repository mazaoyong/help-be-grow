import { IFormCreatorConfig } from '@youzan/ebiz-components/es/types/easy-form-archive';
import { ICheckboxEvent } from 'zent';
import { ZentForm } from 'zent/es/form/ZentForm';

interface IUploadFile {
  value: string;
  size: number;
}

export interface IImportPageProps {
  className?: string;
  formRef?: any;
  needSteps?: boolean; // 是否需要纵向步骤条
  prefields?: IImportFields[]; // 添加在固定字段之前的字段列表（固定字段为“导入文件模板”和“上传文件”区域）
  suffields?: IImportFields[]; // 添加在固定字段之后的字段列表
  enableTemplateField: boolean;
  templateFieldLabel?: string;
  templateFieldDesc?: string;
  templateLink: string;
  enableUploadField: boolean
  fileMaxSize: number;
  uploadFieldLabel?: string;
  uploadFieldDesc?: string;
  agreeProtocol: boolean;
  toggleAgreeProtocol: (e: ICheckboxEvent<boolean>) => void;
  onUploadFileChange?: (file: IUploadFile) => void;
  onSubmit?: (form: ZentForm<any>) => void;
  updateFieldsId?: string | number; // 用来更新useMemo依赖项，触发Fields的更新
}

export interface IImportFields extends IFormCreatorConfig {
  index?: number;
  title?: string;
  display?: boolean;
}

export interface ITemplateField {
  templateLink: string;
  templateFieldDesc: string;
}
