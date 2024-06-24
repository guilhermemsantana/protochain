import sha256 from "crypto-js/sha256";
import Validation from "./validation";

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
    isValid(previousIndex: number, previousHash: string): Validation {
        if (this.index - 1 !== previousIndex) return new Validation(false, "Invalid index");
        if (this.timestamp < 1) return new Validation(false, "Invalid timestamp");;
        if (this.previousHash !== previousHash) return new Validation(false, "Invalid previous hash");;
        if (this.hash !== this.getHash()) return new Validation(false, "Invalid hash");;
        if (!this.data) return new Validation(false, "Invalid data");;

        return new Validation();
    }
}