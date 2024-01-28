export type Selector = Record<string, string> & {
    container: string;
}
export type Source = {
    data: {
        id: string;
        name: string;
        description: string;
        status: 'run' | 'stop';
    };
    configs: {
        list: Selector;
        item: Selector;
    };
};
