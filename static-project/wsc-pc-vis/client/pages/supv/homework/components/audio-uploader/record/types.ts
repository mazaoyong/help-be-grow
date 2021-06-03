export enum RecordingStatus {
  UN_START = -2, // 未开始
  UPLOAD_FAIL = -1, // 录音上传失败
  UPLOADED = 0, // 录音上传成功
  RECORD_FINISH = 1, // 录音停止
  RECORD_PAUSE = 2, // 录音暂停
  RECORDING = 3 // 正在录音
}

export interface IRecordProps {
  isAscendCount?: Boolean;
  isContinuous?: Boolean;
  maxSize?: number;
  countTime: number;
  anchor: string;
  className?: string;
  formatName: (timestamp: string) => string;
  // ref?: any;
}

export interface IUploadVoiceProps {
  localId: number;
  file?: any;
  msgObj?: any;
  formatName: (timestamp: string) => string;
}
