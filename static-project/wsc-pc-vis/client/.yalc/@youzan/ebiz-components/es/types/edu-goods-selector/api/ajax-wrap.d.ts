export declare const ajaxVis: <T>(method: string, url: string, data: any) => Promise<T>;
export declare function ajaxWrap(prefix: string): <T>(method: string, url: string, data: any) => Promise<T>;
