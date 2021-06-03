import { ReactNode } from 'react';

export interface IAbnormalCodePopProps {
  kdtId: number;
  onConfirm?: Function;
  mode?: 'educlass' | 'schedule' | 'appointment'
  joinState: {
    description: string;
    choose: boolean;
    check: {
      checkCode: number;
      classCheckInfo: any;
      lessonCheckInfo: any;
      assetCheckInfo: any;
    }
  },
  student: {
    id: number;
    [index: string]: any;
  }
  [index: string]: any;
}

export interface IAbnormalCodeCofnig {
  code: AbnormalCode;
  desc: string;
  popTips: (data: IAbnormalCodePopProps) => ReactNode
}
