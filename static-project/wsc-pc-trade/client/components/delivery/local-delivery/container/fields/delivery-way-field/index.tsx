import React from 'react';
import { Form } from '@zent/compat';

import DeliveryWay, { IProps as CompProps } from './DeliveryWay';

const { Field } = Form;

type IProps = ZENT_FIELD<CompProps>;

const DeliveryWayField = React.forwardRef<any, IProps>((props, outerRef) => {
  return <Field {...props} ref={f => ((outerRef as any).current = f)} component={DeliveryWay} />;
});

export default DeliveryWayField;
