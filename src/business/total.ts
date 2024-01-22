import {omit} from 'lodash';

import {PlanReport, Report} from './report';
import {SourceData} from './types';
import {PlanName} from './types/plans';
import {wrapper} from './utils';

type CalculateTotalArgs = {
    source: SourceData;
    report: Report;
};

export const calculateTotal = ({report, source: _}: CalculateTotalArgs) => {
    const repKeys = Object.keys(report.total);
    for (const rk of repKeys) {
        // eslint-disable-next-line no-param-reassign
        report.total[rk] = 0;
    }

    wrapper(report, 'byPlan', (key: PlanName) => {
        const reports = omit(report, 'team', 'total');
        const planReport = reports.byPlan[key];
        if (!planReport) {
            return;
        }

        const reportKeys = Object.keys(planReport) as (keyof PlanReport)[];

        reportKeys.forEach((reportKey) => {
            if (
                typeof report.total[reportKey] === 'number' &&
                typeof report.byPlan[key][reportKey] === 'number'
            ) {
                // eslint-disable-next-line no-param-reassign
                report.total[reportKey] += report.byPlan[key][reportKey];
            }
        });

        // eslint-disable-next-line no-param-reassign
        report.total = omit(
            report.total,
            'salesCountByProduct',
            'profitByProduct',
            'revenueByProduct',
        );
    });
};
