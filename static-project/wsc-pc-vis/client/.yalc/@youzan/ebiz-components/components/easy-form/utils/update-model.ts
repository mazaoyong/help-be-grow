import { FieldModel } from 'zent';
import isNil from 'lodash/isNil';
export type NoticeFuncType = (curValue: any, nextValue: any) => void;

function executeModelValidators(model: FieldModel<any>) {
  if (model.validators.length) {
    model.isTouched = true;
    model.validate();
  }
}
export function updateModel(
  valueModel: FieldModel<any>,
  statusModel: FieldModel<any>,
  payload: any,
  notice: NoticeFuncType
) {
  const prevValue = valueModel.getRawValue();
  const prevStatus = statusModel.getRawValue();
  notice(prevValue, payload);
  const { value, status, props } = payload;
  if (!isNil(value) && prevValue !== value) valueModel.patchValue(value);
  if (!isNil(status) || !isNil(props)) {
    const dumpStatus = status || {};
    const dumpProps = props || {};
    statusModel.patchValue({
      ...prevStatus,
      ...dumpStatus,
      ...dumpProps,
    });
  }
  executeModelValidators(valueModel);
}
