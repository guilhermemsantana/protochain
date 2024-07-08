import express, { Request, Response, NextFunction } from "express";
import Block from "../../lib/block";
import { blockchain } from "..";

const router = express.Router();

router.get("/status", (req: Request, res: Response, next: NextFunction) => {
    res.json(
        {
            numberOfBlocks: blockchain.blocks.length,
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

module.exports = (app: any) => app.use("/blockchain", router);