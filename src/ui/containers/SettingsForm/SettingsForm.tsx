import React from 'react';

import _ from 'lodash';

import {Source} from '../../../db/models';
import {OnSourceChangeArgs} from '../../../types/common';
import {Flex} from '../../components/Flex/Flex';
import {SourceDetailsCard} from '../../components/SourceDetailsCard/SourceDetailsCard';

import s from './SettingsForm.module.scss';

type SettingsFormProps = {
    source: Source;
    onChange: (event: OnSourceChangeArgs) => void;
    previewOnly?: boolean;
};

export const SettingsForm = ({source, onChange, previewOnly}: SettingsFormProps) => {
    return (
        <Flex className={s.container}>
            <SourceDetailsCard onChange={onChange} source={source} previewOnly={previewOnly} />
        </Flex>
    );
};
