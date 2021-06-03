import React from 'react';
import get from 'lodash/get';
import { EasyList } from '@youzan/ebiz-components';
import { ITabsConfig } from '@youzan/ebiz-components/es/types/easy-list';

const { Tabs } = EasyList;

interface IProps {
  tabs: ITabsConfig[];
  defaultValues: Record<string, any>;
  onChange: (val: object) => any;
}

const StatisticTabs: React.FC<IProps> = (props) => {
  const defaultActiveTab = React.useMemo(() => get(props, 'defaultValues.learnStatus', '0'), [
    props,
  ]);

  return (
    <Tabs
      name="learnStatus"
      defaultValue={String(defaultActiveTab)}
      tabs={props.tabs}
      onChange={(learnStatus) => props.onChange({ ...props.defaultValues, learnStatus })}
    />
  );
};

export default StatisticTabs;
