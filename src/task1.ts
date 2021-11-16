import * as readline from "readline";

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

const revertString = (string: string) => string.split("").reverse().join("");

async function startTask1() {
    console.clear();
    console.log("-=  Task 1  =-");
    console.log("Эта функция переворачивает строку");
    console.log("--- Start ---");
    let isRepeat = true;

    while (isRepeat) {
        const string: string = await getString();
        console.log(`Перевёрнутая строка: ${revertString(string)}`);
        isRepeat = await repeatTask();
    }

    rl.close();
    console.log("--- Finish ---");
}

startTask1();
