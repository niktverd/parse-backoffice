import {ChangeEvent} from 'react';

import {OnProjectChangeArgs} from '../types/common';

export const isEvent = (entry: OnProjectChangeArgs): entry is ChangeEvent<HTMLInputElement> => {
    return 'target' in (entry as ChangeEvent<HTMLInputElement>);
};
