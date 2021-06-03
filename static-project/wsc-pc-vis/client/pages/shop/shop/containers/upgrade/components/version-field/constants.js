import { versionMap } from '../../constants';
export const getVersionData = () => {
  const NEW_PERIODDATA = [
    {
      title: '基础版',
      price: 6800,
      value: versionMap.BASIC,
    },
    {
      title: '专业版',
      price: 12800,
      value: versionMap.PREMIUN,
    },
  ];
  return NEW_PERIODDATA;
};
