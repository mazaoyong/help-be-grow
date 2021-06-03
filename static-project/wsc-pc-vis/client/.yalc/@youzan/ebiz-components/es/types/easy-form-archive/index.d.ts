/// <reference types="react" />
import * as Fields from './fields';
declare const EasyFormArchive: {
    EasyForm: import("react").FC<import("./types").IFormRenderProps>;
    EasyFormField: typeof Fields;
};
export default EasyFormArchive;
export * from './validators';
export * from './types';
