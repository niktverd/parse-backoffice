import React from 'react';

import {Flex} from '../Flex/Flex';

import s from './PopupContainer.module.scss';

type PopupContainerProps = {
    title: string;
    subtitle: string;
    text: string;
    onClick: () => void;
};

export const PopupContainer = ({title, subtitle, text, onClick}: PopupContainerProps) => {
    return (
        <Flex className={s.background}>
            <div className={s.popup}>
                <h2 className={s.title}>{title}</h2>
                <div className={s.subtitle}>{subtitle}</div>
                <button className={s.container} onClick={onClick}>
                    {text}
                </button>
            </div>
        </Flex>
    );
};
