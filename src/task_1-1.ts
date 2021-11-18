import * as readline from "readline";
import { revertString } from "./utils";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});

const getString = (): Promise<string> =>
    new Promise((resolve) => {
        rl.question("\nВведите строку: ", (enteredString) => {
            resolve(enteredString);
        });
    });

const repeatTask = (): Promise<boolean> =>
    new Promise((resolve) => {
        rl.question("\nДля повтора нажмите 'y': ", (answer) => {
            resolve(answer === "y");
        });
    });

async function startTask1() {
    console.clear();
    console.log("-=  Task 1.1  =-");
    console.log("Эта функция переворачивает строку");
    console.log("--- Start ---");
    let isRepeat = true;

    while (isRepeat) {
        const string = await getString();
        const revertedString = revertString(string);

        console.log(`Перевёрнутая строка: ${revertedString}`);
        isRepeat = await repeatTask();
    }

    rl.close();
    console.log("--- Finish ---");
}

startTask1();
