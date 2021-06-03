import { createStore, applyMiddleware } from 'redux';
import { createMiddleware } from 'zan-shuai';
import { createLogger } from 'redux-logger';
import { Actions } from 'zan-shuai';
import defaultTo from 'lodash/defaultTo';
import isEmpty from 'lodash/isEmpty';
import findIndex from 'lodash/findIndex';
import find from 'lodash/find';
import assign from 'lodash/assign';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';

import { isExpectedDesginType } from './utils/design-type';
import { stripUUID } from './utils/strip-uuid';

import componentMap from './component-map';
import { getUUIDFromValue, validateComponentValue } from './common/helper';
import { checkCompatibleBrowser } from './common/compatible-browser';

export default class API {
  // 初始化store
  configureStore(store) {
    const middlewares = [createMiddleware()];
    /* eslint-disable */
    if (__DEBUG__) {
      middlewares.push(
        createLogger({
          level: 'info',
          diff: true,
          logErrors: false,
          duration: true,
          collapsed: true,
        }),
      );
    }

    return createStore(store, applyMiddleware(...middlewares));
  }

  // 校验最后的InstList字段
  validateInstList(instList, comEditors) {
    return new Promise((resolve, reject) =>
      Promise.all(
        instList.map(v => {
          const id = getUUIDFromValue(v);
          const { type } = v;
          const comp = find(comEditors, c => isExpectedDesginType(c, type));
          // 假如组件设置了 editable: false，不触发校验 目前用不到
          // comp 为undefined 则不是新版的编辑器，不触发校验
          if (!comp || !defaultTo(comp.editable, true)) {
            return Promise.resolve({ [id]: {} });
          }

          return validateComponentValue(v, v, {}, comEditors).then(errors => {
            return { [id]: errors };
          });
        }),
      ).then(validationList => {
        const validations = assign({}, ...validationList);

        // 设置编辑器validations
        Actions.editorsState.setEditorValidations(validations);

        // 跳转到第一个有错误的组件
        const hasValidateError = v => !isEmpty(v[Object.keys(v)[0]]);
        const errorIndex = findIndex(validationList, hasValidateError);
        const firstError = get(validationList, `[${errorIndex}]`);
        if (firstError) {
          // this.scrollToPreviewItem(errorIndex);
          // 在激活错误的组件编辑
          window.postMessager.emit('activeIndex', errorIndex);
          Actions.previewState.setCurrentEditInstIndex(errorIndex);
        }

        // 过滤所有错误信息，将数组合并为一个对象，key 是每个组件的 id
        const validationErrors = validationList.filter(hasValidateError);
        const hasError = !isEmpty(validationErrors);

        if (!hasError) {
          resolve();
        } else {
          reject(
            validationErrors.reduce((err: any, v: any) => {
              const key = Object.keys(v)[0];
              if (key) {
                err[key] = v[key];
              }

              return err;
            }, {}),
          );
        }
      }),
    );
  }

  registerDecorateModule(componentName) {
    const component = componentMap[componentName];
    return component;
  }

  // 获取纯净的InstList, 去掉uuid字段
  getPureInstList(instList) {
    return stripUUID(cloneDeep(instList));
  }

  checkCompatibleBrowser() {
    checkCompatibleBrowser();
  }
}
