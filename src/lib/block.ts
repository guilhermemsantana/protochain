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
     * @param block The block metadatas
     */
    constructor(block?: Block) {
        this.index = block?.index || 0;
        this.timestamp = block?.timestamp || Date.now();
        this.previousHash = block?.previousHash || "";
        this.data = block?.data || "";
        this.hash = block?.hash || this.getHash();
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
        if (this.timestamp < 1) return new Validation(false, "Invalid timestamp");
        if (this.previousHash !== previousHash) return new Validation(false, "Invalid previous hash");
        if (this.hash !== this.getHash()) return new Validation(false, "Invalid hash");
        if (!this.data) return new Validation(false, "Invalid data");

        return new Validation();
    }
}