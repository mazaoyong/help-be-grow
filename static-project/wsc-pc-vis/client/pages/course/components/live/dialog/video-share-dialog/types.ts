export interface ILiveVideoEnterInfoDTO {
  channelPassword?: string;
  url?: string;
  channelId?: string;
  pushStreamUrl?: string;
}

export interface IAssistantEntryItemDTO {
  account: string;
  channelPassword: string;
  name: string;
  channelId: string;
}

export interface ILiveAssistantEntryDTO {
  assistantEntryItemDTOList?: IAssistantEntryItemDTO[];
  url?: string;
}

export interface ILiveAndAssistantLinkDTO {
  // 讲师端链接
  videoEnterInfoDTO?: ILiveVideoEnterInfoDTO;
  // 助教链接
  assistantEntryDTO?: ILiveAssistantEntryDTO;
}

export enum ActorType {
  /** 助教 */
  ASSISTANT = 1,
  /** 嘉宾 */
  GUEST = 2
}

export interface IAddAssistantOrGuestParams {
  alias: string;
  name: string;
  actor?: string;
  actorType: ActorType;
}

export interface IUpdateAssistantOrGuestParams {
  alias: string;
  account: string;
  name?: string;
  actor?: string;
}

export interface IDeleteAssistantOrGuestParams {
  alias: string;
  account: string;
}
