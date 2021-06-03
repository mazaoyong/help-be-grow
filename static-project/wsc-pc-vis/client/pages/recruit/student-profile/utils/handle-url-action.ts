import Args from '@youzan/utils/url/args';
import { History, createHashHistory } from 'history';
import { openCustomProfileItem } from '../components/custom-profile-dialog';

function handleUrlAction(methods: {
  fetchList: any,
}) {
  const history: History = createHashHistory();
  const action = Args.get('action', history.getCurrentLocation().search);
  switch (action) {
    case 'OPEN_NEW': {
      openCustomProfileItem({
        type: 'ADD',
      })
        .then(() => {
          methods.fetchList({ current: 1 });
        });
      break;
    }
    default: break;
  }
}

export default handleUrlAction;
