import ajax from 'zan-pc-ajax';

/* eslint-disable camelcase */
interface IAreaMap extends Record<string, any> {
  city_list: Record<number, string>;
  county_list: Record<number, string>;
  province_list: Record<number, string>;
}

interface IAreaItem {
  id: string | number;
  title: string;
  children?: IAreaItem[];
}

let pending: Promise<IAreaItem[]> | null = null;
const SOURCE = 'https://www.youzan.com/v2/common/region/all.jsonp';

export default function getAreaList(): Promise<IAreaItem[]> {
  if (pending === null) {
    pending = ajax<IAreaMap>({
      url: SOURCE,
      dataType: 'jsonp',
    }).then(convertAreaMap2List);
  }
  return pending;
}

function convertAreaMap2List(areaMap: IAreaMap): IAreaItem[] {
  const { province_list, city_list, county_list } = areaMap;
  const res: IAreaItem[] = [];
  Object.entries(province_list).forEach(([provinceCode, name]) =>
    res.push({
      id: provinceCode,
      title: name,
      children: [],
    }),
  );

  Object.entries(city_list).forEach(([cityCode, name]) => {
    const currentProvinceIndex = getProvinceOrCityIndex(cityCode, res);
    if (currentProvinceIndex > -1) {
      res[currentProvinceIndex].children!.push({
        id: cityCode,
        title: name,
        children: [],
      });
    }
  });

  Object.entries(county_list).forEach(([countyCode, name]) => {
    const currentProvinceIndex = getProvinceOrCityIndex(countyCode, res);
    if (currentProvinceIndex > -1) {
      const currentProvinceList = res[currentProvinceIndex].children || [];
      const currentCityIndex = getProvinceOrCityIndex(countyCode, currentProvinceList, true);
      if (currentCityIndex > -1) {
        currentProvinceList[currentCityIndex].children!.push({
          id: countyCode,
          title: name,
        });
      }
    }
  });

  return res;
}

function getProvinceOrCityIndex(code: string, tempRes: IAreaItem[], isCity?: boolean): number {
  const sliceLength = isCity ? 4 : 2;
  const fillString = isCity ? '00' : '0000';
  const provincePrefix = code.slice(0, sliceLength);
  const provinceCode = provincePrefix + fillString;
  return tempRes.findIndex(item => String(item.id) === provinceCode);
}
