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