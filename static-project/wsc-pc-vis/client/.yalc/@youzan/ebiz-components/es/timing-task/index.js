'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var TimingTask =
/*#__PURE__*/
function () {
  function TimingTask() {
    var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10000;
    var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;

    _classCallCheck(this, TimingTask);

    _defineProperty(this, "time", void 0);

    _defineProperty(this, "count", void 0);

    _defineProperty(this, "sum", void 0);

    _defineProperty(this, "timer", void 0);

    _defineProperty(this, "interval", void 0);

    this.time = time;
    this.interval = interval;
    this.count = 0;
    this.sum = time / 500;
    this.timer = null;
  }

  _createClass(TimingTask, [{
    key: "start",
    value: function start(cb) {
      var _this = this;

      if (!this.interval || this.time < this.interval) {
        this.interval = this.time;
      }
      /* eslint-disable-next-line */


      return new Promise(function (_resolve, reject) {
        _this.timer = setInterval(function () {
          _this.count++;
          cb();

          if (_this.count >= _this.sum) {
            _this.stop();

            reject();
          }
        }, _this.interval);
      });
    }
  }, {
    key: "stop",
    value: function stop() {
      clearInterval(Number(this.timer));
    }
  }]);

  return TimingTask;
}();

module.exports = TimingTask;
