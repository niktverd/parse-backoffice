import React, {useMemo, useState} from 'react';

import _ from 'lodash';

import {Source} from '../../../db/models';
import {OnSourceChangeArgs} from '../../../types/common';
import {Flex} from '../../components/Flex/Flex';

import s from './ConfigsForm.module.scss';

type ConfigsFormProps = {
    source: Source;
    onChange: (event: OnSourceChangeArgs) => void;
    previewOnly?: boolean;
    prefix?: 'item' | 'list';
};

const views = {
    AddKey: 'add-key',
    AddValue: 'add-value',
};

export const ConfigsForm = ({source, onChange, prefix}: ConfigsFormProps) => {
    const dest = `configs[${prefix}]`;
    const [view, setView] = useState(views.AddKey);
    const [newKey, setNewKey] = useState('');

    const AddKey = useMemo(() => {
        return (
            <Flex direction="column">
                <h3>Key: </h3>
                <input
                    type="text"
                    value={newKey}
                    onChange={(event) => {
                        setNewKey(event.target.value);
                    }}
                />
                <button
                    onClick={() => {
                        const obj = _.get(source, dest);

                        if (newKey && !(newKey in obj)) {
                            setView(views.AddValue);
                        } else {
                            alert(' key must be provided and unique');
                        }
                    }}
                >
                    next
                </button>
            </Flex>
        );
    }, [dest, newKey, source]);
    const AddValue = useMemo(() => {
        return (
            <Flex direction="column">
                <h3>Value: </h3>
                <input
                    type="text"
                    value={_.get(source, `${dest}[${newKey}]`)}
                    onChange={onChange}
                    name={`${dest}[${newKey}]`}
                />
                <button
                    onClick={() => {
                        setView(views.AddKey);
                        setNewKey('');
                    }}
                >
                    finish
                </button>
            </Flex>
        );
    }, [dest, newKey, onChange, source]);

    const notice = useMemo(() => {
        const obj = _.get(source, dest);
        if (obj.container) {
            return null;
        }
        return <Flex direction="column" className={s.error}>
            Add &apos;container&apos; key
        </Flex>
    }, [dest, source])

    return (
        <Flex className={s.container} direction="column">
            <Flex direction="column">
                {notice}
            </Flex>
            <Flex direction="column">
                <h2>Add new option</h2>

                {view === views.AddKey ? AddKey : null}
                {view === views.AddValue ? AddValue : null}
            </Flex>
            <Flex direction="column" className={s.list}>
                {Object.entries(_.get(source, dest)).map(([key, value], index) => {
                    return (
                        <Flex key={`${key}-${value}-${index}`} direction="row" gap="m">
                            <Flex>{key}</Flex>
                            <Flex>:</Flex>
                            <Flex grow={5}>{value as string}</Flex>
                            <Flex>
                                <button
                                    onClick={() => {
                                        const config = _.get(source, `${dest}`);
                                        const newConfig = _.omit(config, key);
                                        onChange({path: `${dest}`, value: newConfig});
                                    }}
                                >
                                    delete
                                </button>
                            </Flex>
                        </Flex>
                    );
                })}
            </Flex>
        </Flex>
    );
};
