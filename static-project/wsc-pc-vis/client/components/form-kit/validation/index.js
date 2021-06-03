import basicRules from './rules';

let scrollTid = null;
const scrollToError = () => {
  if (scrollTid) {
    clearTimeout(scrollTid);
  }
  scrollTid = setTimeout(() => {
    const errorBoundingTop = [].reduce.call(
      document.querySelectorAll('.widget-form__group--error'),
      (next, elem) => {
        return Math.min(elem.getBoundingClientRect().top, next);
      },
      Infinity
    );
    if (errorBoundingTop === Infinity) {
      return;
    }
    window.scrollTo(0, window.scrollY + errorBoundingTop - 10);
  }, 50);
};

export default class Validation {
  constructor(host, validationList, options = { scrollToError: true }) {
    this.result = {};
    this.rulesMap = {};
    this.changedMap = {};
    this.childValidtion = {};
    this.host = host;
    this.options = options;

    Object.keys(validationList).forEach(key => {
      this.result[key] = true;
      this.rulesMap[key] = (...args) => {
        let rules = validationList[key];
        if (!(rules instanceof Array)) {
          rules = [rules];
        }
        let result = true;
        rules.every(rule => {
          let ruleResult;
          const type = rule.type ? rule.type : rule;
          const msg = rule.msg;
          if (typeof rule === 'function') {
            ruleResult = rule(...args);
          } else if (basicRules[type]) {
            ruleResult = basicRules[type](...args);
          } else {
            return true;
          }
          if (ruleResult === undefined || ruleResult === true) {
            return true;
          }
          result = msg || ruleResult;
          return false;
        });
        this.result[key] = result;
        return result;
      };
    });
  }

  getResult() {
    return this.result;
  }

  markChanged(name) {
    this.changedMap[name] = true;
  }

  reset() {
    this.result = {};
    this.changedMap = {};
    this.childValidtion = {};
  }

  run(name, value, state) {
    state = {
      ...state,
      [name]: value,
    };
    Object.keys(this.rulesMap).forEach(key => {
      if (name === key) {
        this.result[key] = this.rulesMap[key](value, state, this.changedMap);
        this.handleMigrate();
        return;
      }
      if (this.changedMap[key]) {
        this.result[key] = this.rulesMap[key](state[key], state, this.changedMap);
        this.handleMigrate();
      }
    });
  }

  handleMigrate() {
    Object.keys(this.result).forEach(key => {
      const field = this.result[key];
      if (!field) {
        return;
      }
      if (typeof field === 'object' && field.target && field.msg) {
        delete this.result[key];
        this.result[field.target] = field.msg;
      }
    });
  }

  merge(name, validation) {
    this.childValidtion[name] = validation;
  }

  remove(name) {
    delete this.childValidtion[name];
  }

  bind(checkTarget) {
    this.checkTarget = checkTarget;
  }

  isValid(value) {
    Object.keys(this.rulesMap).forEach(key => {
      this.changedMap[key] = true;
    });
    this.run(null, null, value || this.checkTarget || this.host.state);
    this.host.forceUpdate();
    const result = this.getResult();

    const keyResult = Object.keys(result).every(key => typeof result[key] !== 'string');

    let childResult = true;
    Object.keys(this.childValidtion).forEach(key => {
      if (!this.childValidtion[key].isValid()) {
        childResult = false;
      }
    });

    const final = keyResult && childResult;

    if (this.options.scrollToError && !final) {
      scrollToError();
    }

    return final;
  }
}
