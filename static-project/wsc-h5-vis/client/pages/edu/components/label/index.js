import Label from './index.vue';
import NewLabel from './label-van-icon';

Label.install = function(Vue) {
  Vue.component(Label.name, Label);
};

NewLabel.install = function(Vue) {
  Vue.component(NewLabel.name, NewLabel);
};

export default Label;
export const LabelVanIcon = NewLabel;
