import {calculateTeam} from './capex';
import {updateProductSales} from './product';
import {summary} from './summary';
import {calculateTotal} from './total';
import {ProductName, Project, SourceData} from './types';
import {PlanName} from './types/plans';
import {calculateCosts, correctUsers, updateUsers} from './user';

export type ProductReport = {
    profit: number;
    revenue: number;
    cost: number;
    salesCount: number;
    balance: number;
};

export type PlanReport = ProductReport & {
    users: number;
    usersDiff: number;
    marketingCosts: number;

    // salesCountByProduct: Record<ProductName, number>;
    // profitByProduct: Record<ProductName, number>;
    // revenueByProduct: Record<ProductName, number>;
};

export type TeamReport = Record<string, number>;

export type Report = {
    byPlan: Record<PlanName, PlanReport>;
    byProduct: Record<ProductName, ProductReport>;
    team: Record<string, number>;
    total: Record<string, number>;
};

export const initialProductReport: ProductReport = {
    profit: 0,
    cost: 0,
    revenue: 0,
    salesCount: 0,
    balance: 0,
};

export const initialPlanReport: PlanReport = {
    ...initialProductReport,
    users: 0,
    usersDiff: 0,
    marketingCosts: 0,
};

export const getInitialReport = (source: SourceData): Report => {
    const plans = source.plans.map((p) => p.id);
    const byPlan = plans.reduce((acc, planId) => {
        // eslint-disable-next-line no-param-reassign
        acc[planId] = {...initialPlanReport};

        return acc;
    }, {} as Record<string, PlanReport>);

    const products = source.products.map((p) => p.id);
    const byProduct = products.reduce((acc, productId) => {
        // eslint-disable-next-line no-param-reassign
        acc[productId] = {...initialProductReport};

        return acc;
    }, {} as Record<string, ProductReport>);

    // console.log('byPlan', byPlan);

    return {
        byPlan,
        byProduct,
        team: {},
        total: {
            ...initialPlanReport,
        },
    };
};

export type GetReportResponse = Report;

export const getReport = (source: SourceData, project: Project): GetReportResponse[] => {
    const report = getInitialReport(source);
    const periods = [];
    const productIds = source.products.map((product) => product.id);
    for (let month = 0; month < source.period; month++) {
        for (const productId of productIds) {
            report.byProduct[productId].revenue = 0;
            report.byProduct[productId].cost = 0;
            report.byProduct[productId].profit = 0;
            report.byProduct[productId].salesCount = 0;
            report.team.executors = 0;
            report.team.managers = 0;
            report.team.executorsSalary = 0;
            report.team.managersSalary = 0;
        }
        updateUsers({report, month, source});
        correctUsers({report, month, source});
        calculateCosts({report, month, source});
        updateProductSales({report, month, source});
        calculateTotal({report, source});
        calculateTeam({report, month, source, projectData: project.projectData});
        summary({report, source});
        periods.push(JSON.parse(JSON.stringify({...report, month})));
    }
    return periods;
};
