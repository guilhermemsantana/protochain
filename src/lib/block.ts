import sha256 from "crypto-js/sha256";
import Validation from "./validation";
import { BlockInfo } from "./types/blockInfo";
import Transaction from "./transaction";
import { TransactionType } from "./types/transactionType";

/**
 * Block class
 */
export default class Block {
    index: number;
    timestamp: number;
    previousHash: string;
    hash: string;
    transactions: Transaction[];
    nonce: number;
    miner: string;

    /**
     * Creates a new block
     * @param block The block metadatas
     */
    constructor(block?: Block) {
        this.index = block?.index || 0;
        this.timestamp = block?.timestamp || Date.now();
        this.previousHash = block?.previousHash || "";
        
        this.transactions = block?.transactions
        ? block.transactions.map(tx => new Transaction(tx))
        : [] as Transaction[];
        
         this.nonce = block?.nonce || 0;
        this.miner = block?.miner || "";
        this.hash = block?.hash || this.getHash();
    };

    /**
     * Generates block hash
     * @returns Returns a hash created from the block information
     */
    getHash(): string {
        const txs = this.transactions && this.transactions.length
        ? this.transactions.map(tx => tx.hash).reduce((a, b) => a + b)
        : "";
        return sha256(this.index + txs + this.timestamp + this.previousHash + this.nonce + this.miner).toString();
    };

    /**
     * Generates a new valid hash for this block with the specified difficulty
     * @param difficulty The blockchain current difficulty
     * @param miner The miner wallet address
     */
    mine(difficulty: number, miner: string) {
        this.miner = miner;
        const prefix = new Array(difficulty + 1).join("0");

        do {
            this.nonce++;
            this.hash = this.getHash();
        }
        while (!this.hash.startsWith(prefix));
    }

    /**
     * Validates the block
     * @param previousIndex The previous block index
     * @param previousHash The previous block hash
     * @param difficulty The blockchain current difficulty
     * @returns Returns true if the block is valid
     */
    isValid(previousIndex: number, previousHash: string, difficulty: number): Validation {
        if (this.index - 1 !== previousIndex) return new Validation(false, "Invalid index");
        if (this.previousHash !== previousHash) return new Validation(false, "Invalid previous hash");
        if (this.timestamp < 1) return new Validation(false, "Invalid timestamp");
        
        if (this.transactions && this.transactions.length) {
            if (this.transactions.filter(tx => tx.type === TransactionType.FEE).length > 1) {
                return new Validation(false, "Too many fees transactions.");
            }

            const validations = this.transactions.map(tx => tx.isValid());
            const errors = validations.filter(v => !v.success).map(v => v.message);

            if (errors.length > 0) {
                return new Validation(false, "Invalid block due to invalid tx: " + errors.reduce((a, b) => a + b));
            }
        }
        
        if(!this.nonce || !this.miner) return new Validation(false, "No mined.");

        const prefix = new Array(difficulty + 1).join("0");
        if (this.hash !== this.getHash() || !this.hash.startsWith(prefix)) {
            return new Validation(false, "Invalid hash");
        }

        return new Validation();
    };

    /**
     * Gets a new block based on the blockchain next block info
     * @param blockInfo The block info
     * @returns Returns a new block from the block info
     */
    static fromBlockInfo(blockInfo: BlockInfo): Block {
        const { index, previousHash, transactions } = blockInfo;
        
        return new Block(
            {
                index,
                previousHash,
                transactions
            } as Block
        );
    };
};