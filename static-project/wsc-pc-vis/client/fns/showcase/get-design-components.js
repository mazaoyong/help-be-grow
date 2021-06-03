import map from 'lodash/map';
import forEach from 'lodash/forEach';
import isArray from 'lodash/isArray';
import {
  DesignComponents,
  DefaultDesignComponents,
  TakeAwayDesignComponents,
  NewTakeAwayDesignComponents,
  TopNavDesignComponents,
  PictorialMagazineDesignComponents,
} from 'apps/showcase/common/design-components';

// 传入自定义组件配置，同type的组件替换掉
function getMergedComponents(customConf) {
  const mergedArray = map(DesignComponents, item => {
    let newItem;
    forEach(customConf, customeItem => {
      if (customeItem.type === item.type) {
        newItem = customeItem;
      } else {
        newItem = item;
      }
    });
    return newItem;
  });
  return mergedArray;
}

/**
 * 获取design组件数组
 * @param {*} templateType
 */
export function getDesignComponents(templateType, customConf = []) {
  let components;
  if (templateType === 'default') {
    components = DefaultDesignComponents;
  } else if (templateType === 'take_away') {
    components = TakeAwayDesignComponents;
  } else if (templateType === 'tpl_new_take_away') {
    components = NewTakeAwayDesignComponents;
  } else if (templateType === 'top_nav') {
    components = TopNavDesignComponents;
  } else if (templateType === 'pictorial_magazine') {
    components = PictorialMagazineDesignComponents;
  } else if (isArray(customConf) && customConf.length > 0) {
    components = getMergedComponents(customConf);
  } else {
    components = DesignComponents;
  }
  return components;
}
