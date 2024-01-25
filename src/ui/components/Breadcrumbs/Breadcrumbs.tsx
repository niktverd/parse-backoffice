import React from 'react';

import type {NextPage} from 'next';

import {Flex} from '../Flex/Flex';

import styles from './Breadcrumbs.module.scss';

type BreadcrumbsProps = {
    breadcrumbs: {
        label: string;
        url: string;
    }[];
};

export const Breadcrumbs: NextPage<BreadcrumbsProps> = ({breadcrumbs}: BreadcrumbsProps) => {
    return (
        <Flex className={styles.container}>
            {breadcrumbs.map((bc) => {
                return (
                    <div key={bc.url} className={styles.breadcrumb}>
                        <a href={bc.url}>{bc.label}</a> /
                    </div>
                );
            })}
        </Flex>
    );
};
