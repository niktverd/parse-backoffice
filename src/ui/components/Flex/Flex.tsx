import React, {DetailedHTMLProps, HTMLAttributes, useMemo} from 'react';

import type {NextPage} from 'next';

import s from './Flex.module.scss';

type FlexProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    direction?: 'row' | 'column';
    grow?: number;
    gap?: 's' | 'm' | 'l';
};

export const Flex: NextPage<FlexProps> = ({
    direction = 'row',
    children,
    grow,
    gap,
    className = undefined,
    ...props
}: FlexProps) => {
    const classes = useMemo(() => {
        const gapClassName = gap ? s[`gap-${gap}`] : undefined;
        return [className, s.display, direction === 'column' ? s.column : s.row, gapClassName]
            .filter(Boolean)
            .join(' ');
    }, [className, direction, gap]);

    return (
        <div {...props} className={classes} style={{flexGrow: grow}}>
            {children}
        </div>
    );
};
