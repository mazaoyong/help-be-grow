/*
@ result.valid Boolean
@ result.err String
*/
import Valid from 'zan-utils/validate';

const checkPhoneValid = val => {
  const result = {};
  if (!val) {
    result.err = '请填写你的手机号码';
    result.valid = false;
  } else if (!Valid.mobile(val)) {
    result.err = '请填写11位手机号码';
    result.valid = false;
  } else {
    result.err = '';
    result.valid = true;
  }
  return result;
};

const validPassword = val => {
  let state = false;
  const letters = /[a-zA-Z]/g;
  const num = /[0-9]/g;
  const letterTest = letters.test(val);
  const numTest = num.test(val);
  if (letterTest && numTest) {
    state = true;
  }
  return state;
};

const checkPasswordValid = (route, val) => {
  const result = {};
  if (!val) {
    result.err = '请输入您的密码';
    result.valid = false;
  } else if (route !== 'login') {
    if (val.length < 8) {
      result.err = '亲，密码最短为8位';
      result.valid = false;
    } else if (val.length > 20) {
      result.err = '亲，密码最长为20位';
      result.valid = false;
    } else if (!validPassword(val)) {
      result.err = '亲，密码为8-20位数字和字母组合';
      result.valid = false;
    } else {
      result.err = '';
      result.valid = true;
    }
  } else {
    result.err = '';
    result.valid = true;
  }
  return result;
};

const checkVerifyCodeValid = val => {
  let result = {};
  if (!Valid.postalCode(val)) {
    result.err = '请填写6位短信验证码';
    result.valid = false;
  } else {
    result = {
      err: '',
      valid: true,
    };
  }
  return result;
};

export { checkPhoneValid, checkPasswordValid, checkVerifyCodeValid };
