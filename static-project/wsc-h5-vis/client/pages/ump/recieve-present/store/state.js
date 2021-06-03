import get from 'lodash/get';
import args from '@youzan/utils/url/args';

const orderNo = args.get('orderNo');
const alias = args.get('alias');
const presentSource = args.get('presentSource');
const presentQueryParams = args.get('presentQueryParams');
const receiveStatus = args.get('receiveStatus');

const state = {
  env: get(_global, 'env'),
  orderNo,
  alias,
  presentQueryParams,
  presentSource,
  receiveStatus,
  loading: true,
  success: true,
  list: {
    course: [],
    knowledge: [],
    goods: [],
  },
};

export default state;
