/** 用户基础信息 */
export interface IBaseUserInfo {
  /** 用户昵称 */
  niackName: string;
  /** 用户头像 */
  avatar: string;
  /** 用户 userId */
  userId: number;
}

export interface IBoostUser {
  avatar: string;
  helpTime: string;
  helperUserId: number;
  name: string;
}
