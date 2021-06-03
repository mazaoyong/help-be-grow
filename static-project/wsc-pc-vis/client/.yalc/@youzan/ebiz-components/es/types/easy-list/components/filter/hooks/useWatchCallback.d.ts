import { FieldModel } from 'zent';
import { ZentForm } from 'zent/es/form/ZentForm';
import { IFilterModelUnion, WatchFunc } from '../../../types/filter';
declare type FilterModels = ZentForm<Record<string, FieldModel<IFilterModelUnion>>>;
declare const useWatchCallback: (form: FilterModels, watches: Record<string, [WatchFunc, string][]>, formChangeCallback: (updateFields: string[]) => void) => void;
export { useWatchCallback };
