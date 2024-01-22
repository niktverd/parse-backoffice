import {Report} from './report';
import {ProjectData, SourceData} from './types';
import {wrapper} from './utils';

type CalculateTeamArgs = {
    projectData: ProjectData;
    source: SourceData;
    report: Report;
    month?: number;
};

const LIMIT_FOR_WHITE_COLOR = 12;
const EXECUTORS_SALARY = 1000;
const MANAGERS_SALARY = 2000;

export const calculateTeam = ({report, source, projectData}: CalculateTeamArgs) => {
    wrapper(report, 'byProduct', (key: string) => {
        const product = source.products.find((prdct) => prdct.id === key);
        if (!product || !product.staff) {
            return;
        }

        const executorsSalaryBase = projectData.executorsSalary || EXECUTORS_SALARY;
        const managersSalaryBase = projectData.managersSalary || MANAGERS_SALARY;

        const salesCount = report.byProduct[key].salesCount;

        const executors = Math.floor(salesCount / product.staff);
        const managers = Math.floor(executors / LIMIT_FOR_WHITE_COLOR);
        const executorsSalary = executors * executorsSalaryBase;
        const managersSalary = managers * managersSalaryBase;

        /* eslint-disable no-param-reassign */
        report.team.executors = (report.team.executors || 0) + executors;
        report.team.managers = (report.team.managers || 0) + managers;
        report.team.executorsSalary = (report.team.executorsSalary || 0) + executorsSalary;
        report.team.managersSalary = (report.team.managersSalary || 0) + managersSalary;
        /* eslint-enable no-param-reassign */
    });
};
