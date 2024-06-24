import Blockchain from "../src/lib/blockchain";
import Block from "../src/lib/block";

describe("Blockchain tests", () => {

    test("Should has genesis block", () => {
        const blockchain: Blockchain = new Blockchain();
        expect(blockchain.blocks.length).toEqual(1);
    })

    test("Should add block", () => {
        const blockchain: Blockchain = new Blockchain();
        const result = blockchain.addBlock(new Block(1, blockchain.blocks[0].hash, "data"));
        expect(result.success).toEqual(true);
    })

    test("Should NOT add block", () => {
        const blockchain: Blockchain = new Blockchain();
        const block = new Block(-1, blockchain.blocks[0].hash, "data");
        const result = blockchain.addBlock(block);
        expect(result.success).toEqual(false);
    })

    test("Should get block", () => {
        const blockchain: Blockchain = new Blockchain();
        const block = new Block(1, blockchain.blocks[0].hash, "data");
        blockchain.addBlock(block);
        const result = blockchain.getBlock(block.hash);
        expect(result).toBeTruthy();
    })

    test("Should be valid {genesis}", () => {
        const blockchain: Blockchain = new Blockchain();
        expect(blockchain.isValid().success).toEqual(true);
    })

    test("Should be valid {two blocks}", () => {
        const blockchain: Blockchain = new Blockchain();
        blockchain.addBlock(new Block(1, blockchain.blocks[0].hash, "data"));
        expect(blockchain.isValid().success).toEqual(true);
    })

    test("Should NOT be valid", () => {
        const blockchain: Blockchain = new Blockchain();
        blockchain.addBlock(new Block(1, blockchain.blocks[0].hash, "data"));
        blockchain.blocks[1].data = "another data";
        expect(blockchain.isValid().success).toEqual(false);
    })

})