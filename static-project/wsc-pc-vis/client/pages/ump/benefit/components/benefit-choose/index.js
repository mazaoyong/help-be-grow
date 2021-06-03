import assign from 'lodash/assign';
import { ChooseDialog } from '@youzan/react-components';
import { isInStoreCondition } from 'fns/chain';
import columnConfig from './column-config';
import contentConfig from './content-config';
import liveConfig from './live-config';

export default function chooseContent(options, type) {
  const tabColumn = assign({}, columnConfig(options.config), options);
  const tabContent = assign({}, contentConfig(options.config), options);
  const tabLive = assign({}, liveConfig(options.config), options);
  if (isInStoreCondition({
    supportSingleStore: true,
    supportRetailSingleShop: true,
    supportHqStore: true
  })) {
    if (type === 'content') {
      return ChooseDialog({ tabs: [tabContent, tabColumn, tabLive] });
    } else if (type === 'live') {
      return ChooseDialog({ tabs: [tabLive, tabColumn, tabContent] });
    }
    return ChooseDialog({ tabs: [tabColumn, tabContent, tabLive] });
  } else {
    if (type === 'content') {
      return ChooseDialog({ tabs: [tabContent, tabColumn] });
    }
    return ChooseDialog({ tabs: [tabColumn, tabContent] });
  }
}
