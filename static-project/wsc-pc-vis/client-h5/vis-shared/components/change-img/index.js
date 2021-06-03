import Vue from 'vue';
import VisChangeImg from './ChangeImg.vue';

let instance;

const initInstance = () => {
  instance = new (Vue.extend(VisChangeImg))({
    el: document.createElement('div'),
  });

  instance.$on('input', value => {
    instance.value = value;
  });

  instance.$on('change', (list) => {
    list && (instance.isLoading = true);
  });

  document.body.appendChild(instance.$el);
};

const ChangeImg = options => {
  return new Promise((resolve, reject) => {
    if (!instance) {
      initInstance();
    }
    Object.assign(instance, {
      resolve,
      reject,
      ...Object.assign(ChangeImg.defaultOptions, options),
    });
  });
};

ChangeImg.defaultOptions = {
  show: true,
  title: '',
  imgs: [],
  callback: (action, res) => {
    const callMap = {
      success: 'resolve',
      error: 'reject',
    };
    callMap[action] && instance[callMap[action]](res);
    instance.isLoading = false;
    instance.show = false;
  },
};

export default ChangeImg;
