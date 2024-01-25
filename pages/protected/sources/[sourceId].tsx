import {deepEqual} from 'assert';

import React, {useCallback, useEffect, useState} from 'react';

import _ from 'lodash';
import type {NextPage} from 'next';
import {useRouter} from 'next/router';

import {Source} from '../../../src/db/models';
import {OnSourceChangeArgs} from '../../../src/types/common';
import {Page} from '../../../src/ui/containers/Page/Page';
import {SourceLayout} from '../../../src/ui/containers/SourceLayout/SourceLayout';
import {deepCopy} from '../../../src/utils/json';
import {isEvent} from '../../../src/utils/typeguards';

const Guess: NextPage = () => {
    const {
        query: {sourceId},
    } = useRouter();

    const [source, setSource] = useState<Source | null>(null);
    const [initialSource, setInitialSource] = useState<Source | null>(null);
    const [isDirty, setIsDirty] = useState<boolean>(false);

    const getSource = useCallback(async () => {
        const response = await fetch(`/api/sources?sourceId=${sourceId}`);
        const json = await response.json();

        if (json.ok) {
            setSource(json.data);
            setInitialSource(deepCopy(json.data));
        }
    }, [sourceId]);

    const saveSource = useCallback(async () => {
        await fetch(`/api/sources`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({source}),
        });

        getSource();
    }, [getSource, source]);

    useEffect(() => {
        getSource();
    }, [getSource]);

    useEffect(() => {
        try {
            deepEqual(initialSource, source);
            setIsDirty(false);
        } catch (error) {
            setIsDirty(true);
        }
    }, [initialSource, source]);

    const onChange = useCallback(
        (entry: OnSourceChangeArgs) => {
            if (!source) {
                return;
            }

            if (isEvent(entry)) {
                const {name: path, value} = entry.target;
                setSource({...(_.set(source, path, value) as Source)});
                return;
            } else {
                const {path, value} = entry;
                setSource({...(_.set(source, path, value) as Source)});
            }
        },
        [source],
    );

    return (
        <Page selectedKey="sources">
            {source ? (
                <SourceLayout
                    getSource={getSource}
                    saveSource={saveSource}
                    source={source}
                    onChange={onChange}
                    isDirty={isDirty}
                />
            ) : null}
        </Page>
    );
};

export default Guess;
