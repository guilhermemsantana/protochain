import Validation from "../validation";

/**
 * Mocked Block class
 */
export default class Block {
    index: number;
    timestamp: number;
    previousHash: string;
    hash: string;
    data: string;

    /**
     * Creates a new mock block
     * @param block The mocked block metadatas
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
     * @returns Returns a moked hash
     */
    getHash(): string {
        return this.hash || "mock";
    }

    /**
     * Validates the mocked block
     * @returns Returns true if the mocked block is valid
     */
    isValid(previousIndex: number, previousHash: string): Validation {
        if (!previousHash || previousIndex < 0 || this.index < 0) {
            return new Validation(false, "Invalid mock block.")
        }

        return new Validation();
    }
}