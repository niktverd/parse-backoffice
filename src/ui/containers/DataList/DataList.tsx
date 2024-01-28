import React, {useCallback, useEffect, useState} from 'react';

import axios from 'axios';
import _ from 'lodash';

import {Source} from '../../../db/models';
import {Flex} from '../../components/Flex/Flex';

import s from './DataList.module.scss';

type DataListProps = {
    source: Source;
};

export const DataList = ({source}: DataListProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [list, setList] = useState<Record<string, any>[]>([]);
    const [isParseClicked, setIsParseClicked] = useState(false);

    const getList = useCallback(async () => {
        if (!source.data.id) {
            return;
        }
        const resp = await axios.get('/api/data?sourceId=' + source.data.id);
        if (resp.status === 200) {
            setList(resp.data.data);
        }
    }, [source.data.id]);

    useEffect(() => {
        getList();
    }, [getList]);

    return (
        <Flex className={s.container} direction="column">
            <Flex direction="row" className={s.header}>
                <Flex direction="column" className={s.title}>
                    {source.data.id}
                </Flex>
                <Flex direction="column" className={s.controls}>
                    {isParseClicked ? (
                        <button onClick={() => getList()}>Load Data</button>
                    ) : (
                        <button
                            onClick={() => {
                                axios.post('/api/parse', {
                                    sourceId: source.data.id,
                                });
                                setList([]);
                                setIsParseClicked(true);
                            }}
                        >
                            Parse
                        </button>
                    )}
                </Flex>
            </Flex>
            <Flex direction="column" className={s.list}>
                {list.map((row) => {
                    return (
                        <Flex direction="row" key={row.id} gap="l" className={s.row}>
                            {Object.entries(row).map(([rowItemKey, rowItemValue], index) => {
                                return (
                                    <Flex
                                        key={`${rowItemKey}${rowItemValue}${index}`}
                                        className={s['row-item']}
                                    >
                                        {rowItemKey}: {rowItemValue}
                                    </Flex>
                                );
                            })}
                        </Flex>
                    );
                })}
            </Flex>
        </Flex>
    );
};
