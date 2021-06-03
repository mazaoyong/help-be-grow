import { IAudioWrapProps } from '../audio-wrap/types';

export type IAudioUploaderPreviewProps = Omit<IAudioWrapProps, 'src'> & {
  url: string;
  showDeleteIcon?: boolean;
  onDelete?: () => void;
}
