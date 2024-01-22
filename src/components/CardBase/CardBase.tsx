import React, {PropsWithChildren} from 'react';

import styles from './CardBase.module.scss';

type BaseCardProps = PropsWithChildren<{
    editable?: boolean;
}>;

export const CardBase = ({children, editable = false}: BaseCardProps) => {
    return <div className={`${styles.container} ${editable ? styles.edit : ''}`}>{children}</div>;
};
