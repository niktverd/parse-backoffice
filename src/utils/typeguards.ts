import {ChangeEvent} from 'react';

import {OnSourceChangeArgs} from '../types/common';

export const isEvent = (entry: OnSourceChangeArgs): entry is ChangeEvent<HTMLInputElement> => {
    return 'target' in (entry as ChangeEvent<HTMLInputElement>);
};
