import React from 'react';

import {CirclePlus} from '@gravity-ui/icons';

import {Flex} from '../../Flex/Flex';

import styles from './AddCard.module.scss';

type AddCardProps = {
    placeholder?: string;
    onClick?: () => void;
};

export const AddCard = ({placeholder, onClick}: AddCardProps) => {
    return (
        <Flex direction="column" className={styles.container}>
            <button className={styles['button-container']} onClick={onClick}>
                <CirclePlus width={54} height={54} />
            </button>
            {placeholder ? <div className={styles.placeholder}>{placeholder}</div> : null}
        </Flex>
    );
};
