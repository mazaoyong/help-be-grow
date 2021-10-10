export interface ISearchListItem {
  appName: string;
  controller: string;
  javaApi: string;
  jsonApi: string;
  navigator: string[];
  service: string;
}

export interface ISearchCardProps {
  keyword: string;
  searchItem: ISearchCardItem[];
}

export interface ISearchCardItem {
  title: string;
  content: string[];
}

// 日志接口数据
export interface IUpdateLogItem {
  appName: string;
  info: string;
  spend: number;
  status: number;
  updateEndTime: number
}

// 项目配置数据
export interface IPrjConfigItem {
  id: number;
  label: string;
  name: string;
}