import Block from "../../src/lib/block";

describe("Block tests", () => {

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
        const validation = block.isValid(genesis.index, genesis.hash);
        expect(validation.success).toBeTruthy();
    });

    test("Should be valid {fallbacks}", () => {
        const block = new Block();
        block.data = "data";
        block.hash = block.getHash();
        const validation = block.isValid(-1, "");
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
        const validation = block.isValid(genesis.index, genesis.hash);
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
        const validation = block.isValid(genesis.index, genesis.hash);
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
        const validation = block.isValid(genesis.index, genesis.hash);
        expect(validation.success).toBeFalsy();
    });

    test("Should NOT be valid {hash}", () => {
        const block: Block = new Block(
            {
                index: 1,
                previousHash: genesis.hash,
                data: "abc"
            } as Block
        );
        block.hash = "";
        const validation = block.isValid(genesis.index, genesis.hash);
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
        const validation = block.isValid(genesis.index, genesis.hash);
        expect(validation.success).toBeFalsy();
    });

    test("Should NOT be valid {fallbacks}", () => {
        const block = new Block();
        const validation = block.isValid(genesis.index, genesis.hash);
        expect(validation.success).toBeFalsy();
    });

});