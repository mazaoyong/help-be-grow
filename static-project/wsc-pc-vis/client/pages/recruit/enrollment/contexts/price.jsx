import React, { createContext, useReducer } from 'react';
import accSub from '@youzan/utils/number/accSub';

import { calcReal, calcTotal, cent2yuan } from '../util';

// constants
export const TOGGLE_SHOW = 'TOGGLE_SHOW';
export const CHANGE_DISCOUNT_TYPE = 'CHANGE_DISCOUNT_TYPE';
export const CHANGE_COURSES = 'CHANGE_COURSES';
export const CHANGE_DISCOUNT_DECIMAL = 'CHANGE_DISCOUNT_DECIMAL';
export const CHANGE_DISCOUNT_NUMBER = 'CHANGE_DISCOUNT_NUMBER';
export const CHANGE_TARGET_PRICE = 'CHANGE_TARGET_PRICE';

const MAX_DISCOUNT_DECIMAL = 1000;

const initialState = {
  // state
  showDiscount: false, // whether discount is shown
  discountType: 1, // type of discount
  discountNumber: 0, // number of discount, being active when discount type is 1
  discountDecimal: MAX_DISCOUNT_DECIMAL, // decimal of discount, being active when discount type is 2
  goodsPrices: [], // prices of goods
  computedGoodsPrices: [], // prices of goods after computing
  // record state of number and decimal
  discountNumberInitialized: false,
  discountDecimalInitialized: false,
  // computed state
  total: 0,
  real: 0,
  discount: 0,
  // when in case of filling up infomation, there is a target price
  targetPrice: 0,
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case CHANGE_TARGET_PRICE:
      return Object.assign({}, state, {
        targetPrice: payload,
      });

    case TOGGLE_SHOW:
      // payload: boolean - showDiscount
      return Object.assign({}, state, {
        // state
        showDiscount: payload,
        discountType: 1,
        discountNumber: 0,
        discountDecimal: MAX_DISCOUNT_DECIMAL,
        discountNumberInitialized: false,
        discountDecimalInitialized: false,
        // computed states
        real: calcReal(state.computedGoodsPrices, 1, 0, MAX_DISCOUNT_DECIMAL),
        discount: 0,
      });

    case CHANGE_COURSES:
      // payload: array - courses
      const goodsPrices = payload.map(item => item.price);
      const computedGoodsPrices = payload.map(item => item.realPrice);
      const total = calcTotal(goodsPrices);
      const real = calcReal(computedGoodsPrices, state.discountType, 0, MAX_DISCOUNT_DECIMAL);
      const discount = accSub(total, real);
      return Object.assign({}, state, {
        discountNumber: 0,
        discountDecimal: MAX_DISCOUNT_DECIMAL,
        discountNumberInitialized: false,
        discountDecimalInitialized: false,
        goodsPrices,
        computedGoodsPrices,
        total,
        real,
        discount,
      });

    case CHANGE_DISCOUNT_TYPE:
      const real2 = calcReal(state.computedGoodsPrices, payload, 0, MAX_DISCOUNT_DECIMAL);
      return Object.assign({}, state, {
        // state
        discountType: payload,
        discountNumber: 0,
        discountDecimal: MAX_DISCOUNT_DECIMAL,
        discountNumberInitialized: false,
        discountDecimalInitialized: false,
        // computed state
        real: real2,
        discount: accSub(state.total, real2),
      });

    case CHANGE_DISCOUNT_NUMBER:
      // payload: array - courses
      const real3 = calcReal(state.computedGoodsPrices, state.discountType, payload, state.discountDecimal);
      return Object.assign({}, state, {
        discountNumber: payload,
        discountNumberInitialized: true,
        real: real3,
        discount: accSub(state.total, real3),
      });

    case CHANGE_DISCOUNT_DECIMAL:
      const real4 = calcReal(state.computedGoodsPrices, state.discountType, state.discountNumber, payload);
      // payload: number - discountAmount
      const d = Object.assign({}, state, {
        discountDecimal: payload,
        discountDecimalInitialized: true,
        real: real4,
        discount: accSub(state.total, real4),
      });
      return d;

    default:
      return state;
  }
};

// context & provider
export const Context = createContext(initialState);

function getOrderDiffPrice(state) {
  const targetPrice = cent2yuan(state.targetPrice);
  const selectedPrice = cent2yuan(state.real);

  const diffPrice = accSub(selectedPrice, targetPrice).toFixed(2);
  return diffPrice;
}

export const Provider = ({ children }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState);
  const orderDiffPrice = getOrderDiffPrice(state);
  return (
    <Context.Provider value={{ state, dispatch, orderDiffPrice }}>
      {children}
    </Context.Provider>
  );
};
