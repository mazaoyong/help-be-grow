import { Tabs as ZentTabs, ITab } from 'zent';
import React from 'react';
import find from 'lodash/find';
import get from 'lodash/get';

import { adaptorConstructor } from './constant';
import { ITabsProps, ITabsConfig } from '../../types/filter';

type TabConfigsWithId = ({ id: number } & ITabsConfig)[];

const Tabs = React.forwardRef<any, ITabsProps>(function TabsWithRef(props, ref) {
  const { type = 'card', tabs, name, defaultValue, onChange } = props;
  const [init, setInit] = React.useState(false);
  // 初始化adaptor提交easy-list
  const adaptor = React.useMemo(() => adaptorConstructor(props), [props]);
  const orderTabs = React.useMemo<TabConfigsWithId>(
    () =>
      tabs.map((tab, index) => {
        return Object.assign({}, tab, { id: index });
      }),
    [tabs]
  );
  const [activeId, setActiveId] = React.useState<number>(() =>
    getDefaultActiveId(orderTabs, defaultValue)
  );

  const handleTabChange = React.useCallback(
    (curId) => {
      setActiveId(curId);
      const target = find(orderTabs, (tab) => tab.id === curId);
      if (target) {
        const value = target.value;
        onChange && onChange(value);
        if (adaptor.afterSubmit) {
          adaptor.afterSubmit({ [name]: value });
        }
      }
    },
    [adaptor, name, onChange, orderTabs]
  );

  React.useEffect(() => {
    const initialValue = get(props, `${adaptor.initValuePath}.${name}`);
    if (!init && initialValue) {
      const activeId = getDefaultActiveId(orderTabs, initialValue);
      setInit(true);
      setActiveId(activeId);
    }
  }, [name, props, init, orderTabs, adaptor.initValuePath]);

  const zentTabs = React.useMemo<ITab<any>[]>(() => {
    return orderTabs.map((tab) => {
      const { id: panelId, label, disabled = false } = tab;
      return {
        key: panelId,
        title: label,
        disabled,
      };
    });
  }, [orderTabs]);

  return (
    <div className="easy-filter__tabs-box" data-testid="easy-filter-tabs">
      <ZentTabs
        ref={ref}
        activeId={activeId}
        type={type}
        onChange={handleTabChange}
        tabs={zentTabs}
      />
    </div>
  );
});

function getDefaultActiveId(tabs: TabConfigsWithId, defaultValue: any): number {
  const target = find(tabs, (tab) => tab.value === defaultValue);
  if (target) {
    return target.id;
  }
  return -1;
}

export default Tabs;
