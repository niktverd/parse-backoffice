import React, {useState} from 'react';

import {Clock} from '@gravity-ui/icons';
import _ from 'lodash';

import {Project} from '../../../business/types';
import {OnProjectChangeArgs} from '../../../types/common';
import {CardBase} from '../../CardBase/CardBase';
import {CardHeaderContainer} from '../../CardHeaderContainer/CardHeaderContainer';
import {CardField} from '../CardField/CardField';

import styles from './PeriodCard.module.scss';

type PeriodCardProps = {
    onChange: (event: OnProjectChangeArgs) => void;
    previewOnly?: boolean;
    project: Project;
};

export const PeriodCard = (props: PeriodCardProps) => {
    const {previewOnly, onChange, project} = props;
    const [editable, setEditable] = useState(false);
    const periodUnits = _.get(project, 'projectData.periodUnits') || '';

    return (
        <CardBase editable={editable}>
            <CardHeaderContainer
                icon={<Clock />}
                name={`Period${periodUnits ? `, ${periodUnits}` : ''}`}
                disabled={true}
                editable={editable}
                setEditable={setEditable}
                previewOnly={previewOnly}
            />
            <CardField
                label="Period"
                value={_.get(project, 'sourceData.period')}
                type="number"
                inputClassName={styles.input}
                editable={editable}
                onChange={onChange}
                name={`sourceData.period`}
                min={1}
                max={36}
            />
        </CardBase>
    );
};
