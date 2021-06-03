import './style.scss';
import { formatFilterOpts, formatQueries } from './ultis/index';

import VisFilter from './components/vis-filter';
import Grid from './components/vis-grid';
import VisList from './components/with-router';
import VisListWrapper from './components/vis-list-wrapper';
import VisSearch from './components/vis-search';

// combined compoennt
import VisFilterTable from './combined-components/filter-table';

// 升级zent7之后不用table了
const VisTable = VisListWrapper(Grid);
const VisGrid = VisListWrapper(Grid);

export default VisList;

export {
  VisFilter,
  VisFilterTable,
  VisGrid,
  VisList,
  VisSearch,
  VisTable,
  formatFilterOpts,
  formatQueries,
};
