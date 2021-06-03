interface IUseValueCBOptions<Value = any> {
    useOnce?: boolean;
    flattenParams?: boolean;
    predicate?(value: Value): boolean;
}
/**
 *
 * @param watchValue 需要监听的value
 * @param callback 回调函数
 * @param options 选项配置
 * @param options.useOnce 是否只执行一次会回调
 * @param options.flattenParams 是否平展参数
 * @param options.predicate 断言函数
 */
declare const useValueCallback: <Value = any>(watchValue: Value, callback: (...args: any[]) => any, options?: IUseValueCBOptions<Value> | undefined) => undefined;
export default useValueCallback;
