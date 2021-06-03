import Args from '@youzan/utils/url/args';
import { format } from 'date-fns';

export default {
  alias: Args.get('alias') || '',
  taskDate: format(new Date(), 'YYYY/MM/DD'),
  taskCount: 0,
  startAt: '',
  endAt: '',
  dateStatusList: [],
  taskName: '',
  taskContent: [],
  listDate: '',
};
