import React from 'react';

import s from './NavButton.module.scss';

type NavButtonProps = {
    text: string;
    selected?: boolean;
    onClick?: () => void;
    disabled?: boolean;
};

export const NavButton = ({text, onClick, disabled = false, selected = false}: NavButtonProps) => {
    return (
        <button
            className={`${s.container} ${selected ? s.selected : ''}`}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    );
};
