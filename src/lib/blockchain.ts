import Block from './block';

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
        this.blocks = [new Block(this.nextIndex, "", "Genesis Block")];
        this.nextIndex++;
    }

    /**
     * Gets the last block of the blockchain
     * @returns Returns the block in the last position based on blockchain length
     */
    getLastBlock(): Block {
        return this.blocks[this.blocks.length - 1];
    }

    /**
     * Adds a new block to the blockchain
     * @returns Returns true when successfully adding a block to the blockchain
     */
    addBlock(block: Block): boolean {
        const lastBlock = this.getLastBlock();
        if (!block.isValid(lastBlock.index, lastBlock.hash)) return false;

        this.blocks.push(block);
        this.nextIndex++;

        return true;
    }

    /**
     * Validates the blockchain
     * @returns Returns true if the blockchain is valid
     */
    isValid(): boolean {
        for(let i = this.blocks.length - 1; i > 0; i--) {
            const currentBlock = this.blocks[i];
            const previousBlock = this.blocks[i - 1];
            const valid = currentBlock.isValid(previousBlock.index, previousBlock.hash);

            if (!valid) return false;
        }

        return true;
    }
}