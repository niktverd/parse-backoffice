import React, {useMemo, useState} from 'react';

import {CircleXmark, Magnifier, TrashBin} from '@gravity-ui/icons';
import {uniq} from 'lodash';

import {Product, Project} from '../../../business/types';
import {Plan} from '../../../business/types/plans';
import {Flex} from '../../Flex/Flex';

import s from './CardSelector.module.scss';

type CardSelectorProps = {
    project: Project;
    value: Array<string>;
    type: 'single' | 'array';
    source: 'plans' | 'products';
    label?: string;
    containerClassName?: string;
    inputClassName?: string;
    editable?: boolean;
    onChange?: (ids: Array<string>) => void;
    currentCard: Plan | Product;
};

export const CardSelector = ({
    value,
    label = '',
    onChange,
    inputClassName,
    editable,
    type = 'single',
    source,
    containerClassName,
    currentCard,
    project,
}: CardSelectorProps) => {
    const {sourceData} = project;
    const [query, setQuery] = useState('');
    const [showList, setShowList] = useState(false);

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const list = useMemo(
        () =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (sourceData[source] as any[]).filter((p) => {
                if (p.id === currentCard.id) {
                    return false;
                }

                if (!query) {
                    return true;
                }

                return p.id.includes(query) || p.name.includes(query);
            }),
        [currentCard.id, query, source, sourceData],
    );

    const handleSelect = (selectedId: string) => () => {
        if (type === 'single') {
            onChange?.([selectedId]);
            setShowList(false);
        }

        if (type === 'array') {
            onChange?.(uniq([...value, selectedId]));
        }
    };

    const items = useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (sourceData[source] as any[])
            .filter((item) => {
                return value?.includes(item.id);
            })
            .map((item) => item.id);
    }, [source, sourceData, value]);

    return (
        <Flex direction="column" className={`${s.container} ${containerClassName}`}>
            <label className={s.label}>
                <div className={s['label-text']}>{label}</div>
                <div>{type}</div>
            </label>
            {editable && (
                <Flex className={s['search-container']}>
                    <input
                        type={type}
                        value={query}
                        className={`${s.input} ${inputClassName}`}
                        onChange={handleQueryChange}
                        placeholder="Search"
                        onFocus={() => setShowList(true)}
                        // disabled={!editable}
                    />
                    <div>
                        <Magnifier />
                    </div>
                </Flex>
            )}
            {editable && showList && (
                <div className={s['search-list-container']}>
                    <div className={s['search-list']}>
                        <Flex className={s['search-list-header-container']}>
                            <div>
                                {list.length ? `Found ${list.length} items` : 'No items were found'}
                            </div>
                            <button
                                onClick={() => setShowList(false)}
                                className={s['search-list-header-close']}
                            >
                                <CircleXmark />
                            </button>
                        </Flex>
                        <div>
                            {list.map((item) => {
                                return (
                                    <div
                                        key={item.id}
                                        onClick={handleSelect(item.id)}
                                        className={s['search-list-item']}
                                    >
                                        {item.name}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
            {items.length ? (
                <div className={s['selected-list-container']}>
                    {items.map((selectedId) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const foundItem = (sourceData[source] as any[]).find(
                            (item) => item.id === selectedId,
                        );
                        if (!foundItem) {
                            return null;
                        }

                        const handleRemoveItem = (id: string) => () => {
                            onChange?.(items.filter((item) => item !== id));
                        };

                        return (
                            <Flex key={selectedId} className={s['selected-list-item']}>
                                <div>{foundItem.name}</div>
                                {editable && (
                                    <button
                                        onClick={handleRemoveItem(selectedId)}
                                        className={s['selected-list-item-delete']}
                                    >
                                        <TrashBin />
                                    </button>
                                )}
                            </Flex>
                        );
                    })}
                </div>
            ) : null}
        </Flex>
    );
};
