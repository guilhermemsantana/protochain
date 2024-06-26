import Block from "./block";
import Validation from "./validation";

/**
 * Blockchain class
 */
export default class Blockchain {
    blocks: Block[];
    nextIndex: number = 0;

    /**
     * Creates a new blockchain
     */
    constructor() {
        this.blocks = [
            new Block(
                {
                    index: this.nextIndex,
                    previousHash: "",
                    data: "Genesis Block"
                } as Block
            )
        ];
        this.nextIndex++;
    };

    /**
     * Gets the last block of the blockchain
     * @returns Returns the block in the last position based on blockchain length
     */
    getLastBlock(): Block {
        return this.blocks[this.blocks.length - 1];
    };

    /**
     * Adds a new block to the blockchain
     * @returns Returns true when successfully adding a block to the blockchain
     */
    addBlock(block: Block): Validation {
        const lastBlock = this.getLastBlock();
        const validation = block.isValid(lastBlock.index, lastBlock.hash);
        
        if (!validation.success) {
            return new Validation(false, `Invalid block: ${validation.message}`);
        }

        this.blocks.push(block);
        this.nextIndex++;

        return new Validation();
    };

    getBlock(hash: string): Block | undefined {
        return this.blocks.find(block => block.hash === hash);
    };

    /**
     * Validates the blockchain
     * @returns Returns true if the blockchain is valid
     */
    isValid(): Validation {
        for(let i = this.blocks.length - 1; i > 0; i--) {
            const currentBlock = this.blocks[i];
            const previousBlock = this.blocks[i - 1];
            const validation = currentBlock.isValid(previousBlock.index, previousBlock.hash);

            if (!validation.success) {
                return new Validation(false, `Invalid block #${currentBlock.index}: ${validation.message}`);
            }
        };

        return new Validation();
    };
}