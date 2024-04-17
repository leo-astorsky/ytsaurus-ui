import * as React from 'react';
import {useSelector} from 'react-redux';
import {changeFilter} from '../../../../store/actions/job/statistics';
import {
    getJobStatisticsMetricMinWidth,
    getTreeItems,
} from '../../../../store/selectors/job/statistics';
import {JobTreeItem} from '../../../../types/job';
import {StatisticTable} from '../../../../components/StatisticTable/StatisticTable';

export default function Statistics() {
    const items: JobTreeItem[] = useSelector(getTreeItems);
    const minWidth = useSelector(getJobStatisticsMetricMinWidth);

    return (
        <StatisticTable
            items={items}
            minWidth={minWidth}
            onFilterChange={changeFilter}
            visibleColumns={['min', 'max', 'last', 'sum', 'count']}
        />
    );
}
