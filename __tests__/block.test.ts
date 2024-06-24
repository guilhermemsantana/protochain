import Block from "../src/lib/block";

describe("Block tests", () => {

    let genesis: Block;

    beforeAll(() => {
        genesis = new Block(0, "", "Genesis Block");
    })

    test("Should be valid", () => {
        const block = new Block(1, genesis.hash, "abc");
        const validation = block.isValid(genesis.index, genesis.hash);
        expect(validation.success).toBeTruthy();
    })

    test("Should NOT be valid {index}", () => {
        const block: Block = new Block(-1, genesis.hash, "abc");
        const validation = block.isValid(genesis.index, genesis.hash);
        expect(validation.success).toBeFalsy();
    })

    test("Should NOT be valid {timestamp}", () => {
        const block: Block = new Block(1, genesis.hash, "abc");
        block.timestamp = -1;
        block.hash = block.getHash();
        const validation = block.isValid(genesis.index, genesis.hash);
        expect(validation.success).toBeFalsy();
    })

    test("Should NOT be valid {previous hash}", () => {
        const block: Block = new Block(1, "previous", "abc");
        const validation = block.isValid(genesis.index, genesis.hash);
        expect(validation.success).toBeFalsy();
    })

    test("Should NOT be valid {hash}", () => {
        const block: Block = new Block(1, genesis.hash, "abc");
        block.hash = "";
        const validation = block.isValid(genesis.index, genesis.hash);
        expect(validation.success).toBeFalsy();
    })

    test("Should NOT be valid {data}", () => {
        const block: Block = new Block(1, genesis.hash, "");
        const validation = block.isValid(genesis.index, genesis.hash);
        expect(validation.success).toBeFalsy();
    })

})