/// <reference types="react" />
import { ImgWrapProps } from '../img-wrap';
interface IImageLockWrapProps extends ImgWrapProps {
    isLock: boolean;
}
export default function LockImage(props: IImageLockWrapProps): JSX.Element;
export {};
