interface IModifyCustomColumns {
    alternativeColumnNames: string[];
    displayColumnIdxList: number[];
}
export declare const openModifyDisplayColumns: (data: IModifyCustomColumns & {
    title: string;
}) => import("../../../../dialog").IopenDialogRef<number[]>;
export {};
