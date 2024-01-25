// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataBase<T = any> = {
    ok: boolean;
    message: string;
    data?: T;
};
