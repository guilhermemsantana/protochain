import Block from "../../src/lib/block";
import Blockchain from "../../src/lib/blockchain";
import Transaction from "../../src/lib/transaction";

jest.mock("../../src/lib/block");
jest.mock("../../src/lib/transaction");

describe("Blockchain tests", () => {

    test("Should has genesis block", () => {
        const blockchain: Blockchain = new Blockchain();
        expect(blockchain.blocks.length).toEqual(1);
    });

    test("Should add block", () => {
        const blockchain: Blockchain = new Blockchain();
        const tx = new Transaction(
            {
                data: "tx1"
            } as Transaction
        );

        blockchain.mempool.push(tx);

        const result = blockchain.addBlock(
            new Block(
                {
                    index: 1,
                    previousHash: blockchain.blocks[0].hash,
                    transactions: [tx]
                } as Block
            )
        );

        expect(result.success).toEqual(true);
    });

    test("Should NOT add block", () => {
        const blockchain: Blockchain = new Blockchain();
        const block = new Block(
            {
                index: -1,
                previousHash: blockchain.blocks[0].hash,
                transactions: [
                    new Transaction(
                        {
                            data: "Block 2"
                        } as Transaction
                    )
                ]
            } as Block
        );
        const result = blockchain.addBlock(block);

        expect(result.success).toEqual(false);
    });

    test("Should get block", () => {
        const blockchain: Blockchain = new Blockchain();
        const block = new Block(
            {
                index: 1,
                previousHash: blockchain.blocks[0].hash,
                transactions: [
                    new Transaction(
                        {
                            data: "Block 2"
                        } as Transaction
                    )
                ]
            } as Block
        );
        blockchain.addBlock(block);
        const result = blockchain.getBlock(block.hash);

        expect(result).toBeTruthy();
    });

    test("Should be valid {genesis}", () => {
        const blockchain: Blockchain = new Blockchain();
        expect(blockchain.isValid().success).toEqual(true);
    });

    test("Should be valid {two blocks}", () => {
        const blockchain: Blockchain = new Blockchain();
        blockchain.addBlock(
            new Block(
                {
                    index: 1,
                    previousHash: blockchain.blocks[0].hash,
                    transactions: [
                        new Transaction(
                            {
                                data: "Block 2"
                            } as Transaction
                        )
                    ]
                } as Block
            )
        );

        expect(blockchain.isValid().success).toEqual(true);
    });

    test("Should NOT be valid", () => {
        const blockchain: Blockchain = new Blockchain();
        const tx = new Transaction(
            {
                data: "tx1"
            } as Transaction
        );

        blockchain.mempool.push(tx);

        blockchain.addBlock(
            new Block(
                {
                    index: 1,
                    previousHash: blockchain.blocks[0].hash,
                    transactions: [tx]
                } as Block
            )
        );
        blockchain.blocks[1].index = -1;

        expect(blockchain.isValid().success).toEqual(false);
    });

    test("Should get next block info", () => {
        const blockchain = new Blockchain();
        blockchain.mempool.push(new Transaction());
        const info = blockchain.getNextBlock();

        expect(info ? info.difficulty : 0).toEqual(blockchain.getDifficulty());
        expect(info ? info.previousHash : "").toEqual(blockchain.getLastBlock().hash);
        expect(info ? info.index : 0).toEqual(1);
        expect(info ? info.feePerTx : 0).toEqual(blockchain.getFeePerTx());
        expect(info ? info.maxDifficulty : 0).toEqual(Blockchain.MAX_DIFFICULTY);
    });

    test("Should NOT get next block info", () => {
        const blockchain = new Blockchain();
        const info = blockchain.getNextBlock();
        expect(info).toBeNull();
    });

    test("Should add transaction", () => {
        const blockchain: Blockchain = new Blockchain();
        const tx = new Transaction(
            {
                data: "tx1",
                hash: "xyz"
            } as Transaction
        );

        const validation = blockchain.addTransaction(tx);
        expect(validation.success).toBeTruthy();
    });

    test("Should NOT add transaction (invalid data)", () => {
        const blockchain: Blockchain = new Blockchain();
        const tx = new Transaction(
            {
                data: ""
            } as Transaction
        );

        const validation = blockchain.addTransaction(tx);
        expect(validation.success).toBeFalsy();
    });

    test('Should NOT add transaction (duplicated in blockchain)', () => {
        const blockchain = new Blockchain();
        const tx = blockchain.blocks[0].transactions[0];
        const validation = blockchain.addTransaction(tx);
        expect(validation.success).toBeFalsy();
        expect(validation.message).toEqual(`Duplicated tx in blockchain: ${tx.hash}`);
    });

    test('Should NOT add transaction (duplicated in mempool)', () => {
        const blockchain = new Blockchain();
        const tx = new Transaction(
            {
                data: "tx1",
                hash: "xyz"
            } as Transaction
        );
        blockchain.mempool.push(tx);

        const validation = blockchain.addTransaction(tx);
        expect(validation.success).toBeFalsy();
        expect(validation.message).toEqual(`Duplicated tx in mempool: ${tx.hash}`);
    });

    test("Should get transaction (mempool)", () => {
        const blockchain: Blockchain = new Blockchain();
        const tx = new Transaction(
            {
                data: "tx1",
                hash: "xyz"
            } as Transaction
        );
        blockchain.mempool.push(tx);

        const result = blockchain.getTransaction("xyz");
        expect(result.mempoolIndex).toEqual(0);
    });

    test("Should get transaction (blockchain)", () => {
        const blockchain: Blockchain = new Blockchain();
        const tx = new Transaction(
            {
                data: "tx1",
                hash: "xyz"
            } as Transaction
        );
        blockchain.blocks.push(
            new Block(
                {
                    transactions: [tx]
                } as Block
            )
        );

        const result = blockchain.getTransaction("xyz");
        expect(result.blockIndex).toEqual(1);
    });

    test("Should NOT get transaction", () => {
        const blockchain: Blockchain = new Blockchain();
        const result = blockchain.getTransaction("xyz");
        expect(result.blockIndex).toEqual(-1);
        expect(result.mempoolIndex).toEqual(-1);
        expect(result.transaction).toBeUndefined();
    });

});