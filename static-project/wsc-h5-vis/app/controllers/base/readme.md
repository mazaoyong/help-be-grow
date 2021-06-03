# BaseController 

**只用于 knowledge controller 使用**

其他新的业务 controller 都继承 **BaseNewController** 进行开发


# BaseNewController

## 默认的一些 global 字段设置方法已经在 init 中调用。

```
this.getMpData(),
this.initPlatform(), // 平台信息

this.initKdtId();
this.setOldPlatform();
this.loggerUainfo();
```

## 可选的服务调用

```
this.initGlobalTheme() // 全局的主题标志(大部分页面不需要设置主题)
this.setPointsName() // 自定义积分名称
this.hideFooter() // 不显示底部版权
this.setRunModeState() // c 端 _global 显示当前 node 信息
this.setSpm(logType, logId) // 打点信息
```

## buyer 取得用户常用信息

**usage**

```
const fansId = this.buyer.fansId;

{
  nobody: sessionId,
  buyerId: this.ctx.buyerId,
  buyerPhone: buyer.mobile,
  fansId,
  fansType,
  fansNickname,
  youzanFansId
};
```