import React from 'react';
import { Notify } from 'zent';
import { WithRouterProps } from 'react-router';
import { EasyList } from '@youzan/ebiz-components';
import { Button as SamButton } from '@youzan/sam-components';
import { IListProps, IListContext } from '@youzan/ebiz-components/es/types/easy-list';

// configs
import getGridConfig from './grid-config';
import {
  exportClue,
  getCampusList,
  getStaffList,
  ICampusOption,
  IStaffOption,
} from './grid-configs/config-base';

// utils
import useFetchList from './utils/use-fetch-list';
import useFilterConfig from './utils/use-filter-config';
import formatQuery from './utils/format-query';
import MapOptionsToTabs, { IPhaseCount } from './utils/map-options-to-tabs';
import useBatchComponents from './utils/use-batch-components';
import useBatchActions from './utils/use-batch-actions';
import useExportActions from './utils/use-export-actions';

// assets
import openAddClueDialog from '../components/add-dialog';
import { useConvertTime } from 'components/time-range-picker/hooks';
import { ICluePoolListProps } from './types';
import './styles.scss';
import { isEduHqStore } from '@youzan/utils-shop';

const { List, EasyGrid, Filter, Tabs } = EasyList;
const mapOptionsToTabs = new MapOptionsToTabs();
const CluePoolList: React.FC<ICluePoolListProps & WithRouterProps> = () => {
  const [staff, setStaff] = React.useState<IStaffOption[]>([]);
  const [currentCampus, setCampusKdtId] = React.useState(_global.kdtId);
  const [campusList, setCampusList] = React.useState<ICampusOption[]>([]);
  const [phaseCounts, setPhaseCounts] = React.useState<IPhaseCount[]>([]);
  const ListRef = React.useRef<IListContext | null>(null);

  const [fetchList, pageType] = useFetchList();

  const afterAdd = React.useCallback((clueId: number, userId: number) => {
    // todo redirect
    const path = userId ? (userId === window._global.userId ? 'mine' : 'all') : 'pool';
    if (clueId) {
      window.location.href =
        window._global.url.v4 + '/vis/edu/page/clue/' + path + '#/detail/' + clueId;
    } else {
      if (ListRef.current) ListRef.current.action.refresh();
    }
  }, []);
  const handleAddClue = React.useCallback(() => {
    openAddClueDialog(pageType, afterAdd);
  }, [afterAdd, pageType]);

  const handleSubmit = React.useCallback<IListProps['onSubmit']>(
    (filter) => {
      const { page, pageSize, sortBy, sortType, ...restFilter } = filter;
      const request = {
        pageNumber: page,
        pageSize,
        sort: {
          orders: [
            {
              property: sortBy || 'recordUpdatedAt',
              direction: String(sortType || 'desc').toUpperCase(),
            },
          ],
        },
      };
      const clueInfoQuery = formatQuery(restFilter, pageType);
      return fetchList({ request, clueInfoQuery }).then(({ clues, phaseCounts }) => {
        setPhaseCounts(phaseCounts);
        return {
          pageInfo: { page, total: clues.total },
          dataset: clues.content,
        };
      });
    },
    [fetchList, pageType],
  );

  // 线索导出
  const handleExport = React.useCallback((filter) => {
    const filterOptions = formatQuery(filter.getCurrentValues(), pageType);
    return exportClue(filterOptions, pageType);
  }, [pageType]);
  const exportActions = useExportActions(pageType, handleExport);

  // 获取相应的filter-config
  const filterConfig = useFilterConfig({ campusList, staff, pageType, setSelectCampus: setCampusKdtId });
  const tabConfig = React.useMemo(() => mapOptionsToTabs.getTabConfigs(pageType, phaseCounts), [
    pageType,
    phaseCounts,
  ]);

  React.useEffect(() => {
    getCampusList().then(setCampusList);
  }, []);
  React.useEffect(() => {
    if (pageType === 'all' && !isEduHqStore) {
      getStaffList().then(setStaff);
    }
  }, [currentCampus, pageType]);

  // batch actions
  const batchActions = useBatchActions({ pageType, listContext: ListRef });
  const renderBatchComponents = useBatchComponents(pageType, batchActions, {
    nodataHint: '请至少选择一条线索',
  });

  return (
    <div className="clue-list__container">
      <List mode="hash" ref={ListRef} onSubmit={handleSubmit} onError={Notify.error}>
        <section className="clue-list__header">
          <SamButton name="编辑" type="primary" onClick={handleAddClue}>
            添加线索
          </SamButton>
          <Filter
            config={filterConfig}
            formatQueries={handleFormatQueries}
            actionsOption={exportActions}
          />
          <Tabs name="phase" defaultValue="0" tabs={tabConfig} />
        </section>
        <EasyGrid
          easySelection
          customColumns
          customColumnsCacheKey="clue"
          customColumnsDialogTitle="配置表头"
          rowKey="clueId"
          scroll={{ x: 1500 }}
          className="clue-list__table"
          pageSizeOptions={[20, 30, 50]}
          columns={getGridConfig(pageType)}
          batchRender={renderBatchComponents}
        />
      </List>
    </div>
  );
};

export default CluePoolList;

const handleFormatQueries = (queries: Record<string, any>) => {
  const formattedQueries: Record<string, any> = {};
  Object.entries(queries).forEach(([key, value]) => {
    switch (key) {
      case 'recordDateRange':
      case 'createAtDateRange':
      case 'revisitDateRange':
        if (Array.isArray(value)) {
          const [selectedTime, selectedType] = value;
          const values = useConvertTime(selectedTime as any);
          formattedQueries[key] = [
            values,
            selectedType && Number(selectedType),
          ];
        }
        break;
      case 'kdtId':
        if (Array.isArray(value)) {
          formattedQueries.kdtId = value.map(Number);
        }
        break;
      default:
        if (value) {
          formattedQueries[key] = value;
        }
        break;
    }
  });
  return formattedQueries;
};
