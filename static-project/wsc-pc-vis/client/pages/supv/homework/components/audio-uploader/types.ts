export interface IAudioValue {
  url: string;
  status?: 0 | -1 | 1;
  audioId?: number;
  name?: string;
  [src: string]: any;
}
export interface IAudioOutputValue {
  url: string;
  status: 0 | -1 | 1;
  audioId: number;
  name: string;
  extra: any; // 后端返回的定义
}
export interface IAudiouploaderProps {
  value: IAudioValue[];
  max?: number;
  maxSize?: number;
  anchor: string;
  supportRecord?: boolean;
  onChanged: (output: IAudioOutputValue[]) => void;
  popProps?: Record<string, any>;
}
export interface IAudioLocalProps {
  data: string;
  key: number;
  status: 0 | -1 | 1;
  origin: IAudioValue | {};
  audioId: number;
  name: string;
  extra: any;
}
