import * as JOB from '../../../constants/job';

export interface ChangeFilterAction {
    type: typeof JOB.CHANGE_FILTER;
    data: {
        filter: string;
    };
}

export type StatisticsActionType = ChangeFilterAction;

export function changeFilter(filter: string): ChangeFilterAction {
    return {
        type: JOB.CHANGE_FILTER,
        data: {filter},
    };
}
