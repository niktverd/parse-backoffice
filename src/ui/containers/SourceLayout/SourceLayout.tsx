import React, {useEffect, useState} from 'react';

import _ from 'lodash';

import {Source} from '../../../db/models';
import {OnSourceChangeArgs} from '../../../types/common';
import {Flex} from '../../components/Flex/Flex';
import {NavButton} from '../../components/NavButton/NavButton';
import {ConfigsForm} from '../ConfigsForm/ConfigsForm';
import {DataList} from '../DataList/DataList';
import {SettingsForm} from '../SettingsForm/SettingsForm';

import styles from './SourceLayout.module.scss';

type SourceLayoutProps = {
    source: Source;
    onChange: (event: OnSourceChangeArgs) => void;
    isDirty?: boolean;
    previewOnly?: boolean;
    getSource?: () => void;
    saveSource?: () => void;
};

enum Section {
    Overview = 'overview',
    Data = 'data',
    ConfigsList = 'configs-list',
    ConfigsItem = 'configs-item',
    SourceSettings = 'source-settings',
}

export const SourceLayout = ({
    source,
    onChange,
    previewOnly,
    isDirty = false,
    saveSource,
}: SourceLayoutProps) => {
    const [section, setSection] = useState<Section>(Section.Overview);

    useEffect(() => {
        if (section !== Section.Overview) {
            return;
        }
    }, [section, source]);

    return (
        <Flex className={styles.container}>
            <div className={styles['main-navigation']}>
                <NavButton
                    text="Overview"
                    onClick={() => setSection(Section.Overview)}
                    selected={section === Section.Overview}
                />
                <NavButton
                    text="Configs: List"
                    onClick={() => setSection(Section.ConfigsList)}
                    selected={section === Section.ConfigsList}
                />
                <NavButton
                    text="Configs: Item"
                    onClick={() => setSection(Section.ConfigsItem)}
                    selected={section === Section.ConfigsItem}
                />
                <NavButton
                    text="Source Settings"
                    onClick={() => setSection(Section.SourceSettings)}
                    selected={section === Section.SourceSettings}
                />
                <NavButton
                    text="Data"
                    onClick={() => setSection(Section.Data)}
                    selected={section === Section.Data}
                />
                <hr />
                {previewOnly ? null : (
                    <React.Fragment>
                        <NavButton
                            text={isDirty ? 'Save' : 'Saved'}
                            onClick={saveSource}
                            disabled={!isDirty}
                        />
                        <hr />
                    </React.Fragment>
                )}
            </div>
            <div className={styles['section']}>
                {section === Section.Overview ? (
                    <div>
                        Overview
                        <pre>{JSON.stringify(source, null, 3)}</pre>
                    </div>
                ) : null}
                {section === Section.SourceSettings ? (
                    <SettingsForm previewOnly={previewOnly} source={source} onChange={onChange} />
                ) : null}
                {section === Section.ConfigsItem ? (
                    <ConfigsForm prefix="item" source={source} onChange={onChange} />
                ) : null}
                {section === Section.ConfigsList ? (
                    <ConfigsForm prefix="list" source={source} onChange={onChange} />
                ) : null}
                {section === Section.Data ? <DataList source={source} /> : null}
            </div>
        </Flex>
    );
};
