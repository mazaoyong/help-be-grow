import { ICombinedFilterConf } from '@youzan/ebiz-components/es/types/easy-list';


export interface IListFilterProps {
  onSearch(values: Record<string, any>): void;
  config: ICombinedFilterConf[] | ICombinedFilterConf[][];
}

