import express, { Request, Response, NextFunction } from "express";
import Block from "../../lib/block";
import { blockchain } from "..";
import Transaction from "../../lib/transaction";
import Blockchain from "../../lib/blockchain";

const router = express.Router();

router.get("/status", (req: Request, res: Response, next: NextFunction) => {
    res.json(
        {
            mempool: blockchain.mempool.length,
            blocks: blockchain.blocks.length,
            isValid: blockchain.isValid(),
            lastBlock: blockchain.getLastBlock()
        }
    )
});

router.get("/blocks", (req: Request, res: Response, next: NextFunction) => {
    res.json(blockchain.blocks);
});

router.get("/blocks/next", (req: Request, res: Response, next: NextFunction) => {
    res.json(blockchain.getNextBlock());
});

router.get("/blocks/:indexOrHash", (req: Request, res: Response, next: NextFunction) => {
    const block = blockchain.getBlock(req.params.indexOrHash);

    if (!block) {
        return res.sendStatus(404);
    }

    return res.json(block);
});

router.post("/blocks", (req: Request, res: Response, next: NextFunction) => {
    if(req.body.hash === undefined) return res.sendStatus(422);

    const block = new Block(req.body as Block);
    const validation = blockchain.addBlock(block);

    if (validation.success) {
        res.status(201).json(block);
    }
    else {
        res.status(400).json(validation);
    }
});

router.get("/transactions/:hash?", (req: Request, res: Response, next: NextFunction) => {
    if (req.params.hash) {
        res.json(blockchain.getTransaction(req.params.hash));
    }
    else {
        res.json(
            {
                next: blockchain.mempool.slice(0, Blockchain.TX_PER_BLOCK),
                total: blockchain.mempool.length
            }
        );
    }
});

router.post("/transactions", (req: Request, res: Response, next: NextFunction) => {
    if (req.body.hash === undefined) return res.sendStatus(422);

    const tx = new Transaction(req.body as Transaction);
    const validation = blockchain.addTransaction(tx);

    if (validation.success) {
        res.status(201).json(tx);
    }
    else {
        res.status(400).json(validation);
    }
});

module.exports = (app: any) => app.use("/blockchain", router);