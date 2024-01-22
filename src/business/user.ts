import {Report} from './report';
import {PlanName, SourceData} from './types';
import {wrapper} from './utils';

type UpdateUsersArgs = {
    source: SourceData;
    report: Report;
    month: number;
};

export const updateUsers = ({report, source}: UpdateUsersArgs) => {
    wrapper(report, 'byPlan', (key: PlanName) => {
        const plan = source.plans.find((p) => p.id === key);
        if (!plan) {
            return;
        }

        const sourceData = plan.sourceOfUserAqcusition
            ? report.byPlan[plan.sourceOfUserAqcusition].users
            : report.byPlan[key].users;

        let usersDiff = Math.ceil((sourceData * plan.growthRate) / 100 || plan.minimalGrowthCount);
        if (usersDiff < plan.minimalGrowthCount) {
            usersDiff = plan.minimalGrowthCount;
        }

        /* eslint-disable no-param-reassign */
        report.byPlan[key].usersDiff = usersDiff;
        report.byPlan[key].users = Number(report.byPlan[key].users) + Number(usersDiff);
        /* eslint-enable no-param-reassign */
    });
};

export const correctUsers = ({report, source}: UpdateUsersArgs) => {
    wrapper(report, 'byPlan', (key: PlanName) => {
        const plan = source.plans.find((p) => p.id === key);
        if (!plan) {
            return;
        }

        const churn = Math.floor((report.byPlan[key].users * plan.churnRate) / 100);
        // eslint-disable-next-line no-param-reassign
        report.byPlan[key].users -= churn;

        if (!plan.sourceOfUserAqcusition) {
            return;
        }

        // eslint-disable-next-line no-param-reassign
        report.byPlan[plan.sourceOfUserAqcusition].users -= report.byPlan[key].usersDiff;
    });
};

export const calculateCosts = ({report, source}: UpdateUsersArgs) => {
    wrapper(report, 'byPlan', (key: PlanName) => {
        const plan = source.plans.find((p) => p.id === key);
        if (!plan) {
            return;
        }

        // eslint-disable-next-line no-param-reassign
        report.byPlan[key].marketingCosts = report.byPlan[key].usersDiff * plan.cac;
    });
};
