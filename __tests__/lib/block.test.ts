import Block from "../../src/lib/block";
import { BlockInfo } from "../../src/lib/types/blockInfo";

describe("Block tests", () => {

    const difficulty = 0; 
    const miner = "abc";
    let genesis: Block;

    beforeAll(() => {
        genesis = new Block(
            {
                index: 0,
                previousHash: "",
                data: "Genesis Block"
            } as Block
        );
    });

    test("Should be valid", () => {
        const block = new Block(
            {
                index: 1,
                previousHash: genesis.hash,
                data: "abc"
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
        const block = Block.fromBlockInfo({
            data: "Block 2",
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
                data: "abc"
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
                data: "abc"
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
                data: "abc"
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
                data: "abc"
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
                data: "abc"
            } as Block
        );
        const validation = block.isValid(genesis.index, genesis.hash, difficulty);
        expect(validation.success).toBeFalsy();
    });


    test("Should NOT be valid {data}", () => {
        const block: Block = new Block(
            {
                index: 1,
                previousHash: genesis.hash,
                data: ""
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

});