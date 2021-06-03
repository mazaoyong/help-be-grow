interface IFunctionCollection {
  func(): void;
  func(arg: any): void;
  func(...args: any[]): void;
}
export type FunctionType = IFunctionCollection['func'];
export class Dispatcher {
  private id$: number = 0;
  private effect$: Map<number, FunctionType> = new Map();

  subscribe = (effect: FunctionType) => {
    const curId = this.id$++;
    this.effect$.set(curId, effect);
    return () => {
      this.effect$.delete(curId);
    };
  };

  next = () => {
    this.effect$ && this.effect$.forEach((effect) => effect());
  };
}
