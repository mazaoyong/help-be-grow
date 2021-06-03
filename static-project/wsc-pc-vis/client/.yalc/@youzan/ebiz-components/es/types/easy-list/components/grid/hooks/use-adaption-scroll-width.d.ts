import React from 'react';
interface IUseAdaptionScrollWidthParams {
    gridRef: React.MutableRefObject<HTMLDivElement | null>;
    enableScroll: boolean;
    passiveScroll: {
        x: number;
        y: number;
    };
    columnSize: number;
    columnWidthList: number[];
}
export declare const useAdaptionScrollWidth: (params: IUseAdaptionScrollWidthParams) => {
    scroll?: undefined;
} | {
    scroll: {
        x: number;
        y: number;
    };
};
export {};
