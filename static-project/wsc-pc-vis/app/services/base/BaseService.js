const { PCBaseService } = require('@youzan/wsc-pc-base');

/**
 * Project Base Service
 */
class BaseService extends PCBaseService {
  async invoke(methodName, args, options = {}) {
    let result;
    let serviceName;
    try {
      result = await super.invoke(methodName, args, options = {});
      serviceName = this.SERVICE_NAME;
      this.ctx.visLogger.info(`[invoke] ${serviceName}.${methodName}`, '', {
        result,
        args,
        options,
      });
    } catch (error) {
      this.ctx.visLogger.info(`[invoke error] ${serviceName}.${methodName}`, error, {
        args,
        options,
      });
      throw error;
    }
    return result;
  }
}

module.exports = BaseService;
