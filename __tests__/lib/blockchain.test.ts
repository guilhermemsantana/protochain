import Block from "../../src/lib/block";
import Blockchain from "../../src/lib/blockchain";

jest.mock("../../src/lib/block");

describe("Blockchain tests", () => {

    test("Should has genesis block", () => {
        const blockchain: Blockchain = new Blockchain();
        expect(blockchain.blocks.length).toEqual(1);
    });

    test("Should add block", () => {
        const blockchain: Blockchain = new Blockchain();
        const result = blockchain.addBlock(
            new Block(
                {
                    index: 1,
                    previousHash: blockchain.blocks[0].hash,
                    data: "data"
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
                data: "data"
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
                data: "data"
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
                    data: "data"
                } as Block
            )
        );

        expect(blockchain.isValid().success).toEqual(true);
    });

    test("Should NOT be valid", () => {
        const blockchain: Blockchain = new Blockchain();
        blockchain.addBlock(
            new Block(
                {
                    index: 1,
                    previousHash: blockchain.blocks[0].hash,
                    data: "data"
                } as Block
            )
        );
        blockchain.blocks[1].index = -1;

        expect(blockchain.isValid().success).toEqual(false);
    });

    test("Should get next block info", () => {
        const blockchain = new Blockchain();
        const info = blockchain.getNextBlock();
        expect(info.difficulty).toEqual(blockchain.getDifficulty());
        expect(info.previousHash).toEqual(blockchain.getLastBlock().hash);
        expect(info.index).toEqual(1);
        expect(info.feePerTx).toEqual(blockchain.getFeePerTx());
        expect(info.maxDifficulty).toEqual(Blockchain.MAX_DIFFICULTY);
    });

});