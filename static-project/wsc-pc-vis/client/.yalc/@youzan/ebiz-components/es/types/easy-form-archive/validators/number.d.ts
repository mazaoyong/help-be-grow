/// <reference types="react" />
import { IMoneyRangeRule, IIntRangeRule } from "../types";
export declare function moneyRange(rule: IMoneyRangeRule): (val: import("react").ReactText) => {
    name: string;
    message: string;
} | null;
export declare function intRange(rule: IIntRangeRule): (val: import("react").ReactText) => {
    name: string;
    message: string;
} | null;
