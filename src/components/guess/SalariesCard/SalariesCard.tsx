import React, {useState} from 'react';

import {FileDollar} from '@gravity-ui/icons';
import _ from 'lodash';

import {Project} from '../../../business/types';
import {OnProjectChangeArgs} from '../../../types/common';
import {CardBase} from '../../CardBase/CardBase';
import {CardHeaderContainer} from '../../CardHeaderContainer/CardHeaderContainer';
import {CardField} from '../CardField/CardField';

import styles from './SalariesCard.module.scss';

type SalariesCardProps = {
    onChange: (event: OnProjectChangeArgs) => void;
    previewOnly?: boolean;
    project: Project;
};

export const SalariesCard = (props: SalariesCardProps) => {
    const {onChange, project} = props;
    const [editable, setEditable] = useState(false);
    const currency = _.get(project, 'projectData.currency') || '';

    return (
        <CardBase editable={editable}>
            <CardHeaderContainer
                icon={<FileDollar />}
                name={`Salary${currency ? `, ${currency}` : ''}`}
                disabled={true}
                editable={editable}
                setEditable={setEditable}
            />
            <CardField
                label="Executors"
                value={_.get(project, 'projectData.executorsSalary') || 1000}
                type="number"
                inputClassName={styles.input}
                editable={editable}
                onChange={onChange}
                name={`projectData.executorsSalary`}
            />

            <CardField
                label="Managers"
                value={_.get(project, 'projectData.managersSalary') || 2000}
                type="number"
                inputClassName={styles.input}
                editable={editable}
                onChange={onChange}
                name={`projectData.managersSalary`}
            />
        </CardBase>
    );
};
