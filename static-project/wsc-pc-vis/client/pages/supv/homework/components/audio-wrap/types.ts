export interface IAudioWrapProps {
  src: string;
  name?: string;
  audioId?: number;
  singlePlay?: boolean;
  width: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeupdate?: (i: any) => void;
  onError?: () => void;
};
