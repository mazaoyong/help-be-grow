import { FilterNormalizerType, IListQuery } from '../../../types/list';
export declare class QueryManager {
    private mode;
    private filterNormalizer;
    queries: IListQuery;
    constructor(mode: "none" | "hash" | "browser" | undefined, defaultFilter: IListQuery | undefined, normalizer: FilterNormalizerType | undefined);
    private updateQuery;
    updateQueryAndUrl: (query: Record<string, any>) => boolean;
    setFilterNormalizer(normalizer: FilterNormalizerType): void;
}
