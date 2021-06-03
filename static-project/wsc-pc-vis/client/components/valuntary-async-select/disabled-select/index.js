/**
 * Index
 */

import Select from './Select';
import Option from './components/Option';
import SelectTrigger from './trigger/BaseTrigger';
import InputTrigger from './trigger/InputTrigger';

Select.Option = Option;
Select.SelectTrigger = SelectTrigger;
Select.InputTrigger = InputTrigger;

export { Option, SelectTrigger, InputTrigger };

export default Select;
