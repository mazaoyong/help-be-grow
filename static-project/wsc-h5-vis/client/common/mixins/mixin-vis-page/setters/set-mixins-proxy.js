import isFunction from 'lodash/isFunction';

function getDataSetter(mixin, target) {
  if (!mixin.data) {
    return () => { throw new Error('不能修改非 mixin 的 Data 中成员的值'); };
  }

  if (isFunction(mixin.data)) {
    const data = mixin.data.apply(target);
    const allowedSettedKeys = Object.keys(data);
    return function dataSetter(obj, prop, value) {
      if (allowedSettedKeys.indexOf(prop) < 0) {
        throw new Error('不能修改非 mixin 的 Data 中成员的值');
      }

      obj[prop] = value;
    };
  } else {
    throw new Error('Data 选项必须是一个返回对象的函数');
  }
}

export default function setMixinProxy(page) {
  const { $options: { mixins = [] } } = page;

  mixins.forEach(mixin => {
    if (mixin.name && !page[mixin.name]) {
      // eslint-disable-next-line
      const mixinName = mixin.name.replace(/\-(\w)/g, (m, p1) => p1.toUpperCase());
      if (window._isNativeProxy) {
        const handler = {
          get(obj, prop) {
            return obj[prop];
          },
          set: getDataSetter(mixin, page),
        };
        try {
          page[mixinName] = new Proxy(page, handler);
        } catch (err) {
          page[mixinName] = page;
        }
      } else {
        page[mixinName] = page;
      }
    }
  });
};
