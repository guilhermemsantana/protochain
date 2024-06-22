import Block from "../src/lib/block";

describe("Block tests", () => {

    test('Should be valid', () => {
        const block: Block = new Block(1, "abc");
        const valid: boolean = block.isValid();
        expect(valid).toBeTruthy();
    })

    test('Should NOT be valid {index}', () => {
        const block: Block = new Block(-1, "abc");
        const valid: boolean = block.isValid();
        expect(valid).toBeFalsy();
    })

    test('Should NOT be valid {hash}', () => {
        const block: Block = new Block(1, "");
        const valid: boolean = block.isValid();
        expect(valid).toBeFalsy();
    })

})