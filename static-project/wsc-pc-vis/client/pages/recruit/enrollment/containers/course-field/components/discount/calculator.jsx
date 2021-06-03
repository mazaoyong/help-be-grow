import React, { useContext, useCallback } from 'react';
import { Checkbox, Radio } from 'zent';

import { Context, TOGGLE_SHOW, CHANGE_DISCOUNT_NUMBER, CHANGE_DISCOUNT_DECIMAL, CHANGE_DISCOUNT_TYPE } from '../../../../contexts/price';
import { cent2yuan, yuan2cent } from '../../../../util';
import NumberInput from '../../../../components/number-input';

const RadioGroup = Radio.Group;

export default function Calculator() {
  const {
    state: {
      discountDecimal,
      discountDecimalInitialized,
      discountNumber,
      discountNumberInitialized,
      discountType,
      showDiscount,
      computedGoodsPrices,
    },
    dispatch,
  } = useContext(Context);

  const _discountNumber = discountNumberInitialized ? cent2yuan(discountNumber, true) : '';
  const _discountDecimal = discountDecimalInitialized ? cent2yuan(discountDecimal, true) : '';
  const maxDiscountNumber = computedGoodsPrices.reduce((total, price) => total + price, 0);
  const _maxDiscountNumber = cent2yuan(maxDiscountNumber);

  const toggleShow = useCallback(e => {
    dispatch({
      type: TOGGLE_SHOW,
      payload: e.target.checked,
    });
  }, [dispatch]);

  const changeDiscountType = useCallback(e => {
    dispatch({
      type: CHANGE_DISCOUNT_TYPE,
      payload: e.target.value,
    });
  }, [dispatch]);

  const changeDiscountNumber = useCallback(v => {
    dispatch({
      type: CHANGE_DISCOUNT_NUMBER,
      payload: yuan2cent(v),
    });
  }, [dispatch]);

  const changeDiscountDemical = useCallback(v => {
    dispatch({
      type: CHANGE_DISCOUNT_DECIMAL,
      payload: yuan2cent(v),
    });
  }, [dispatch]);

  return (
    <div className="edu-enrollment-discount-calc">
      <Checkbox checked={showDiscount} onChange={toggleShow}>
        使用整单优惠
      </Checkbox>
      {
        showDiscount ? (
          <div className="edu-enrollment-discount-calc-line">
            <RadioGroup onChange={changeDiscountType} value={discountType}>
              <Radio value={1}>
                整单减价
                <NumberInput
                  disabled={discountType !== 1}
                  placeholder="减价金额需<课程总价"
                  width="192px"
                  addonBefore="¥"
                  decimal={2}
                  max={_maxDiscountNumber}
                  min={0}
                  value={_discountNumber}
                  onChange={changeDiscountNumber}
                />
              </Radio>
              <Radio value={2}>
                整单折扣
                <NumberInput
                  disabled={discountType !== 2}
                  placeholder="可输入0.1-9.9间的数字"
                  width="196px"
                  addonAfter="折"
                  decimal={1}
                  max={9.9}
                  min={0.1}
                  value={_discountDecimal}
                  onChange={changeDiscountDemical}
                />
              </Radio>
            </RadioGroup>
          </div>
        ) : null
      }
    </div>
  );
}
