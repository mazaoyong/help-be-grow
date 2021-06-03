import { IImgValue } from '../img-uploader/types';
import { IVideoValue } from '../video-uploader/types';
export interface IUploaderViewContainerProps {
  anchor: string;
  className?: string;
};

export type IImgValueProps = IImgValue & {
  uploaderFileIndex: number;
};

export type IVideoValueProps = IVideoValue & {
  uploaderFileIndex: number;
};
