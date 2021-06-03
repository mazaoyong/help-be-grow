import { YZ_NODE_ENV } from '../../utils/constants';

export function invariant<AssertType = any>(
  condition: () => boolean,
  errorMsg: string,
  _assertVariable?: any
): _assertVariable is AssertType {
  try {
    const res = condition();
    if (YZ_NODE_ENV !== 'prod') {
      try {
        if (!res) throw new Error(errorMsg);
        return res;
      } catch (err) {
        throw new Error(err);
      }
    }
    return res;
  } catch (err) {
    if (YZ_NODE_ENV === 'prod') return true;
    throw err;
  }
}
