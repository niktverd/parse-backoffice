import React from 'react';

import _ from 'lodash';

import {Project} from '../../business/types';
import {OnProjectChangeArgs} from '../../types/common';
import {Flex} from '../Flex/Flex';

import styles from './ParameterControls.module.scss';

type ParameterControlsProps = {
    paramKey: string;
    namePrefix: string;
    index: number;
    project: Project;
    onChange: (event: OnProjectChangeArgs) => void;
};

export const ParameterControls = ({
    paramKey,
    index = 0,
    namePrefix,
    project,
    onChange,
}: ParameterControlsProps) => {
    const path = `${namePrefix}.options.${index}`;
    const {sourceData} = project;
    const temp = false;
    const destArray = _.get(project, path) || ([] as string[]);
    const selected = destArray.includes(paramKey);
    const handleSelect = () => {
        if (selected) {
            const value = [...destArray].filter((param) => param !== paramKey);
            onChange({value, path});
        } else {
            const value = [...destArray, paramKey];
            onChange({value, path});
        }
    };

    return (
        <div className={`${styles.container} ${selected ? styles['container-selected'] : ''}`}>
            <button className={styles.button} onClick={handleSelect}>
                <div className={`${styles.circle} ${selected ? styles['circles-selected'] : ''}`} />
                {sourceData.plans.find((p) => p.id === paramKey)?.name ||
                    sourceData.products.find((p) => p.id === paramKey)?.name ||
                    paramKey}
            </button>
            {temp ? (
                <Flex className={styles.axis}>
                    {/* <button className={styles['axis-selector']} onClick={onSelectAxis(paramKey, 1)}> */}
                    <button className={styles['axis-selector']} onClick={() => {}}>
                        +
                    </button>
                    <span className={styles['axis-selector-label']}>{'axis'}</span>
                    <button
                        className={styles['axis-selector']}
                        onClick={() => {}}
                        // onClick={onSelectAxis(paramKey, -1)}
                    >
                        -
                    </button>
                </Flex>
            ) : null}
        </div>
    );
};
