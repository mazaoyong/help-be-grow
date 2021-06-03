import { Dialog, Toast } from 'vant';
import PayService from './pay-service';
import BillService from './bill-service';

class BillManager {
  constructor(store, router, vm) {
    this.$store = store;
    this.$commit = store.commit;
    this.$dispatch = store.dispatch;
    this.$router = router;
    this.$dialog = Dialog;
    this.$toast = Toast;
    this.$vm = vm;
    this.payService = new PayService(store, vm);
    this.billService = new BillService(store, router);
  }

  submitOrder() {
    return this.billService.createOrder();
  }

  startPay() {
    this.payService.startPay();
  }

  selectPayWay(data) {
    this.payService.onSelectPayWay(data);
  }
}

export default BillManager;
