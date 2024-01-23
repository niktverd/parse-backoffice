import {ApiKey} from '../api/api-keys';

export type User = {
    id: string;
    email: string;
    name: string;
    apiKeys?: ApiKey[];
};
