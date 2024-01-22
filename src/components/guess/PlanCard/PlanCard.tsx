import React, {useState} from 'react';

import {Shapes3} from '@gravity-ui/icons';
import _ from 'lodash';

import {Plan, Project} from '../../../business/types';
import {OnProjectChangeArgs} from '../../../types/common';
import {CardBase} from '../../CardBase/CardBase';
import {CardHeaderContainer} from '../../CardHeaderContainer/CardHeaderContainer';
import {CardField} from '../CardField/CardField';
import {CardSelector} from '../CardSelector/CardSelector';

import styles from './PlanCard.module.scss';

type PlanCardProps = Plan & {
    onChange: (event: OnProjectChangeArgs) => void;
    onFinishEdit?: () => void;
    namePrefix: string;
    previewOnly?: boolean;
    project: Project;
};

export const PlanCard = (props: PlanCardProps) => {
    const {
        id,
        name,
        cac,
        minimalGrowthCount,
        growthRate,
        churnRate,
        sourceOfUserAqcusition,
        availableProducts,
        previewOnly,
        namePrefix,
        project,
        onChange,
        onFinishEdit,
    } = props;
    const [editable, setEditable] = useState(false);
    const currency = _.get(project, 'projectData.currency') || '';
    const handleSourceOfUserAcqusitionChange = (ids: Array<string>) => {
        onChange({
            path: `${namePrefix}.sourceOfUserAqcusition`,
            value: ids[0],
        });
    };

    const handleAvailableProductsChange = (ids: Array<string>) => {
        onChange({
            path: `${namePrefix}.availableProducts`,
            value: ids,
        });
    };

    return (
        <CardBase editable={editable}>
            <CardHeaderContainer
                icon={<Shapes3 />}
                name={name}
                onChange={onChange}
                namePrefix={`${namePrefix}.name`}
                editable={editable}
                setEditable={setEditable}
                previewOnly={previewOnly}
                onFinishEdit={onFinishEdit}
            />
            <div>
                <input
                    type="text"
                    value={id}
                    className={styles.input}
                    disabled
                    style={{color: 'grey', fontSize: 12}}
                />
            </div>
            <div>
                <CardField
                    label="Client acqusition cost"
                    value={cac}
                    type="number"
                    inputClassName={styles.input}
                    editable={editable}
                    onChange={onChange}
                    name={`${namePrefix}.cac`}
                    unit={currency}
                />
            </div>
            <div>
                <CardField
                    label="Minimal users growth"
                    value={minimalGrowthCount}
                    type="number"
                    inputClassName={styles.input}
                    editable={editable}
                    onChange={onChange}
                    name={`${namePrefix}.minimalGrowthCount`}
                />
            </div>
            <div>
                <CardField
                    label="Growth rate"
                    value={growthRate}
                    type="number"
                    inputClassName={styles.input}
                    editable={editable}
                    onChange={onChange}
                    name={`${namePrefix}.growthRate`}
                    unit="%"
                />
            </div>
            <div>
                <CardField
                    label="Churn rate"
                    value={churnRate}
                    type="number"
                    inputClassName={styles.input}
                    editable={editable}
                    onChange={onChange}
                    name={`${namePrefix}.churnRate`}
                    unit="%"
                />
            </div>
            <div>
                <CardSelector
                    project={project}
                    label="Source of user acqusition"
                    value={sourceOfUserAqcusition ? [sourceOfUserAqcusition] : []}
                    type="single"
                    containerClassName={styles['high-z-index']}
                    inputClassName={styles.input}
                    editable={editable}
                    onChange={handleSourceOfUserAcqusitionChange}
                    currentCard={props}
                    source="plans"
                />
            </div>
            <div>
                <CardSelector
                    project={project}
                    label="Available products"
                    value={availableProducts}
                    type="array"
                    containerClassName={styles['low-z-index']}
                    inputClassName={styles.input}
                    editable={editable}
                    onChange={handleAvailableProductsChange}
                    currentCard={props}
                    source="products"
                />
            </div>
        </CardBase>
    );
};
