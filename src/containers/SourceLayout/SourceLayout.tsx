import React, {useEffect, useState} from 'react';

// import {GetReportResponse} from '../../business/report';
import {Flex} from '../../components/Flex/Flex';
import {NavButton} from '../../components/NavButton/NavButton';
import {Source} from '../../types';
import {OnSourceChangeArgs} from '../../types/common';
import {GeneralForm} from '../guess/GeneralForm/GeneralForm';

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
    General = 'general',
    Plans = 'plans',
    Products = 'products',
}

export const SourceLayout = ({
    source,
    onChange,
    previewOnly,
    isDirty = false,
    saveSource,
}: SourceLayoutProps) => {
    // const [data, setData] = useState<GetReportResponse[] | null>(null);
    const [section, setSection] = useState<Section>(Section.Overview);

    useEffect(() => {
        if (section !== Section.Overview) {
            return;
        }

        // eslint-disable-next-line no-console
        // setData(getReport(sourceData, project));
    }, [section, source]);

    // const handleAddChart = () => {
    //     onChange({
    //         path: `viewConfigs`,
    //         value: [
    //             ...viewConfigs,
    //             {title: `Chart#${viewConfigs.length}`, description: '-', options: {}},
    //         ],
    //     });
    // };

    // const handleDeleteChart = (index: number) => () => {
    //     const newConfig = deepCopy(viewConfigs);
    //     newConfig.splice(index, 1);
    //     onChange({
    //         path: `viewConfigs`,
    //         value: newConfig,
    //     });
    // };

    return (
        <Flex className={styles.container}>
            <div className={styles['main-navigation']}>
                <NavButton
                    text="Overview"
                    onClick={() => setSection(Section.Overview)}
                    selected={section === Section.Overview}
                />
                <NavButton
                    text="General"
                    onClick={() => setSection(Section.General)}
                    selected={section === Section.General}
                />
                <NavButton
                    text="Products"
                    onClick={() => setSection(Section.Products)}
                    selected={section === Section.Products}
                />
                <NavButton
                    text="Plans"
                    onClick={() => setSection(Section.Plans)}
                    selected={section === Section.Plans}
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
                {/* {section === Section.Overview && data ? (
                    <div>
                        {viewConfigs.map((_viewConfig, index) => {
                            return (
                                <Chart
                                    onChange={onChange}
                                    namePrefix={`viewConfigs[${index}]`}
                                    key={index}
                                    reportData={data}
                                    project={project}
                                    handleDeleteChart={handleDeleteChart(index)}
                                    previewOnly={previewOnly}
                                />
                            );
                        })}
                        {previewOnly ? null : (
                            <button
                                className={styles['charts-add-button']}
                                onClick={handleAddChart}
                            >
                                <CirclePlusFill width={32} height={32} />
                            </button>
                        )}
                    </div>
                ) : null} */}
                {section === Section.General ? (
                    <GeneralForm previewOnly={previewOnly} source={source} onChange={onChange} />
                ) : null}
                {/* {section === Section.Products ? (
                    <GuessProductList
                        previewOnly={previewOnly}
                        products={project.sourceData.products}
                        onChange={onChange}
                        project={project}
                    />
                ) : null}
                {section === Section.Plans ? (
                    <GuessPlanList
                        project={project}
                        previewOnly={previewOnly}
                        plans={project.sourceData.plans}
                        onChange={onChange}
                    />
                ) : null} */}
            </div>
        </Flex>
    );
};
