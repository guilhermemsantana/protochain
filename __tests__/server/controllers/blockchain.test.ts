import request from "supertest";
import { app } from "../../../src/server/index";
import Block from "../../../src/lib/block";
import { TransactionType } from "../../../src/lib/types/transactionType";
import Transaction from "../../../src/lib/transaction";

jest.mock("../../../src/lib/block");
jest.mock("../../../src/lib/blockchain");
jest.mock("../../../src/lib/transaction");

describe("Blockchain Controller Tests", () => {
    test("[GET] Should get blockchain status", async () => {
        const response = await request(app).get("/blockchain/status");
        
        expect(response.status).toEqual(200);
        expect(response.body.isValid.success).toBeTruthy();
        expect(response.body.isValid.message).toBeFalsy();
        expect(response.body.mempool).toEqual(1);
        expect(response.body.blocks).toEqual(1);
        expect(response.body.lastBlock.index).toEqual(0);
    });

    test("[GET] Should find genesis block by id", async () => {
        const response = await request(app).get("/blockchain/blocks/0");
        
        expect(response.status).toEqual(200);
        expect(response.body.index).toEqual(0);
        expect(response.body.hash).toEqual("abc");
        expect(response.body.previousHash).toEqual("");
        expect(response.body.timestamp).toBeTruthy;
        expect(response.body.timestamp).toBeGreaterThan(0);
        expect(response.body.timestamp).toBeLessThan(Date.now());
        expect(response.body.transactions).not.toBeUndefined();
        expect(response.body.transactions.length).toEqual(1);
        expect(response.body.transactions[0].type).toEqual(TransactionType.FEE);
        expect(response.body.transactions[0].timestamp).toBeGreaterThan(0);
        expect(response.body.transactions[0].data).toEqual("tx1");
        expect(response.body.transactions[0].hash).toEqual("abc");
    });

    test("[GET] Should find genesis block by hash", async () => {
        const response = await request(app).get("/blockchain/blocks/abc");
        
        expect(response.status).toEqual(200);
        expect(response.body.index).toEqual(0);
        expect(response.body.hash).toEqual("abc");
        expect(response.body.previousHash).toEqual("");
        expect(response.body.timestamp).toBeTruthy;
        expect(response.body.timestamp).toBeGreaterThan(1);
        expect(response.body.timestamp).toBeLessThan(Date.now());
        expect(response.body.transactions).not.toBeUndefined();
        expect(response.body.transactions.length).toEqual(1);
        expect(response.body.transactions[0].type).toEqual(TransactionType.FEE);
        expect(response.body.transactions[0].timestamp).toBeGreaterThan(0);
        expect(response.body.transactions[0].data).toEqual("tx1");
        expect(response.body.transactions[0].hash).toEqual("abc");
    });

    test("[GET] Should find all blocks", async () => {
        const response = await request(app).get("/blockchain/blocks");
        
        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(1);
        expect(response.body[0].index).toEqual(0);
        expect(response.body[0].hash).toEqual("abc");
        expect(response.body[0].previousHash).toEqual("");
        expect(response.body[0].timestamp).toBeTruthy;
        expect(response.body[0].timestamp).toBeGreaterThan(1);
        expect(response.body[0].timestamp).toBeLessThan(Date.now());
        expect(response.body[0].transactions).not.toBeUndefined();
        expect(response.body[0].transactions.length).toEqual(1);
        expect(response.body[0].transactions[0].type).toEqual(TransactionType.FEE);
        expect(response.body[0].transactions[0].timestamp).toBeGreaterThan(0);
        expect(response.body[0].transactions[0].data).toEqual("tx1");
        expect(response.body[0].transactions[0].hash).toEqual("abc");
    });

    test("[GET] Should find the next block info", async () => {
        const response = await request(app).get("/blockchain/blocks/next");
        
        expect(response.status).toEqual(200);
        expect(response.body.index).toEqual(1);
    });

    test("[GET] Should not find block by id", async () => {
        const response = await request(app).get("/blockchain/blocks/-1");
        
        expect(response.status).toEqual(404);
    });

    test("[GET] Should not find block by hash", async () => {
        const response = await request(app)
            .get("/blockchain/blocks/cba");
        
        expect(response.status).toEqual(404);
    });

    test("[POST] Should add block", async () => {
        const block = new Block({
            index: 1
        } as Block);
        const response = await request(app)
            .post("/blockchain/blocks")
            .send(block);
        
        expect(response.status).toEqual(201);
        expect(response.body.index).toEqual(1);
        expect(response.body.hash).toEqual("mock");
        expect(response.body.previousHash).toEqual("");
        expect(response.body.timestamp).toBeTruthy;
        expect(response.body.timestamp).toBeGreaterThan(1);
        expect(response.body.timestamp).toBeLessThan(Date.now());
        expect(response.body.transactions).not.toBeUndefined();
        expect(response.body.transactions.length).toEqual(0);
    });

    test("[POST] Should not add block {empty}", async () => {
        const response = await request(app)
            .post("/blockchain/blocks")
            .send({});
        
        expect(response.status).toEqual(422);
    });

    test("[POST] Should not add block {invalid}", async () => {
        const block = new Block({
            index: -1
        } as Block);
        const response = await request(app)
            .post("/blockchain/blocks")
            .send(block);
        
        expect(response.status).toEqual(400);
        expect(response.body.success).toBeFalsy();
        expect(response.body.message).toEqual("Invalid mock block.");
    });

    test("[GET] Should add transaction", async () => {
        const tx = new Transaction(
            {
                data: "tx1",
                hash: "xyz",
                type: TransactionType.REGULAR
            } as Transaction
        );

        const response = await request(app)
            .post("/blockchain/transactions")
            .send(tx);
        
        expect(response.status).toEqual(201);
        expect(response.body.type).toEqual(TransactionType.REGULAR);
        expect(response.body.timestamp).toBeGreaterThan(0);
        expect(response.body.hash).toEqual("xyz");
        expect(response.body.data).toEqual("tx1");
    });

    test("[GET] Should NOT add transaction (invalid data)", async () => {
        const tx = new Transaction(
            {
                data: ""
            } as Transaction
        );

        const response = await request(app)
            .post("/blockchain/transactions")
            .send(tx);
        
        expect(response.status).toEqual(400);
        expect(response.body.success).toBeFalsy();
        expect(response.body.message).toEqual("Invalid mock transaction.");
    });

    test("[GET] Should NOT add transaction (invalid hash)", async () => {
        const response = await request(app)
            .post("/blockchain/transactions")
            .send({});
        
        expect(response.status).toEqual(422);
    });

    test("[GET] Should get transaction", async () => {
        const response = await request(app)
            .get("/blockchain/transactions");

        expect(response.status).toEqual(200);
        expect(response.body.next).toBeTruthy();
        expect(response.body.next.length).toEqual(2);
        expect(response.body.next[0].type).toEqual(1);
        expect(response.body.next[0].timestamp).toBeGreaterThan(0);
        expect(response.body.next[0].data).toEqual("");
        expect(response.body.next[0].hash).toEqual("abc");
        expect(response.body.next[1].type).toEqual(1);
        expect(response.body.next[1].timestamp).toBeGreaterThan(0);
        expect(response.body.next[1].data).toEqual("tx1");
        expect(response.body.next[1].hash).toEqual("xyz");
    });

    test("[GET] Should get transaction (hash)", async () => {
        const response = await request(app)
            .get("/blockchain/transactions/xyz");

        expect(response.status).toEqual(200);
        expect(response.body.mempoolIndex).toEqual(0);
    });
});