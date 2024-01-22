import React, {useCallback} from 'react';

import {uuid} from 'uuidv4';

import {Plan, Project} from '../../../business/types';
import {Flex} from '../../../components/Flex/Flex';
import {AddCard} from '../../../components/guess/AddCard/AddCard';
import {PlanCard} from '../../../components/guess/PlanCard/PlanCard';
import {initialPlan} from '../../../contexts/SourceDataContext';
import {OnProjectChangeArgs} from '../../../types/common';

import styles from './GuessPlanList.module.scss';

type GuessPlanListProps = {
    project: Project;
    plans: Plan[];
    onChange: (event: OnProjectChangeArgs) => void;
    previewOnly?: boolean;
};

export const GuessPlanList = ({plans, onChange, previewOnly, project}: GuessPlanListProps) => {
    const addPlan = useCallback(() => {
        onChange({
            path: 'sourceData.plans',
            value: [...plans, {...initialPlan, id: uuid()}],
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [plans]);

    return (
        <Flex direction="column" className={styles.container}>
            <Flex className={styles.list}>
                {plans.map((plan, index) => {
                    const namePrefix = `sourceData.plans[${index}]`;
                    return (
                        <PlanCard
                            key={plan.id}
                            {...plan}
                            project={project}
                            previewOnly={previewOnly}
                            namePrefix={namePrefix}
                            onChange={onChange}
                        />
                    );
                })}
                {previewOnly ? null : <AddCard onClick={addPlan} placeholder="Add new plan" />}
            </Flex>
        </Flex>
    );
};
