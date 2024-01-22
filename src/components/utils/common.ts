export const randomHex = ({min = 0, max = 255}: {min?: number; max?: number}) => {
    const r = Math.round(Math.random() * (max - min) + min).toString(16);
    const g = Math.round(Math.random() * (max - min) + min).toString(16);
    const b = Math.round(Math.random() * (max - min) + min).toString(16);

    return `#${r}${g}${b}`;
};
