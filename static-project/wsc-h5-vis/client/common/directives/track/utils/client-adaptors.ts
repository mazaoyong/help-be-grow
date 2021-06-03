import { IGlobalTrackerSetting, ZanTrackerInstance, IAutoConfigures } from './zan-tracker-types';
import { merge } from 'lodash';
import { getDefaultSetting } from '../constant';

// 在初始版本中，只支持zan-web-tracker，但是因为它普及度不够高，所以全面切换为log-client
// 将log-client的埋点客户端封装成zanWebTracker的形式，以此抹平API差异
const defaultSetting = getDefaultSetting();
function convertLogClient(client: any, logClientSetting?: IGlobalTrackerSetting) {
  // 处理参数初始化
  const clientSetting: Required<IGlobalTrackerSetting> = merge(defaultSetting, logClientSetting);
  initClientOptions(client, clientSetting);
  // 默认的埋点客户端是，client-log-sdk
  // 在新版本客户端下，除了获取params的API不一致之外，其他API基本都存在
  // 额外注意的一点是，client-log下还有getSpm方法
  const dumpClient = client as ZanTrackerInstance;
  dumpClient.getData = client.getLogParams;
  return {
    client: dumpClient,
    clientSetting,
  };
}

function initClientOptions(client: any, setting: IGlobalTrackerSetting) {
  overrideClient(client);
  const { yai, ...autoConfigures } = setting;
  client.setYAI(yai);
  client.setAutoConfigures(autoConfigures);
}

function overrideClient(client: any) {
  client.getOptions = function() {
    return this.options;
  };
  client.setYAI = function(yai?: string) {
    if (yai !== undefined) {
      this.options.plat.yai = yai;
    }
  };
  client.setAutoConfigures = function(autoConfigures: IAutoConfigures = {}) {
    this.options = merge(this.getOptions(), autoConfigures);
    const newOptions = this.getOptions();
    if (newOptions.autoClick === false) {
      this.setAutoClick(false);
    }
  };
}

export const clientAdaptors = {
  convertLogClient,
};
