import React, {useCallback, useEffect, useState} from 'react';

import _ from 'lodash';
import {useRouter} from 'next/router';

import {Source} from '../../../db/models';
import {OnSourceChangeArgs} from '../../../types/common';
import {isEvent} from '../../../utils/typeguards';
import {AddCard} from '../../components/AddCard/AddCard';
import {Flex} from '../../components/Flex/Flex';
import {PopupContainer} from '../../components/PopupContainer/PopupContainer';
import {SourceCard} from '../../components/SourceCard/SourceCard';

import styles from './SourceList.module.scss';

type SourceListProps = {
    previewOnly?: boolean;
};

export const SourceList = (_props: SourceListProps) => {
    const router = useRouter();
    const [sources, setSources] = useState<Source[]>([]);
    const [sourceId, setSourceId] = useState<string | null>(null);

    const fetchSources = useCallback(async () => {
        const response = await fetch('/api/sources');
        const json = await response.json();
        if (json.ok) {
            setSources(json.data);
        }
    }, []);

    const updateSource = useCallback(
        async (sourceItemId: string) => {
            const sourceItem = sources.find((prj) => prj.data.id === sourceItemId);
            if (!sourceItem) {
                return;
            }

            await fetch('/api/configs/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sourceItem),
            });
            fetchSources();
        },
        [fetchSources, sources],
    );

    const addSource = useCallback(async () => {
        const response = await fetch('/api/sources', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });
        const json = await response.json();
        if (json.ok) {
            setSourceId((json.data as Source)?.data.id || null);
            fetchSources();
        }
    }, [fetchSources]);

    useEffect(() => {
        fetchSources();
    }, [fetchSources]);

    const popupHandler = useCallback(() => {
        setSourceId(null);

        router.push(`/protected/sources/${sourceId}`);
    }, [sourceId, router]);

    const onChange = useCallback(
        (entry: OnSourceChangeArgs) => {
            if (!sources) {
                return;
            }

            if (isEvent(entry)) {
                const {name: path, value} = entry.target;
                setSources([...(_.set(sources, path, value) as Source[])]);
                return;
            } else {
                const {path, value} = entry;
                setSources([...(_.set(sources, path, value) as Source[])]);
            }
        },
        [sources],
    );

    return (
        <Flex direction="column" className={styles.container}>
            {sourceId ? (
                <PopupContainer
                    text="Open source"
                    title="Source was created"
                    subtitle={`Source with ID ${1} was successfully created`}
                    onClick={popupHandler}
                />
            ) : null}
            <div>
                <h1>Sources</h1>
            </div>
            <Flex className={styles.list}>
                {sources.map((sourceItem, index) => {
                    const namePrefix = `[${index}].data`;
                    return (
                        <SourceCard
                            {...sourceItem.data}
                            key={sourceItem.data.id}
                            onChange={onChange}
                            namePrefix={namePrefix}
                            updateSource={updateSource}
                        />
                    );
                })}
                <AddCard placeholder="Create new source" onClick={addSource} />
            </Flex>
        </Flex>
    );
};
