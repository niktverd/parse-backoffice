import React from 'react';

import {Check, Pencil} from '@gravity-ui/icons';
import type {NextPage} from 'next';

import {OnProjectChangeArgs} from '../../types/common';
import {Flex} from '../Flex/Flex';

import s from './CardHeaderContainer.module.scss';

type CardHeaderContainerProps = {
    icon: JSX.Element;
    name: string;
    namePrefix?: string;
    previewOnly?: boolean;
    editable?: boolean;
    setEditable?: React.Dispatch<React.SetStateAction<boolean>>;
    onChange?: (event: OnProjectChangeArgs) => void;
    onFinishEdit?: () => void;
    disabled?: boolean;
};

export const CardHeaderContainer: NextPage<CardHeaderContainerProps> = ({
    icon,
    name,
    previewOnly,
    namePrefix,
    editable = false,
    disabled = false,
    setEditable,
    onChange,
    onFinishEdit,
}: CardHeaderContainerProps) => {
    return (
        <Flex className={s['header-container']}>
            <Flex className={s['icon-container']}>{icon}</Flex>
            <div className={s['input-container']}>
                <input
                    type="text"
                    value={name}
                    className={s.input}
                    onChange={onChange}
                    disabled={disabled || !editable}
                    name={namePrefix}
                />
            </div>
            {previewOnly ? null : (
                <button
                    className={s['button-container']}
                    onClick={() => {
                        if (editable) {
                            onFinishEdit?.();
                        }
                        setEditable?.(!editable);
                    }}
                >
                    {editable ? <Check /> : <Pencil />}
                </button>
            )}
        </Flex>
    );
};
