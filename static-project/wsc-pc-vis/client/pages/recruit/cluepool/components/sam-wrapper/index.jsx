import { checkAccess } from '@youzan/sam-components';
import { isWscSingleStore } from '@youzan/utils-shop';

// 教育单店，有权限的情况下显示组件
export default function SamWrapper({ name, children }) {
  if (isWscSingleStore && checkAccess(name)) {
    return children;
  }
  return null;
}
