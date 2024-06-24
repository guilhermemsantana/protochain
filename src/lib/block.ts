import sha256 from 'crypto-js/sha256'

/**
 * Block class
 */
export default class Block {
    index: number;
    timestamp: number;
    previousHash: string;
    hash: string;
    data: string;

    /**
     * Creates a new block
     * @param index The block index in blockchain
     * @param timestamp Time the block was created
     * @param previousHash The hash of the previous block
     * @param data: The block data
     * @param hash The block hash
     */
    constructor(index: number, previousHash: string, data: string) {
        this.index = index;
        this.timestamp = Date.now();
        this.previousHash = previousHash;
        this.data = data;
        this.hash = this.getHash();
    }

    /**
     * Generates block hash
     * @returns Returns a hash created from the block information
     */
    getHash(): string {
        return sha256(this.index + this.timestamp + this.previousHash + this.data).toString();
    }

    /**
     * Validates the block
     * @returns Returns true if the block is valid
     */
    isValid(previousIndex: number, previousHash: string): boolean {
        if (this.index - 1 !== previousIndex) return false;
        if (this.timestamp < 1) return false;
        if (this.previousHash !== previousHash) return false;
        if (this.hash !== this.getHash()) return false;
        if (!this.data) return false;
        return true;
    }
}
