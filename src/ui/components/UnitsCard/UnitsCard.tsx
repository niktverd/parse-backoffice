import React, {useState} from 'react';

import {Gear} from '@gravity-ui/icons';
import _ from 'lodash';

import {Source} from '../../../db/models';
import {OnSourceChangeArgs} from '../../../types/common';
import {CardBase} from '../CardBase/CardBase';
import {CardField} from '../CardField/CardField';
import {CardHeaderContainer} from '../CardHeaderContainer/CardHeaderContainer';

import styles from './UnitsCard.module.scss';

type UnitsCardProps = {
    onChange: (event: OnSourceChangeArgs) => void;
    previewOnly?: boolean;
    project: Source;
};

export const UnitsCard = (props: UnitsCardProps) => {
    const {onChange, project} = props;
    const [editable, setEditable] = useState(false);

    return (
        <CardBase editable={editable}>
            <CardHeaderContainer
                icon={<Gear />}
                name="Units"
                disabled={true}
                editable={editable}
                setEditable={setEditable}
            />
            <CardField
                label="Period"
                value={_.get(project, 'projectData.periodUnits') || ''}
                type="text"
                inputClassName={styles.input}
                editable={editable}
                onChange={onChange}
                name={`projectData.periodUnits`}
            />

            <CardField
                label="Currency"
                value={_.get(project, 'projectData.currency') || ''}
                type="text"
                inputClassName={styles.input}
                editable={editable}
                onChange={onChange}
                name={`projectData.currency`}
            />
        </CardBase>
    );
};
