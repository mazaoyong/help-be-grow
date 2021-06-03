interface ICourseConfProps {
  key: string;
  [index: string]: any;
}

const courseSettingFilter = (confArray: ICourseConfProps[], omitKeys: string[] = []) => {
  if (!Array.isArray(confArray)) {
    return confArray;
  }
  return confArray.filter(item => !omitKeys.includes(item.key));
};

export default courseSettingFilter;
