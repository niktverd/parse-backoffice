import {deepEqual} from 'assert';

import React, {useEffect, useState} from 'react';

import {ArrowUpRightFromSquare, FloppyDisk, FolderTree} from '@gravity-ui/icons';
import {pick} from 'lodash';
import {useRouter} from 'next/router';

import {Source} from '../../../db/models';
import {OnSourceChangeArgs} from '../../../types/common';
import {CardBase} from '../CardBase/CardBase';
import {CardField} from '../CardField/CardField';
import {CardHeaderContainer} from '../CardHeaderContainer/CardHeaderContainer';
import {Flex} from '../Flex/Flex';

import styles from './SourceCard.module.scss';

type SourceCardProps = Source['data'] & {
    onChange: (event: OnSourceChangeArgs) => void;
    updateSource: (sourceId: string) => void;
    namePrefix: string;
};

const getSource = (prjct: SourceCardProps) => pick(prjct, 'id', 'name', 'description');

export const SourceCard = (props: SourceCardProps) => {
    const {id, name, description, onChange, updateSource, namePrefix} = props;
    const [initialSource] = useState(getSource(props));
    const [editable, setEditable] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const source = getSource(props);
        try {
            deepEqual(initialSource, source);
            setIsDirty(false);
        } catch (error) {
            setIsDirty(true);
        }
    }, [initialSource, props]);

    return (
        <CardBase editable={editable}>
            <CardHeaderContainer
                icon={<FolderTree />}
                name={name}
                editable={editable}
                setEditable={setEditable}
                onChange={onChange}
                namePrefix={`${namePrefix}.name`}
            />
            <div>
                <input
                    type="text"
                    value={id}
                    className={styles.input}
                    disabled
                    style={{color: 'grey', fontSize: 12}}
                />
            </div>
            <div>
                {/* eslint-disable-next-line no-nested-ternary */}
                {editable ? (
                    <CardField
                        label="Description"
                        value={description}
                        type="text"
                        inputClassName={styles.input}
                        editable={editable}
                        onChange={onChange}
                        name={`${namePrefix}.description`}
                    />
                ) : description ? (
                    <div className={styles['description-container']}>
                        <h4>Description</h4>
                        <div className={styles.description}>{description}</div>
                    </div>
                ) : null}
            </div>
            <Flex className={styles['actions-container']}>
                <button
                    className={styles['button-container']}
                    onClick={() => updateSource(id)}
                    disabled={!isDirty}
                >
                    <FloppyDisk />
                </button>
                <button
                    className={styles['button-container']}
                    onClick={() => router.push(`/protected/sources/${id}`)}
                >
                    <ArrowUpRightFromSquare />
                </button>
            </Flex>
        </CardBase>
    );
};
