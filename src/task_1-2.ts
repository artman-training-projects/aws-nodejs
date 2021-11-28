import * as path from "path";
import * as fsAsync from "fs/promises";
import * as fsSync from "fs";
import { pipeline } from "stream/promises";
import csv from "csvtojson";
import { jsonToTxt, streamTransformCsvToTxt } from "./utils";
import { Writable } from "stream";

const CSV_FOLDER_PATH = path.join(__dirname, "./csv");

const csvFilePath = path.join(CSV_FOLDER_PATH, "task_1-2.csv");
const txtFilePath = path.join(CSV_FOLDER_PATH, "task_1-2.txt");
const pseudoDBFilePath = path.join(CSV_FOLDER_PATH, "task_1-2_DB.txt");

console.clear();
console.log("-=  Task 1.2  =-");
console.log(
    "Эта функция загружает 'csv',\n" +
        "конвертирует в 'json',\n" +
        "и сохраняет в 'txt'\n"
);
console.log("--- Start ---\n");

(async () => {
    try {
        console.log("- 1й вариант -");
        console.log(
            "Содержимое файла полностью загружается в память, потом пишется в файл"
        );

        const csvContent = await csv().fromFile(csvFilePath);
        const txtContent = jsonToTxt(csvContent);
        await fsAsync.writeFile(txtFilePath, txtContent, "utf8");

        console.log("   Операция выполнилась успешно\n");
    } catch (error) {
        console.error("   1й вариант, ошибка", error);
    }

    try {
        console.log("- 2й вариант -");
        console.log(
            "Содержимое файла постепенно считывается и пишется в файл, не загружаясь полностью в память"
        );

        await pipeline(
            fsSync.createReadStream(csvFilePath),
            csv(),
            streamTransformCsvToTxt(),
            fsSync.createWriteStream(txtFilePath)
        );

        console.log("   Операция выполнилась успешно\n");
    } catch (error) {
        console.error("   2й вариант, ошибка", error);
    }

    try {
        console.log("- 2й вариант * -");
        console.log(
            "Содержимое файла постепенно считывается и пишется в разные файлы, не загружаясь полностью в память"
        );

        const readCSV = fsSync.createReadStream(csvFilePath, {
            highWaterMark: 5,
        });

        class CustomWriter extends Writable {
            writableToFile = fsSync.createWriteStream(txtFilePath, {
                highWaterMark: 2,
            });
            writableToDB = fsSync.createWriteStream(pseudoDBFilePath, {
                highWaterMark: 1,
            });

            _write(chunk: Buffer, encoding: string, cb: any) {
                const canWriteToFile = this.writableToFile.write(chunk);
                const canWriteToDB = this.writableToDB.write(chunk);

                if (!canWriteToFile) {
                    this.writableToFile.once("drain", cb);
                    return;
                }
                if (!canWriteToDB) {
                    this.writableToDB.once("drain", cb);
                    return;
                }
            }
        }

        const writeToDifferentTargets = new CustomWriter();

        await pipeline(
            readCSV,
            csv(),
            streamTransformCsvToTxt(),
            writeToDifferentTargets
        );

        console.log("   Операция выполнилась успешно\n");
    } catch (error) {
        console.error("   2й вариант, ошибка", error);
    }

    console.log("--- Finish ---");
})();
