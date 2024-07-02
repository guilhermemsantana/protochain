import express from "express";
import morgan from "morgan";
import Blockchain from "../lib/blockchain";

const PORT: number = 3000;
const app = express();
app.use(express.json());

if (process.argv.includes("--run")) {
    app.use(morgan("tiny"));
};

export const blockchain = new Blockchain();

require('./controllers')(app);

if (process.argv.includes("--run")) {
    app.listen(PORT, () => {
        console.log(`Blockchain server is running at port ${PORT}`);
    });
};

export {
    app
};