import MainWidget from './Main.vue';

export default class Extension {
  constructor(options) {
    this.ctx = options.ctx;
  }

  static widgets = {
    Main: MainWidget,
  };
}
