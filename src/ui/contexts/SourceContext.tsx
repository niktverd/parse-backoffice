import {uuid} from 'uuidv4';

import {Source} from '../../db/models';

export const initialSource: Source = {
    data: {
        id: uuid(),
        name: '',
        description: '',
        link: '',
        status: 'stop',
    },
    configs: {
        list: {container: ''},
        item: {container: ''},
    },
};
