# 目录说明

存放一些异常类，例如：BusinessServiceError

```js
// 业务异常类 BusinessServiceError.js
class BusinessServiceError extends Error {
  constructor(code, msg, extra = {}) {
    super(`code: ${code} message: ${msg}`);
    this.errorContent = {
      code,
      msg,
      extra
    };
    this.errorType = 'BusinessServiceError';
  }
}

module.exports = BusinessServiceError;
```
