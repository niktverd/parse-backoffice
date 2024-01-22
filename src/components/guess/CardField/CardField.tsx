import React from 'react';

import {Flex} from '../../Flex/Flex';

import s from './CardField.module.scss';

type CardFieldProps = {
    value: string | number;
    type: string;
    name: string;
    unit?: string;
    label?: string;
    min?: number;
    max?: number;
    inputContainerClassName?: string;
    inputClassName?: string;
    editable?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const CardField = ({
    label = '',
    unit = '',
    value,
    onChange,
    inputClassName,
    editable,
    type = 'text',
    inputContainerClassName,
    name,
    min,
    max,
}: CardFieldProps) => {
    return (
        <Flex className={`${s.container} ${inputContainerClassName} ${editable ? s.edit : ''}`}>
            <label className={s.label}>
                <div className={s['label-text']}>
                    {label}
                    {unit ? `, ${unit}` : ''}
                </div>
                <div>{type}</div>
            </label>
            <input
                type={type}
                name={name}
                value={value}
                min={min}
                max={max}
                className={`${s.input} ${inputClassName}`}
                onChange={onChange}
                disabled={!editable}
            />
        </Flex>
    );
};
