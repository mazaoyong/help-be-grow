export interface IVideoValue {
  url: string;
  status?: 0 | -1 | 1;
  videoId: number;
  coverUrl?: string;
  videoStatus?: number;
  duration?: number;
  deleted?: boolean;
  size?: { width?: string, height?: string };
  name?: string;
  [src: string]: any;
}
export interface IVideoOutputValue {
  url: string;
  status: 0 | -1 | 1;
  videoId: number;
  coverUrl: string;
  videoStatus: number;
  deleted: boolean;
  size: { width?: string, height?: string };
  name: string;
  fileSize: number;
  duration: number;
}
export interface IVideouploaderProps {
  value: IVideoValue[];
  max: number;
  anchor: string;
  onChanged: (output: IVideoOutputValue[]) => void;
}
export interface IVideoLocalProps {
  data: string;
  key: number;
  status: 0 | -1 | 1;
  origin: IVideoValue | {};
  videoId: number;
  name: string;
  videoStatus: number;
  deleted: boolean;
  videoSize: { width?: string, height?: string };
  coverUrl: string;
  fileSize: number;
  duration: number;
}
