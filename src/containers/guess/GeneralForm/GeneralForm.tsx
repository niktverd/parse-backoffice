import React from 'react';

import _ from 'lodash';

import {Source} from '../../../business/types';
import {Flex} from '../../../components/Flex/Flex';
// import {PeriodCard} from '../../../components/guess/PeriodCard/PeriodCard';
import {SourceDetailsCard} from '../../../components/guess/SourceDetailsCard/SourceDetailsCard';
// import {SalariesCard} from '../../../components/guess/SalariesCard/SalariesCard';
// import {UnitsCard} from '../../../components/guess/UnitsCard/UnitsCard';
import {OnSourceChangeArgs} from '../../../types/common';

import s from './GeneralForm.module.scss';

type GeneralFormProps = {
    source: Source;
    onChange: (event: OnSourceChangeArgs) => void;
    previewOnly?: boolean;
};

export const GeneralForm = ({source, onChange, previewOnly}: GeneralFormProps) => {
    return (
        <Flex className={s.container}>
            <SourceDetailsCard onChange={onChange} source={source} previewOnly={previewOnly} />
            {/* <PeriodCard onChange={onChange} source={source} previewOnly={previewOnly} />
            <SalariesCard onChange={onChange} source={source} previewOnly={previewOnly} />
            <UnitsCard onChange={onChange} source={source} previewOnly={previewOnly} /> */}
        </Flex>
    );
};
