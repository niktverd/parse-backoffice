import {useCallback} from 'react';

{
    /*
`Storage` User will determine what storage object will he/she be using. 
This way, user cant pass unnecessary string values
*/
}
type StorageType = 'session' | 'local';

{
    /*
`UseStorageReturnValue` This is just a return value type for our hook. 
We can add additional typings later.
*/
}
type UseStorageReturnValue = {
    getItem: (key: string, type?: StorageType) => string;
    setItem: (key: string, value: string, type?: StorageType) => boolean;
    removeItem: (key: string, type?: StorageType) => void;
};

const useStorage = (): UseStorageReturnValue => {
    const storageType = (type?: StorageType): 'localStorage' | 'sessionStorage' =>
        `${type ?? 'session'}Storage`;

    const isBrowser: boolean = ((): boolean => typeof window !== 'undefined')();

    const getItem = useCallback(
        (key: string, type?: StorageType): string => {
            return isBrowser ? window[storageType(type)][key] : '';
        },
        [isBrowser],
    );

    const setItem = useCallback(
        (key: string, value: string, type?: StorageType): boolean => {
            if (isBrowser) {
                window[storageType(type)].setItem(key, value);
                return true;
            }

            return false;
        },
        [isBrowser],
    );

    const removeItem = useCallback(
        (key: string, type?: StorageType): void => {
            if (isBrowser) {
                window[storageType(type)].removeItem(key);
            }
        },
        [isBrowser],
    );

    return {
        getItem,
        setItem,
        removeItem,
    };
};

export default useStorage;
