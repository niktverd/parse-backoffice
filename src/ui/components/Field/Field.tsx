import React from 'react';

import type {NextPage} from 'next';

import {Flex} from '../Flex/Flex';

import styles from './Field.module.scss';

type FieldProps = {
    label: string;
    field: string | JSX.Element;
};

export const Field: NextPage<FieldProps> = ({label, field}: FieldProps) => {
    return (
        <Flex className={styles.container}>
            <div className={styles.label}>{label}</div>
            <div className={styles.field}>{field}</div>
        </Flex>
    );
};
