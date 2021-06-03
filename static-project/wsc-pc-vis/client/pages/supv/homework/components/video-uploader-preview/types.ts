import { IVideoPreviewParam } from '@youzan/ebiz-components/es/types/video/types';

export type IVideoUploaderPreviewProps = Omit<Omit<IVideoPreviewParam, 'src'>, 'id'> & {
  url: string;
  videoId: number;
  videoStatus?: number;
  deleted?: boolean;
  showDeleteIcon?: boolean;
  onDelete?: () => void;
}

export enum VideoStatus {
  NORMAL = 4,
  TRANSCODE_FAIL = 3,
  AUDIT_WAIT = 5,
  AUDIT_FAIL = 6
};
