import Block from "../../src/lib/block";
import Transaction from "../../src/lib/transaction";
import TransactionInput from "../../src/lib/transactionInput";
import { BlockInfo } from "../../src/lib/types/blockInfo";
import { TransactionType } from "../../src/lib/types/transactionType";

jest.mock("../../src/lib/transaction");
jest.mock("../../src/lib/transactionInput");

describe("Block tests", () => {

    const difficulty = 0; 
    const miner = "abc";
    let genesis: Block;

    beforeAll(() => {
        genesis = new Block({
            transactions: [new Transaction({
                txInput: new TransactionInput()
            } as Transaction)]
        } as Block);
    });

    test("Should be valid", () => {
        const block = new Block(
            {
                index: 1,
                previousHash: genesis.hash,
                transactions: [
                    new Transaction(
                        {
                            txInput: new TransactionInput()
                        } as Transaction
                    )
                ]
            } as Block
        );
        block.mine(difficulty, miner);
        const validation = block.isValid(genesis.index, genesis.hash, difficulty);
        expect(validation.success).toBeTruthy();
    });

    test("Should be valid {fallbacks}", () => {
        const block = new Block();
        const validation = block.isValid(genesis.index, genesis.hash, difficulty);
        expect(validation.success).toBeFalsy();
    });

    test("Should create a new block from info", () => {
        const block = Block.fromBlockInfo(
            {
                transactions: [
                    new Transaction(
                        {
                            txInput: new TransactionInput()
                        } as Transaction
                    )
                ],
                difficulty: difficulty,
                feePerTx: 1,
                index: 1,
                maxDifficulty: 62,
                previousHash: genesis.hash
            } as BlockInfo);
        block.mine(difficulty, miner);
        const validation = block.isValid(genesis.index, genesis.hash, difficulty);
        expect(validation.success).toBeTruthy();
    });

    test("Should NOT be valid {index}", () => {
        const block: Block = new Block(
            {
                index: -1,
                previousHash: genesis.hash,
                transactions: [
                    new Transaction(
                        {
                            txInput: new TransactionInput()
                        } as Transaction
                    )
                ]
            } as Block
        );
        const validation = block.isValid(genesis.index, genesis.hash, difficulty);
        expect(validation.success).toBeFalsy();
    });

    test("Should NOT be valid {timestamp}", () => {
        const block: Block = new Block(
            {
                index: 1,
                previousHash: genesis.hash,
                transactions: [
                    new Transaction(
                        {
                            txInput: new TransactionInput()
                        } as Transaction
                    )
                ]
            } as Block
        );
        block.timestamp = -1;
        block.hash = block.getHash();
        const validation = block.isValid(genesis.index, genesis.hash, difficulty);
        expect(validation.success).toBeFalsy();
    });

    test("Should NOT be valid {previous hash}", () => {
        const block: Block = new Block(
            {
                index: 1,
                previousHash: "previous",
                transactions: [
                    new Transaction(
                        {
                            txInput: new TransactionInput()
                        } as Transaction
                    )
                ]
            } as Block
        );
        const validation = block.isValid(genesis.index, genesis.hash, difficulty);
        expect(validation.success).toBeFalsy();
    });

    test("Should NOT be valid {empty hash}", () => {
        const block: Block = new Block(
            {
                index: 1,
                previousHash: genesis.hash,
                transactions: [
                    new Transaction(
                        {
                            txInput: new TransactionInput()
                        } as Transaction
                    )
                ]
            } as Block
        );
        block.mine(difficulty, miner);
        block.hash = "";
        const validation = block.isValid(genesis.index, genesis.hash, difficulty);
        expect(validation.success).toBeFalsy();
    });

    test("Should NOT be valid {no mined}", () => {
        const block: Block = new Block(
            {
                index: 1,
                previousHash: genesis.hash,
                transactions: [
                    new Transaction(
                        {
                            txInput: new TransactionInput()
                        } as Transaction
                    )
                ]
            } as Block
        );
        const validation = block.isValid(genesis.index, genesis.hash, difficulty);
        expect(validation.success).toBeFalsy();
    });


    test("Should NOT be valid {txInput}", () => {
        const txInput = new TransactionInput();
        txInput.amount = -1;

        const block: Block = new Block(
            {
                index: 1,
                previousHash: genesis.hash,
                transactions: [new Transaction({
                    txInput
                } as Transaction)]
            } as Block
        );
        const validation = block.isValid(genesis.index, genesis.hash, difficulty);
        expect(validation.success).toBeFalsy();
    });

    test("Should NOT be valid {fallbacks}", () => {
        const block = new Block();
        const validation = block.isValid(genesis.index, genesis.hash, difficulty);
        expect(validation.success).toBeFalsy();
    });

    test("Should NOT be valid (2 Fees Transactions)", () => {
        const block = new Block(
            {
                index: 1,
                previousHash: genesis.hash,
                transactions: [
                    new Transaction(
                        {
                            type: TransactionType.FEE,
                            txInput: new TransactionInput()
                        } as Transaction
                    ),
                    new Transaction(
                        {
                            type: TransactionType.FEE,
                            txInput: new TransactionInput()
                        } as Transaction
                    )
                ]
            } as Block
        );
        block.mine(difficulty, miner);
        const validation = block.isValid(genesis.index, genesis.hash, difficulty);
        expect(validation.success).toBeFalsy();
    });

});