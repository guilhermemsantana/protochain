import request from "supertest";
import { app } from "../../../src/server/index";
import Block from "../../../src/lib/block";
import { TransactionType } from "../../../src/lib/types/transactionType";

jest.mock("../../../src/lib/block");
jest.mock("../../../src/lib/blockchain");
jest.mock("../../../src/lib/transaction");

describe("Blockchain Controller Tests", () => {
    test("Should GET blockchain status", async () => {
        const response = await request(app).get("/blockchain/status");
        
        expect(response.status).toEqual(200);
        expect(response.body.isValid.success).toBeTruthy();
        expect(response.body.isValid.message).toBeFalsy();
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
});