interface IFunctionCollection {
    func(): void;
    func(arg: any): void;
    func(...args: any[]): void;
}
export declare type FunctionType = IFunctionCollection['func'];
export declare class Dispatcher {
    private id$;
    private effect$;
    subscribe: (effect: {
        (): void;
        (arg: any): void;
        (...args: any[]): void;
    }) => () => void;
    next: () => void;
}
export {};
