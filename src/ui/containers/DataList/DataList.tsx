import React, {useCallback, useEffect, useState} from 'react';

import axios from 'axios';
import {saveAs} from 'file-saver';
import _ from 'lodash';
import Papa from 'papaparse';

export const convertToCSV = (data: Record<string, string>[]) => {
    const csv = Papa.unparse(data);
    return csv;
};
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
                <Flex direction="row" className={s.controls} gap="l">
                    <button
                        onClick={() => {
                            const csvData = convertToCSV(list);
                            const blob = new Blob([csvData], {type: 'text/csv;charset=utf-8'});
                            saveAs(
                                blob,
                                `parsing-results-${new Date()
                                    .toISOString()
                                    .replace(/[^0-9]/g, '')}.csv`,
                            );
                        }}
                    >
                        Save CSV
                    </button>
                    {isParseClicked ? (
                        <button onClick={() => getList()}>Load Data</button>
                    ) : (
                        <button
                            onDoubleClick={() => {
                                axios.post('/api/parse', {
                                    sourceId: source.data.id,
                                });
                                setList([]);
                                setIsParseClicked(true);
                            }}
                        >
                            Parse (double click)
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
