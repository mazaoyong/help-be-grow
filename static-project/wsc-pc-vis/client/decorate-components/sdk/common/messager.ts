export default class Messager {
  contentWindow: any;
  targetOrigin: any;

  constructor(contentWindow, targetOrigin: string) {
    this.contentWindow = contentWindow;
    this.targetOrigin = targetOrigin;
    window.decorateActions = {};
    window.addEventListener('message', this.handleMessageListener, false);
  }

  handleMessageListener(event) {
    // if (event.origin !== this.targetOrigin) {
    //   // eslint-disable-next-line
    //   console.warn(`${event.origin}不对应源${this.targetOrigin}`);
    //   return;
    // }
    if (!event.data || !event.data.type) {
      return;
    }
    const { type } = event.data;
    if (!window.decorateActions[type]) {
      // tslint:disable-next-line:no-console
      console.warn(`${type}: missing listener`);
      return;
    }
    window.decorateActions[type](event.data.value);
  }

  on(type: string, cb: () => void) {
    window.decorateActions[type] = cb;
    return this;
  }

  emit(type: string, value: any) {
    this.contentWindow.postMessage(
      {
        type,
        value,
      },
      this.targetOrigin,
    );
    return this;
  }

  destroy() {
    window.removeEventListener('message', this.handleMessageListener);
  }
}
