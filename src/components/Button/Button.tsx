import React from 'react';

import Link from 'next/link';

import s from './Button.module.scss';

type ButtonProps = {
    text: string;
    selected?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    view: 'primary' | 'secondary' | 'clear' | 'highlighted';
    url?: string;
    size?: 's' | 'm' | 'l';
};

export const Button = ({
    text,
    onClick,
    url,
    disabled = false,
    selected = false,
    view = 'secondary',
    size = 'm',
}: ButtonProps) => {
    const buttonContent = (
        <button
            className={`${s.container} ${selected ? s.selected : ''} ${s[view]} ${
                size ? s[`size-${size}`] : ''
            }`}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    );

    if (!url) {
        return buttonContent;
    }

    return <Link href={url}>{buttonContent}</Link>;
};
