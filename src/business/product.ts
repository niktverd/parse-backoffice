import {Report} from './report';
import {SourceData} from './types';
import {PlanName} from './types/plans';
import {wrapper} from './utils';

type UpdateEarningsArgs = {
    source: SourceData;
    report: Report;
    month: number;
};

export const updateProductSales = ({report, source}: UpdateEarningsArgs) => {
    wrapper(report, 'byPlan', (key: PlanName) => {
        const plan = source.plans.find((p) => p.id === key);
        if (!plan) {
            return;
        }

        let profit = 0;
        let salesCount = 0;
        let revenue = 0;
        let cost = 0;
        for (const productId of plan.availableProducts) {
            const product = source.products.find((p) => p.id === productId);
            if (!product) {
                continue;
            }
            const salesCountByProduct = Math.ceil(
                (product.frequency * report.byPlan[key].users) / 100,
            );
            const profitByProduct = product.profit * salesCountByProduct;
            const costByProduct = product.cost * salesCountByProduct;
            const revenueByProduct =
                (Number(product.cost) + Number(product.profit)) * salesCountByProduct;
            profit += profitByProduct;
            salesCount += salesCountByProduct;
            revenue += revenueByProduct;
            cost += costByProduct;
            /* eslint-disable no-param-reassign */
            report.byProduct[productId].profit =
                (report.byProduct[productId].profit || 0) + profitByProduct;
            report.byProduct[productId].salesCount =
                (report.byProduct[productId].salesCount || 0) + salesCountByProduct;
            report.byProduct[productId].revenue =
                (report.byProduct[productId].revenue || 0) + revenueByProduct;
            report.byProduct[productId].cost =
                (report.byProduct[productId].cost || 0) + costByProduct;
            /* eslint-enable no-param-reassign */
        }

        /* eslint-disable no-param-reassign */
        report.byPlan[key].salesCount = salesCount;
        report.byPlan[key].profit = profit;
        report.byPlan[key].revenue = revenue;
        report.byPlan[key].cost = cost;
        /* eslint-enable no-param-reassign */
    });
};
