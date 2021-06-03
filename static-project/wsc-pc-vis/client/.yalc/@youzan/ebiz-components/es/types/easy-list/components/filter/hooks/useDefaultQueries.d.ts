import { IFilterProps } from '../../../types/filter';
export declare const useDefaultQueries: (props: IFilterProps, adaptor: {
    afterSubmit?(query: Record<string, any>): void;
    afterReset?(query: Record<string, any>): void;
    initValuePath: string;
    queries(props: any): Record<string, any>;
    loading(props: any): boolean;
}) => Record<string, any>;
