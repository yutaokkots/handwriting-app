declare module '../data/masterKanji' {
    interface DictType {
        [key: string]: string[];
    }
    export const data: DictType;
}