import { ICombinedFilterConf, IOption } from '@youzan/ebiz-components/es/types/easy-list';
import { ICategoryEnum } from '../../../../constant';

interface ITabStatistic {
  total: number;
  study: number;
  finish: number;
  trial: number;
}

export type IGetFilterConfigs = (params: {
  options: IOption[];
  defaultValues: Record<string, any>;
}) => ICombinedFilterConf[] | ICombinedFilterConf[][];

export interface IHeaderProps {
  category: ICategoryEnum;
  total: number;
  statistic: ITabStatistic;
  defaultValues: Record<string, any>;
  onSearch(values?: Record<string, any>): void;
}
