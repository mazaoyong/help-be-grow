
import { Form } from '@zent/compat';
import React from 'react';
import cx from 'classnames';
import component from './component';
import { isInStoreCondition } from 'fns/chain';

const { Field } = Form;

export default props => (
  <Field
    name="sku"
    label={props.label}
    component={component}
    value={props.sku}
    className={cx({
      'sku-field': true,
      hide: props.courseType === 1 && props.courseSellType !== 0,
    })}
    disabled={props.disabled || isInStoreCondition({ supportEduBranchStore: true })}
    disabledMsg={props.disabledMsg}
    helpDesc="如有上课时间、课时、班期等多种规格，请添加课程规格"
    displayError={!!props.zentForm.getFieldError('sku')}
    asyncValidation={(values, value) => {
      if (value.length === 0) return Promise.resolve();
      const validated = value.every(item => {
        const leaf = item.leaf;
        if (item.dictId > 0 && leaf && leaf.length > 0) {
          return leaf.every(leafItem => leafItem.dictId > 0);
        }
        return false;
      });
      if (validated) {
        return Promise.resolve();
      }
      return Promise.reject('请将商品规格的信息填写完整');
    }}
  />
);
