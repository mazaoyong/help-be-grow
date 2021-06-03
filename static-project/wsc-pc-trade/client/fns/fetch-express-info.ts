import { makeRequest } from './make-request';

interface IExpressCompanyInfo {
  code: string;
  common_flag: number | null;
  display: number;
  first_letter: string;
  id: number;
  kd8_code: string | null;
  kd_niao_code: string | null;
  name: string;
}

interface IFetchExpressInfoRes {
  all: {
    [key: string]: IExpressCompanyInfo;
  };
  common: IExpressCompanyInfo[];
  used: IExpressCompanyInfo[];
}

/**
 * 这个方法获取快递公司信息，注入到 window._global.optimizedExpress
 */
export function fetchExpressInfo() {
  if (!window._global?.optimizedExpress) {
    if (window._global) {
      window._global.optimizedExpress = _global.express || {};
    }
  }

  return makeRequest<IFetchExpressInfoRes>('/v4/trade/delivery/allExpressInfo.json')
    .then(data => {
      // 老代码逻辑直接拷贝过来
      const hashExpress = {};
      let counts = 0;
      const concat = (from, to, unique, str?: string) => {
        let len;
        switch (str) {
          case 'used':
            len = from.length > 4 ? 4 : from.length;
            break;
          case 'common':
            len = from.length > 8 ? 8 : from.length;
            break;
          default:
            len = from.length;
        }
        let i = 0;
        for (; i < len; i++) {
          if (!(from[i].name in unique)) {
            unique[from[i].name] = '';
            to[++counts] = from[i];
          }
        }
      };

      const usedHash = {};
      const commonHash = {};

      const toHash = (from, to) => {
        const len = from.length;
        let i = 0;
        for (; i < len; i++) {
          to[from[i].name] = from[i];
        }
      };

      toHash(data.used, usedHash);
      toHash(data.common, commonHash);

      let key;
      for (key in usedHash) {
        if (usedHash[key].name in commonHash) {
          delete usedHash[key];
        }
      }

      const toArr = (fromObj, to) => {
        // eslint-disable-next-line guard-for-in
        for (key in fromObj) {
          to.push(fromObj[key]);
        }
      };

      const arrUsed = [];
      const arrCommon = [];
      toArr(usedHash, arrUsed);
      toArr(commonHash, arrCommon);

      concat(arrUsed, window._global.optimizedExpress, hashExpress, 'used');
      concat(arrCommon, window._global.optimizedExpress, hashExpress, 'common');
      let start = 65;
      let index = '';
      for (; start < 91; start++) {
        index = String.fromCharCode(start);
        if (data.all[index]) {
          concat(
            data.all[String.fromCharCode(start)],
            window._global.optimizedExpress,
            hashExpress,
          );
        }
      }
    })
    .catch(e => {
      // eslint-disable-next-line no-console
      console.error('Error: Express information fetch failed.', e);
    });
}

export function getExpressData() {
  const optimizedExpress = window._global.optimizedExpress || {};
  const optimizedExpressData = Object.keys(optimizedExpress).map(key => {
    return {
      value: optimizedExpress[key].id as number,
      text: optimizedExpress[key].name as string,
    };
  });
  return optimizedExpressData;
}
