export interface IDocumentValue {
  documentId?: number;
  url: string;
  name?: string;
  size?: number;
  fileExt?: string;
  [src: string]: any;
}

export interface IDocumentOutputValue {
  documentId: number;
  url: string;
  name: string;
  size?: number;
  fileExt?: string;
  extra: any; // 后端返回的定义
}

export interface IDocumentUploaderProps {
  anchor: string;
  maxAmount: number;
  value: IDocumentValue[];
  onChanged: (output: IDocumentOutputValue[]) => void;
}

export interface IDocumentLocalProps {
  data: string;
  key: number;
  origin: IDocumentValue | {};
  documentId: number;
  name: string;
  extra: any;
  size?: number;
  fileExt?: string;
}
