import Component from './Toast.vue';
import Vue from 'vue';

let anchor: Element;
const ANCHOR_ID = 'vis-toast-anchor';
let toast: any;

function createAnchor() {
  if (anchor) return anchor;

  const anchorElem = document.createElement('div');
  anchorElem.id = ANCHOR_ID;
  document.body.appendChild(anchorElem);

  anchor = anchorElem;

  return anchor;
}

function show(type: string, message: string) {
  return new Promise((resolve) => {
    if (anchor && toast) {
      toast.type = type;
      toast.message = message;
      toast.show = true;
      return;
    }

    const newAnchor = createAnchor();

    toast = new (Vue.extend(Component))({
      propsData: {
        type,
        message,
        closed: () => {
          resolve();
        },
      },
    });
    toast.$mount(newAnchor);
  });
}

export function info(message: string) {
  return show('info', message);
}

export function success(message: string) {
  return show('success', message);
}

export function error(message: string) {
  return show('error', message);
}

function Toast(message: string) {
  return info(message);
}

Toast.info = info;
Toast.success = success;
Toast.error = error;

export default Toast;
