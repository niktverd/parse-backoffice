export type Source = {
    data: {
        id: string;
        name: string;
        description: string;
    };
    configs: {
        list: Record<string, string>;
        item: Record<string, string>;
    };
};
