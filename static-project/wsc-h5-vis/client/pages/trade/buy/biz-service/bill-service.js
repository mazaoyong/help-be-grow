import { Dialog, Toast } from 'vant';
import validator from '../common/validator';
import { promiseIterator } from '../utils/promise-iterator';

class BillService {
  constructor({ state, getters, commit, dispatch }, router) {
    this.state = state;
    this.getters = getters;
    this.$commit = commit;
    this.$dispatch = dispatch;
    this.$router = router;
    this.$dialog = Dialog;
    this.$toast = Toast;
    this.preBillProcessors = [];
    this.postBillProcessors = [];
  }

  createOrder() {
    // 下单前处理流程准备
    this.prepareCreateOrder();
    let orderRet = null;
    return new Promise((resolve, reject) => {
      promiseIterator(this.preBillProcessors)
        .then(res => {
          if (res) {
            return this.$dispatch('FETCH_POST_CREATE_ORDER');
          } else {
            reject(false);
          }
        })
        .then(orderResult => {
          orderRet = orderResult;
          // 创建订单后置处理器
          return promiseIterator(this.postBillProcessors, orderResult);
        })
        .then(res => {
          if (res) {
            return resolve(orderRet);
          } else {
            reject(false);
          }
        })
        .catch(error => {
          reject(error || false);
        });
    });
  }

  /** 下单前处理流程准备 */
  prepareCreateOrder() {
    this.clearPreBillProcessor();
    this.clearPostBillProcessor();

    // 添加参数处理器
    this.addPreBillProcessor(this._handleValidateParams.bind(this));

    // 电商云下单前钩子
    this.addPreBillProcessor(this._handleECloudBeforeCreateOrderHook.bind(this));

    // 下单后的处理器
    this.addPostBillProcessor(this._handleAfterCreateOrder.bind(this));
    this.addPostBillProcessor(this._handleAfterCreateOrderAsync.bind(this));
  }

  addPreBillProcessor(processor) {
    this.preBillProcessors.push(processor);
  }

  clearPreBillProcessor() {
    this.preBillProcessors = [];
  }

  addPostBillProcessor(processor) {
    this.postBillProcessors.push(processor);
  }

  clearPostBillProcessor() {
    this.postBillProcessors = [];
  }

  _handleValidateParams() {
    return new Promise((resolve, reject) => {
      validator({
        state: this.state,
        getters: this.getters,
        dispatch: this.$dispatch,
        commit: this.$commit,
      })
        ? resolve(true)
        : reject(false);
    });
  }

  _handleECloudBeforeCreateOrderHook() {
    return new Promise((resolve, reject) => {
      this.$dispatch('CLOUD_BEFORE_CREATE_ORDER')
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          reject(false);
        });
    });
  }

  _handleAfterCreateOrder(orderResult) {
    this.$dispatch('CLOUD_AFTER_CREATE_ORDER', orderResult);
    return Promise.resolve(true);
  }

  _handleAfterCreateOrderAsync(orderResult) {
    return new Promise((resolve, reject) => {
      this.$dispatch('CLOUD_AFTER_CREATE_ORDER_ASYNC', orderResult)
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          reject(false);
        });
    });
  }
}

export default BillService;
