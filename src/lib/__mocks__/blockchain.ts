import Block from "./block";
import Validation from "../validation";
import { BlockInfo } from "../types/blockInfo";

/**
 * Mocked blockchain class
 */
export default class Blockchain {
    blocks: Block[];
    nextIndex: number = 0;

    /**
     * Creates a new mocked blockchain
     */
    constructor() {
        this.blocks = [
            new Block(
                {
                    index: 0,
                    hash: "abc",
                    previousHash: "",
                    data: "Genesis Block",
                    timestamp: Date.now()
                } as Block
            )
        ];
        this.nextIndex++;
    };

    /**
     * Gets the last block of the mocked blockchain
     * @returns Returns the block in the last position based on mocked blockchain length
     */
    getLastBlock(): Block {
        return this.blocks[this.blocks.length - 1];
    };

    /**
     * Adds a new block to the mocked blockchain
     * @returns Returns true when successfully adding a block to the mocked blockchain
     */
    addBlock(block: Block): Validation {
        if (block.index < 0) return new Validation(false, "Invalid mock block.");

        this.blocks.push(block);
        this.nextIndex++;

        return new Validation();
    };

    getBlock(indexOrHash: string): Block | undefined {
        return this.blocks.find(block => block.hash === indexOrHash || block.index === parseInt(indexOrHash));
    };

    /**
     * Validates the mocked blockchain
     * @returns Returns true if the mocked blockchain is valid
     */
    isValid(): Validation {
        return new Validation();
    };

    /**
     * Gets the next block to be mined from the mocked blockchain
     * @returns Returns the next block info
     */
    getNextBlock(): BlockInfo {
        return {
            data: new Date().toDateString(), 
            difficulty: 0,
            previousHash: this.getLastBlock().hash,
            index: 1,
            feePerTx: 1,
            maxDifficulty: 62
        } as BlockInfo;
    };
};