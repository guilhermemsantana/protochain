import express from "express";
import morgan from "morgan";
import Blockchain from "../lib/blockchain";

const PORT: number = 3000;
const app = express();

app.use(morgan("tiny"));
app.use(express.json());

export const blockchain = new Blockchain();

require('./controllers')(app);

app.listen(PORT, () => {
    console.log(`Blockchain server is running at port ${PORT}`);
});