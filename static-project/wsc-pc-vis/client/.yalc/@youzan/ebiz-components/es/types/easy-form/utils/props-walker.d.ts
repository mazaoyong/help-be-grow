export declare function propWalker<T = any>(predicate: (v: T) => boolean): (key: string, value: any, dep?: number) => string[] | undefined;
