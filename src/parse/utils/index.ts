type CommonPartArgs = {
    strings: string[];
    currentIndex?: number;
    previousIndexLeft?: number;
    previousIndexRight?: number;
    shortestString?: string;
};

export const commonPart = ({
    strings = [],
    currentIndex = 0,
    previousIndexLeft = 0,
    previousIndexRight = Infinity,
    shortestString = '',
}: CommonPartArgs): string => {
    let localShortestString = shortestString;

    if (!shortestString) {
        strings.sort((a, b) => b.length - a.length);
        localShortestString = strings[0] || '';
        return commonPart({
            strings,
            currentIndex: Math.round((localShortestString.length - 1) / 2),
            previousIndexLeft,
            previousIndexRight: localShortestString.length - 1,
            shortestString: localShortestString,
        });
    }

    const stem = localShortestString.slice(0, currentIndex);

    if (previousIndexLeft === previousIndexRight) {
        return stem;
    }

    const filtered = strings.filter((str) => str.includes(stem));

    if (filtered.length < strings.length) {
        return commonPart({
            strings,
            currentIndex: Math.floor((currentIndex + previousIndexLeft) / 2),
            previousIndexLeft,
            previousIndexRight: currentIndex - 1,
            shortestString: localShortestString,
        });
    } else {
        return commonPart({
            strings,
            currentIndex: Math.ceil((currentIndex + previousIndexRight) / 2),
            previousIndexLeft: currentIndex,
            previousIndexRight,
            shortestString: localShortestString,
        });
    }
};
