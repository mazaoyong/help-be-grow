export interface IImgValue {
  url: string;
  status?: 0 | -1 | 1;
  imgId?: number;
  [src: string]: any;
}
export interface IImgOutputValue {
  url: string;
  status: 0 | -1 | 1;
  imgId: number;
  extra: any; // 后端返回的定义
}
export interface IImguploaderProps {
  value: IImgValue[];
  max: number;
  anchor: string;
  onChanged: (output: IImgOutputValue[]) => void;
}
export interface IImgLocalProps {
  data: string;
  key: number;
  status: 0 | -1 | 1;
  origin: IImgValue | {};
  imgId: number;
  extra: any;
}
