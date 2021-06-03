import React from 'react';
import { get } from 'lodash';
import { checkAccess } from '@youzan/sam-components';
import { isEduHqStore } from 'fns/chain';

interface IUseChainSettingsParams {}
type AuthStateType = 'available' | 'disabled' | 'invisible';
interface IUseChainSettingsResult {
  courseSummaryExportability: AuthStateType;
  signinRecordsExportability: AuthStateType;
  studentListExportability: AuthStateType;
}
type UseChainSettingsType = (params: IUseChainSettingsParams) => IUseChainSettingsResult;

/**
 * 用于校区设置的权限校验，会读取_global.chainShopSettings字段，然后根据设置转换成对应的权限描述
 *
 * 适用场景：
 * 1. 直接使用校区设置
 * 2. 校区设置配合sam权限控制元素隐藏或者禁用
 */
export const useChainSettings: UseChainSettingsType = (_params) => {
  const [authSettings, setAuthSettings] = React.useState<IUseChainSettingsResult>({
    courseSummaryExportability: 'disabled',
    signinRecordsExportability: 'disabled',
    studentListExportability: 'disabled',
  });

  React.useEffect(() => {
    const chainSettings = _global.chainShopSettings;
    setAuthSettings(transChainSettings2state(chainSettings));
  }, []);

  return authSettings;
};

type SettingsType = Record<string, any> | undefined;
function transChainSettings2state(chainSettings: SettingsType): IUseChainSettingsResult {
  return {
    courseSummaryExportability: setting2state(
      chainSettings,
      '课时汇总导出',
      'subshop_student_export_independent',
    ),
    signinRecordsExportability: setting2state(
      chainSettings,
      '签到记录导出',
      'subshop_student_export_independent',
    ),
    studentListExportability: setting2state(
      chainSettings,
      '学员列表导出',
      'subshop_student_export_independent',
    ),
  };
}

/**
 * 如果在开关中被关闭了，那么就不显示，如果开启但是操作人没有权限，就禁用
 */
function setting2state(
  chainSettings: SettingsType,
  samKey: string | undefined,
  path: string | undefined,
): AuthStateType {
  if (!chainSettings || isEduHqStore) return 'available';
  if (!path) return 'disabled';
  const enabledInSettings = get(chainSettings, path) === '1';
  if (!enabledInSettings) return 'invisible';
  let isAccessible = true;
  if (samKey) {
    isAccessible = checkAccess(samKey);
  }
  return isAccessible ? 'available' : 'disabled';
}
