import {useSelector} from 'react-redux';
import React from 'react';

import {getProgressYQLStatisticsFiltered} from '../../module/query/selectors';
import {changeProgressYQLStatisticsFilter} from '../../module/query/actions';
import {StatisticTable} from '../../../../components/StatisticTable/StatisticTable';

import './index.scss';

export function YQLStatisticsTable() {
    const items = useSelector(getProgressYQLStatisticsFiltered);

    return (
        <StatisticTable
            fixedHeader
            virtual={false}
            items={items}
            visibleColumns={['min', 'max', 'avg', 'sum', 'count']}
            onFilterChange={changeProgressYQLStatisticsFilter}
        />
    );
}
