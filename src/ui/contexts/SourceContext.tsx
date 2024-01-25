import React from 'react';

import {uuid} from 'uuidv4';

import {Source} from '../../db/models';

export const initialSource: Source = {
    data: {
        id: uuid(),
        name: '',
        description: '',
        status: 'stop',
    },
    configs: {
        list: {},
        item: {},
    },
};

export type SourceContextProps = {
    source: Source;
    setSource: React.Dispatch<React.SetStateAction<Source>>;
};

export const SourceContext = React.createContext<SourceContextProps>({
    source: initialSource,
    setSource: () => null,
});
