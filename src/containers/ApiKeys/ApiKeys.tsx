import React, {useCallback, useEffect, useState} from 'react';

import _ from 'lodash';

import {ApiKey} from '../../api/api-keys';
import {Flex} from '../../components/Flex/Flex';

import styles from './ApiKeys.module.scss';

type ApiKeysProps = {};

export const ApiKeys = (_props: ApiKeysProps) => {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [newApiKeyDescription, setNewApiKeyDescription] = useState<string>('');

    const fetchSources = useCallback(async () => {
        const response = await fetch('/api/api-keys');
        const json = await response.json();
        if (json.ok) {
            setApiKeys(json.data);
        }
    }, []);

    useEffect(() => {
        fetchSources();
    }, [fetchSources]);

    return (
        <Flex direction="column" className={styles.container} gap="s">
            <Flex direction="row">
                <input
                    type="text"
                    value={newApiKeyDescription}
                    onChange={({target}) => setNewApiKeyDescription(target.value)}
                />
                <button
                    onClick={async () => {
                        const resp = await fetch('/api/api-keys', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({description: newApiKeyDescription}),
                        });
                        const json = await resp.json();
                        if (json.ok) {
                            setApiKeys(json.data);
                        }
                    }}
                >
                    create new api key
                </button>
            </Flex>
            <Flex direction="column" className={styles.container}>
                {apiKeys.map(({value, description, isActive}) => {
                    return (
                        <Flex key={value} direction="row" gap="m" className={styles.row}>
                            <Flex grow={2}>{description}</Flex>
                            <Flex grow={1}>
                                <input type="text" value={value} style={{width: '100%'}} />
                            </Flex>
                            <Flex>{isActive ? 'active' : 'disabled'}</Flex>
                            <Flex>
                                <button
                                    onClick={async () => {
                                        const resp = await fetch('/api/api-keys', {
                                            method: 'PATCH',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({value}),
                                        });
                                        const json = await resp.json();
                                        if (json.ok) {
                                            setApiKeys(json.data);
                                        }
                                    }}
                                    disabled={!isActive}
                                >
                                    Disable
                                </button>
                            </Flex>
                        </Flex>
                    );
                })}
            </Flex>
        </Flex>
    );
};
