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
        list: {container: ''},
        item: {container: ''},
    },
};
