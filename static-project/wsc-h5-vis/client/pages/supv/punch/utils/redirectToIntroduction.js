import Args from 'zan-utils/url/args';
import * as SafeLink from '@youzan/safe-link';
import buildUrl from '@youzan/utils/url/buildUrl';

const global = window._global;
const kdtId = global.kdt_id || 0;
const alias = Args.get('alias') || '';

const redirectToIntroduction = () => {
  const params = {
    'kdt_id': kdtId,
    'alias': alias,
  };
  const url = buildUrl(
    Args.add('/wscvis/supv/punch/introduction', params),
    'h5',
    kdtId,
  );
  SafeLink.redirect({ url, kdtId, redirectType: 'replace' });
};

export default redirectToIntroduction;
