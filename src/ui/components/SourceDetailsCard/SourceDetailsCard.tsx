import React, {useState} from 'react';

import {FolderTree} from '@gravity-ui/icons';
import _ from 'lodash';

import {Source} from '../../../db/models';
import {OnSourceChangeArgs} from '../../../types/common';
import {CardBase} from '../CardBase/CardBase';
import {CardField} from '../CardField/CardField';
import {CardHeaderContainer} from '../CardHeaderContainer/CardHeaderContainer';

import s from './SourceDetailsCard.module.scss';

type SourceDetailsCardProps = {
    onChange: (event: OnSourceChangeArgs) => void;
    previewOnly?: boolean;
    source: Source;
};

export const SourceDetailsCard = (props: SourceDetailsCardProps) => {
    const {onChange, source} = props;
    const [editable, setEditable] = useState(false);

    return (
        <CardBase editable={editable}>
            <CardHeaderContainer
                icon={<FolderTree />}
                name="Source Details"
                disabled={true}
                editable={editable}
                setEditable={setEditable}
            />
            <div>
                <input
                    type="text"
                    value={_.get(source, 'data.id')}
                    className={s.input}
                    onChange={onChange}
                    disabled
                    style={{color: 'grey', fontSize: 12}}
                />
            </div>
            <CardField
                label="Name"
                value={_.get(source, 'data.name')}
                type="text"
                inputClassName={s.input}
                editable={editable}
                onChange={onChange}
                name={`data.name`}
            />

            <CardField
                label="Description"
                value={_.get(source, 'data.description')}
                type="text"
                inputClassName={s.input}
                editable={editable}
                onChange={onChange}
                name={`data.description`}
            />
        </CardBase>
    );
};
