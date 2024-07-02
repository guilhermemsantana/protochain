import express from "express";
import morgan from "morgan";
import Blockchain from "../lib/blockchain";

/* c8 ignore next */
const PORT: number = parseInt(`${process.env.BLOCKCHAIN_PORT || 3000}`);
const app = express();

app.use(express.json());

/* c8 ignore start */
if (process.argv.includes("--run")) {
    app.use(morgan("tiny"));
};
/* c8 ignore end */

export const blockchain = new Blockchain();

require('./controllers')(app);

/* c8 ignore start */
if (process.argv.includes("--run")) {
    app.listen(PORT, () => {
        console.log(`Blockchain server is running at port ${PORT}`);
    });
};
/* c8 ignore end */

export {
    app
};