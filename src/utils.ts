import { Transform } from "stream";

export const revertString = (string: string): string =>
    string.split("").reverse().join("");

export const jsonToTxt = (raws: Record<string, any>[]): string =>
    raws
        .slice()
        .map((raw) => JSON.stringify(raw))
        .join("\n");

export const streamTransformCsvToTxt = () =>
    new Transform({
        transform(chunk, encoding, callback) {
            callback(null, String(chunk));
        },
    });
