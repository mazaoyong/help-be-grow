import { LockType } from './index';
export { LockType } from './index';
export default function openLockDialog(lockType: LockType): () => Promise<never>;
export declare function onOpenLockDialogClick(isLock: boolean, type: LockType, callback: () => void): () => void;
