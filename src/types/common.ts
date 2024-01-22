import {ChangeEvent} from 'react';

export type SelectorArgs = {
    path: string;
    value: string | string[] | Record<string, string[]>;
};

export type OnSourceChangeArgs = ChangeEvent<HTMLInputElement> | SelectorArgs;

export type DrawOrder = 'direct' | 'reverse';
