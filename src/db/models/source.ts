export type Source = {
    data: {
        id: string;
        name: string;
        description: string;
        status: 'run' | 'stop';
    };
    configs: {
        list: Record<string, string>;
        item: Record<string, string>;
    };
};
