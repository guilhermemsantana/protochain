import Block from "./block";
import BlockInfo from "./interfaces/blockInfo";
import Validation from "./validation";

/**
 * Blockchain class
 */
export default class Blockchain {
    blocks: Block[];
    nextIndex: number = 0;
    static readonly DIFFICULTY_FACTOR = 5;
    static readonly MAX_DIFFICULTY = 62;

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
        const validation = block.isValid(lastBlock.index, lastBlock.hash, this.getDifficulty());
        
        if (!validation.success) {
            return new Validation(false, `Invalid block: ${validation.message}`);
        }

        this.blocks.push(block);
        this.nextIndex++;

        return new Validation();
    };

    /**
     * Gets one block based on hash or index
     * @param indexOrHash
     * @returns Returns the block if found based on its hash or index
     */
    getBlock(indexOrHash: string): Block | undefined {
        return this.blocks.find(block => block.index === parseInt(indexOrHash) || block.hash === indexOrHash);
    };

    /**
     * Validates the blockchain
     * @returns Returns true if the blockchain is valid
     */
    isValid(): Validation {
        for(let i = this.blocks.length - 1; i > 0; i--) {
            const currentBlock = this.blocks[i];
            const previousBlock = this.blocks[i - 1];
            const validation = currentBlock.isValid(previousBlock.index, previousBlock.hash, this.getDifficulty());

            if (!validation.success) {
                return new Validation(false, `Invalid block #${currentBlock.index}: ${validation.message}`);
            }
        };

        return new Validation();
    };

    /**
     * Gets the blockchain difficulty
     * @returns Returns the calculated blockchain difficulty
     */
    getDifficulty(): number {
        return Math.ceil(this.blocks.length / Blockchain.DIFFICULTY_FACTOR)
    };

    /**
     * Gets the blockchain miner reward rate
     * @returns Returns the blockchain transaction fee
     */
    getFeePerTx(): number {
        return 1;
    };

    /**
     * Gets the next block to be mined from the blockchain
     * @returns Returns the next block info
     */
    getNextBlock(): BlockInfo {
        return {
            data: new Date().toString(), 
            difficulty: this.getDifficulty(),
            previousHash: this.getLastBlock().hash,
            index: this.blocks.length,
            feePerTx: this.getFeePerTx(),
            maxDifficulty: Blockchain.MAX_DIFFICULTY
        } as BlockInfo;
    };
};