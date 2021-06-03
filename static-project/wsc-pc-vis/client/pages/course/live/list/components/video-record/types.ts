export interface ILiveVideoRecordDTO {
  /** 人均观看时长 = 总时长 / 观看ip  (分钟数2位) */
  perWatchTime: string;
  /** 观看ip数 */
  watchIpCount: number;
  /** 直播名称 */
  name: string;
  /** 观看时长 */
  watchDuration: number;
  /** 人均观看次数 = 总次数 / 观看ip (观看次数1位) */
  perWatchCount: string;
  /** 观看次数 */
  watchCount: number;
}

export interface IPage<T> {
  total: number;
  content: T[];
}

export interface ILiveVideoSurveyDTO {
  /** 人均观看时长(分钟)(观看次数1位) */
  perWatchTime: string;
  /** 观看ip数 */
  watchIpCount: number;
  /** 剩余时长  */
  surplusWatchTime: number;
  /** 1: 正常 , 2: 补贴 */
  status: 1 | 2;
  /** 观看时长 */
  watchDuration: number;
  /** 明细 */
  liveVideoRecordList: IPage<ILiveVideoRecordDTO>;
  /** 更新时间 */
  updateTime: string;
}

export type ILiveVideoSurvey = Omit<ILiveVideoSurveyDTO, 'liveVideoRecordList'>;
export type ILiveVideoRecord = IPage<ILiveVideoRecordDTO>;
