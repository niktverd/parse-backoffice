import React, {PropsWithChildren, useState} from 'react';

import {Button} from '../../components/Button/Button';
import {Flex} from '../../components/Flex/Flex';
import {DrawOrder} from '../../types/common';

import s from './Example.module.scss';

enum SelectedTab {
    Video = 'video-example',
    Real = 'real-example',
}

type ExampleProps = PropsWithChildren<{
    videoExample?: JSX.Element;
    realExample?: JSX.Element;
    drawOrder?: DrawOrder;
    exampleTitle?: string;
}>;

export const Example = ({
    children,
    videoExample,
    realExample,
    drawOrder = 'direct',
    exampleTitle = '',
}: ExampleProps) => {
    const [selectedTab, setSelectedTab] = useState(SelectedTab.Video);

    return (
        <Flex gap="s" className={`${s.container} ${s[drawOrder]}`}>
            {children && (
                <Flex grow={3} direction="column" className={s.content}>
                    {children}
                </Flex>
            )}
            <Flex grow={1} direction="column" className={s.examples}>
                <Flex direction="column" grow={1} className={s.examples}>
                    <Flex className={s['example-title']}>{exampleTitle}</Flex>
                    <Flex className={s.buttons}>
                        <Button
                            size="s"
                            text="Video"
                            view={selectedTab === SelectedTab.Video ? 'highlighted' : 'clear'}
                            onClick={() => setSelectedTab(SelectedTab.Video)}
                        />
                        <Button
                            size="s"
                            text="Real Form"
                            view={selectedTab === SelectedTab.Real ? 'highlighted' : 'clear'}
                            // view="secondary"
                            onClick={() => setSelectedTab(SelectedTab.Real)}
                        />
                    </Flex>
                </Flex>
                <Flex className={s.examples} grow={1}>
                    {selectedTab === SelectedTab.Video ? (
                        <Flex className={s.video}>{videoExample}</Flex>
                    ) : null}
                    {selectedTab === SelectedTab.Real ? (
                        <Flex direction="column" className={s.real}>
                            {realExample}
                        </Flex>
                    ) : null}
                </Flex>
            </Flex>
        </Flex>
    );
};
