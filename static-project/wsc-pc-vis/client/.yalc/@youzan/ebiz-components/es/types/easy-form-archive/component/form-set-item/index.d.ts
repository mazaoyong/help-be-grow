import { FC, ComponentClass } from 'react';
interface IProps {
    component: ComponentClass<any> | FC<any>;
    componentProps: any;
    formProps: any;
}
declare const FormSetItem: FC<IProps>;
export default FormSetItem;
